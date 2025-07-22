import React, { useState, useEffect } from 'react'
import './Home.css'
import { StyledFirebaseAuth } from 'react-firebaseui'
import LoadingScreen from './LoadingScreen'
import firebase from '../firebase/firebase'
import { FaGoogle, FaFacebook, FaEnvelope } from 'react-icons/fa'

const Home = ({ setUser }) => {
	const [loading, setLoading] = useState(true)
	const [animationComplete, setAnimationComplete] = useState(false)
	
	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID
		],
		callbacks: {
			signInSuccessWithAuthResult: () => false,
		},
		credentialHelper: 'none',
		tosUrl: '/terms',
		privacyPolicyUrl: '/privacy'
	}
	
	useEffect(() => {
		let isMounted = true
		
		// Set animation complete after a delay
		const animationTimer = setTimeout(() => {
			if (isMounted) setAnimationComplete(true)
		}, 1000)
		
		firebase.auth().onAuthStateChanged((user) => {
			if (user && isMounted) {
				setUser({
					uid: firebase.auth().currentUser.uid,
					name: firebase.auth().currentUser.displayName,
					email: firebase.auth().currentUser.email,
				})
				console.log('User Logged In')
			} else {
				console.log('User Signed Out')
				setUser({})
			}
			console.log('auth change')
			if (isMounted) setLoading(false)
		})
		
		return () => {
			isMounted = false
			clearTimeout(animationTimer)
		}
	}, [setUser])
	
	return (
		<>
			{loading ? (
				<LoadingScreen />
			) : (
				<div id='Home'>
					<div className='home-background'></div>
					<div className='home-content'>
						<div id='logo'>
							<div id='logo-name'>
								<b>Quiz</b>dom
							</div>
							<div id='description'>
								Elevate your learning experience with interactive quizzes. Create, share, and analyze results in one powerful platform.
							</div>
							<div className="features">
								<div className="feature-item">
									<span className="feature-icon">✓</span> Create unlimited quizzes
								</div>
								<div className="feature-item">
									<span className="feature-icon">✓</span> Real-time results & analytics
								</div>
								<div className="feature-item">
									<span className="feature-icon">✓</span> Easy sharing with unique codes
								</div>
								<div className="feature-item">
									<span className="feature-icon">✓</span> Accessibility features included
								</div>
							</div>
						</div>

						<div id='login-card' className={animationComplete ? 'animation-complete' : ''}>
							<div className='login-header'>
								<div className='login-logo'>
									<b>Q</b>
								</div>
								<h2 className="login-title">Welcome to Quizdom</h2>
								<p className="login-subtitle">Sign in to continue to your account</p>
							</div>
							
							<div className="custom-auth-buttons">
							<button 
								className="auth-button google-button"
								onClick={() => firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())}
							>
								<FaGoogle className="auth-icon" /> Sign in with Google
							</button>
							<button 
								className="auth-button facebook-button"
								onClick={() => firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())}
							>
								<FaFacebook className="auth-icon" /> Sign in with Facebook
							</button>
							<button 
								className="auth-button email-button"
								onClick={() => {
									// Show the Firebase UI email sign-in
									const firebaseContainer = document.querySelector('.firebase-auth-container');
									if (firebaseContainer) {
										firebaseContainer.style.display = 'block';
									}
								}}
							>
								<FaEnvelope className="auth-icon" /> Sign in with Email
							</button>
						</div>
							
							<div className="firebase-auth-container">
								<StyledFirebaseAuth
									uiConfig={uiConfig}
									firebaseAuth={firebase.auth()}
									className="firebase-auth"
								/>
							</div>
							
							<p className="terms-text">
								By signing in, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Home
