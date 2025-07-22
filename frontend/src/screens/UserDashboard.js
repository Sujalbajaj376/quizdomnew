import React, { useState, useEffect, useCallback } from 'react'
import './UserDashBoard.css'
import CreatedQuizCard from '../components/CreatedQuizCard'
import JoinedQuizCard from '../components/JoinedQuizCard'
import LoadingScreen from './LoadingScreen'
import CreateQuiz from './CreateQuiz'

const UserDashboard = ({ user }) => {
	const [createdQuizzes, setCreatedQuizzes] = useState([])
	const [attemptedQuizzes, setAttemptedQuizzes] = useState([])
	const [loading, setLoading] = useState(true)
	const [editQuiz, setEditQuiz] = useState([])
	const [visibleCreated, setVisibleCreated] = useState(6) // Show first 6 created quizzes initially
	const [visibleAttempted, setVisibleAttempted] = useState(6) // Show first 6 attempted quizzes initially
	// Fetch Data from the API with memoized callback
	const fetchQuizData = useCallback(async () => {
		try {
			if (!user?.uid) {
				setLoading(false)
				return
			}
			
			// Add a loading indicator
			setLoading(true)
			
			// Use AbortController for fetch timeout
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
			
			const results = await fetch(`/API/users/${user.uid}`, {
				signal: controller.signal,
				headers: {
					'Cache-Control': 'no-cache',
					'Pragma': 'no-cache'
				}
			})
			
			clearTimeout(timeoutId)
			
			const quizData = await results.json()
			if (quizData.createdQuiz) setCreatedQuizzes(quizData.createdQuiz)
			if (quizData.attemptedQuiz) setAttemptedQuizzes(quizData.attemptedQuiz)
		} catch (error) {
			console.error('Error fetching quiz data:', error)
		} finally {
			setLoading(false)
		}
	}, [user])
	
	useEffect(() => {
		fetchQuizData()
	}, [fetchQuizData])

	const editQuizHandle = useCallback(async (title, questions, isOpen) => {
		if (!title) {
			setEditQuiz([])
			return
		}
		
		try {
			setLoading(true)
			
			// Use AbortController for fetch timeout
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
			
			const payload = {
				quizId: createdQuizzes[editQuiz]._id,
				uid: user.uid,
				title,
				questions,
				isOpen,
			}
			
			const results = await fetch('/API/quizzes/edit', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
				},
				signal: controller.signal
			})
			
			clearTimeout(timeoutId)
			
			const submitData = await results.json()
			
			// Update local state with optimistic update
			setCreatedQuizzes(prevQuizzes => {
				const updatedQuizzes = [...prevQuizzes]
				if (updatedQuizzes[editQuiz[0]]) {
					updatedQuizzes[editQuiz[0]].title = title
					updatedQuizzes[editQuiz[0]].questions = questions
					updatedQuizzes[editQuiz[0]].isOpen = isOpen
				}
				return updatedQuizzes
			})
		} catch (error) {
			console.error('Error updating quiz:', error)
		} finally {
			setEditQuiz([])
			setLoading(false)
		}
	}, [createdQuizzes, editQuiz, user])

	if (loading) return <LoadingScreen />

	if (editQuiz.length)
		return (
			<CreateQuiz
				user={user}
				quizTitle={createdQuizzes[editQuiz].title}
				questions={createdQuizzes[editQuiz].questions}
				isOpen={createdQuizzes[editQuiz].isOpen}
				editQuizHandle={editQuizHandle}
			/>
		)
	// Implement lazy loading for quiz cards
	
	// Load more quizzes when user scrolls or clicks "Load More"
	const loadMoreCreated = () => {
		setVisibleCreated(prev => prev + 6)
	}
	
	const loadMoreAttempted = () => {
		setVisibleAttempted(prev => prev + 6)
	}
	
	// Memoize the filtered quiz arrays to prevent unnecessary re-renders
	const visibleCreatedQuizzes = createdQuizzes.slice(0, visibleCreated)
	const visibleAttemptedQuizzes = attemptedQuizzes.slice(0, visibleAttempted)
	
	return (
		<div className='dash-body'>
			<div className='quizzes'>
				<div className='heading'>
					<div className='line-left' />
					<h2>Created </h2>
					<div className='line' />
				</div>
				<div className='card-holder'>
					{visibleCreatedQuizzes.map((quiz, key) => (
						<CreatedQuizCard
							key={key}
							index={key}
							setEditQuiz={setEditQuiz}
							title={quiz.title}
							code={quiz._id}
							responses={quiz.responses}
							questions={quiz.questions.length}
							isOpen={quiz.isOpen}
						/>
					))}
				</div>
				{createdQuizzes.length > visibleCreated && (
					<div className="load-more-container">
						<button className="load-more-button" onClick={loadMoreCreated}>
							Load More
						</button>
					</div>
				)}
			</div>
			<div className='quizzes'>
				<div className='heading'>
					<div className='line-left' />
					<h2>Attempted </h2>
					<div className='line' />
				</div>
				<div className='card-holder'>
					{visibleAttemptedQuizzes.map((quiz, key) => (
						<JoinedQuizCard
							key={key}
							title={quiz.title}
							score={quiz.responses[0].score}
							questions={quiz.totalQuestions}
						/>
					))}
				</div>
				{attemptedQuizzes.length > visibleAttempted && (
					<div className="load-more-container">
						<button className="load-more-button" onClick={loadMoreAttempted}>
							Load More
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserDashboard
