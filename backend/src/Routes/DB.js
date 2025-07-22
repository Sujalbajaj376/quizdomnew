require('dotenv').config(); // <-- Load environment variables
const MongoClient = require('mongodb').MongoClient;
const Evaluate = require('../Algorithms/EvaluateQuiz');
const ObjectId = require('mongodb').ObjectId;

let db;

const DBStart = async () => {
	console.log('DB server connecting...');
	const API_KEY = process.env.MONGO_URL; // <-- Get from .env
	const client = await MongoClient.connect(API_KEY, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log('DB Connected Successfully.');
	db = client.db('quizdom-project');
};

DBStart();

const withDB = async (operations, res) => {
	try {
		await operations(db);
	} catch (error) {
		console.log('Error connecting to DB : ', error);
		res.status(500).json({ message: 'Error Connecting to db ', error });
	}
};

const createUser = async (uid, name, email, res) => {
	await withDB(async (db) => {
		const user = await db.collection('users').findOne({ uid: uid });
		if (!user) {
			await db.collection('users').insertOne({
				uid,
				name,
				email,
				createdQuiz: [],
				attemptedQuiz: []
			});
			res.status(200).json({ message: 'User Created successfully.' });
		} else {
			res.status(200).json({ message: 'User Record Exist' });
		}
	});
};

const createQuiz = async (quiz, res) => {
	try {
		await withDB(async (db) => {
			quiz['responses'] = [];
			const result = await db.collection('quizzes').insertOne(quiz);
			res.status(200).json({
				message: 'Quiz created successfully',
				quizId: result.insertedId
			});
			const query = { uid: quiz.uid };
			const addQuiz = { $push: { createdQuiz: result.insertedId } };
			await db.collection('users').updateOne(query, addQuiz);
		});
	} catch (error) {
		res.status(500).json({ message: 'Error creating quiz', error });
	}
};

const submitQuiz = async (submittedQuiz, res) => {
	withDB(async (db) => {
		try {
			const validationCursor = db.collection('users').find({
				$and: [
					{ uid: submittedQuiz.uid },
					{ attemptedQuiz: ObjectId(submittedQuiz.quizId) }
				]
			});
			const quizData = await validationCursor.toArray();

			if (quizData[0]) {
				return res.status(200).json({ error: 'ERR:QUIZ_ALREADY_ATTEMPTED' });
			}

			const cursor = db
				.collection('quizzes')
				.find({ _id: new ObjectId(submittedQuiz.quizId) })
				.project({ questions: 1 });

			const quiz = await cursor.toArray();
			const score = Evaluate(quiz[0].questions, submittedQuiz.questions);
			res.status(200).json({ score });

			await db.collection('quizzes').updateOne(
				{ _id: new ObjectId(submittedQuiz.quizId) },
				{ $push: { responses: { uid: submittedQuiz.uid, score: score } } }
			);

			await db.collection('users').updateOne(
				{ uid: submittedQuiz.uid },
				{ $push: { attemptedQuiz: ObjectId(submittedQuiz.quizId) } }
			);
		} catch (error) {
			console.log('Error:', error);
			res.status(500).json({ error });
		}
	});
};

const getResponses = (obj, res) => {
	withDB(async (db) => {
		const cursor = db
			.collection('quizzes')
			.find({ _id: new ObjectId(obj.quizCode), uid: obj.uid })
			.project({ responses: 1 });
		const cursorData = await cursor.toArray();
		const responses = cursorData[0].responses;
		const uidList = responses.map((response) => response.uid);

		const cursor2 = db
			.collection('users')
			.find({ uid: { $in: uidList } })
			.project({ uid: 1, name: 1, email: 1 });

		const cursor2Data = await cursor2.toArray();
		const finalResponse = cursor2Data.map((data) => {
			const index = responses.findIndex((resp) => resp.uid === data.uid);
			return {
				name: data.name,
				email: data.email,
				score: responses[index].score
			};
		});

		res.status(200).json({ finalResponse });
	});
};

module.exports = {
	withDB,
	createUser,
	createQuiz,
	submitQuiz,
	getResponses
};
