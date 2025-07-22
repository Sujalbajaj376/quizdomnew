const express = require('express')
const ObjectId = require('mongodb').ObjectId
const Router = express.Router()
const DB = require('./DB')

// Create User in DB
Router.post('/create', (req, res) => {
	const { uid, name, email } = req.body
	if (!uid) return res.status(500).json({ error: 'Incomplete Parameters' })

	DB.createUser(uid, name, email, res)
})

// Get user Data with performance optimizations
Router.get('/:uid', (req, res) => {
	const uid = req.params.uid
	if (!uid) return res.status(500).json({ error: 'Incomplete Parameters' })

	// Add cache control headers
	res.set('Cache-Control', 'private, max-age=300') // Cache for 5 minutes
	
	DB.withDB(async (db) => {
		try {
			// Run queries in parallel for better performance
			const [createdQuiz, userInfo] = await Promise.all([
				// Query for created quizzes with limit and optimized projection
				db.collection('quizzes')
					.find({ uid })
					.project({
						isOpen: 1,
						title: 1,
						questions: 1,
						responses: {
							$size: '$responses',
						},
					})
					.toArray(),
				
				// Query for user info
				db.collection('users')
					.find({ uid })
					.project({ attemptedQuiz: 1 })
					.toArray()
			])
			
			// Check if user info exists and has attempted quizzes
			let attemptedQuiz = []
			if (userInfo && userInfo.length > 0 && userInfo[0].attemptedQuiz && userInfo[0].attemptedQuiz.length > 0) {
				attemptedQuiz = await db.collection('quizzes')
					.find({ _id: { $in: userInfo[0].attemptedQuiz } })
					.project({
						title: 1,
						totalQuestions: {
							$size: '$questions',
						},
						responses: { $elemMatch: { uid } },
					})
					.toArray()
			}
			
			// Send response
			res.status(200).json({ createdQuiz, attemptedQuiz })
		} catch (error) {
			console.error('Error fetching user data:', error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}, res)
})

module.exports = Router
