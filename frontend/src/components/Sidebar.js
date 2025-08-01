import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Sidebar.css'
import { Icon } from '@material-ui/core'
import {
	CreateNewFolder,
	Dashboard,
	ExitToApp,
	MeetingRoom,
	MenuOpenRounded,
	MenuRounded,
} from '@material-ui/icons'
import firebase from '../firebase/firebase'

function Sidebar({ setUser }) {
	const [signOut, setSignOut] = useState(false)
	const SidedbarData = [
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: <Dashboard />,
			CName: 'nav-text',
		},
		{
			title: 'Join Quiz',
			path: '/join-quiz',
			icon: <MeetingRoom />,
			CName: 'nav-text',
		},
		{
			title: 'Create Quiz',
			path: '/create-quiz',
			icon: <CreateNewFolder />,
			CName: 'nav-text',
		},
	]
	const [sidebar, setSidebar] = useState(false)
	const showSidebar = () => setSidebar(!sidebar)
	if (signOut) return <Redirect to='/' />

	const handleSignOut = () => {
		console.log('Signing out user')
		firebase.auth().signOut().then(() => {
			console.log('User signed out successfully')
			setUser({})
			setSignOut(true)
		}).catch((error) => {
			console.error('Sign out error:', error)
		})
	}

	return (
		<div>
			<Icon className='menu-bars' onClick={showSidebar}>
				<MenuRounded />
			</Icon>
			{/* <FaIcons.FaBars  onClick={} /> */}
			<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
				<ul className='nav-menu-items' onClick={showSidebar}>
					<li className='navbar-toggle'>
						<Icon>
							<MenuOpenRounded fontSize='large' />
						</Icon>
					</li>
					{SidedbarData.map((item, index) => {
						return (
							<li key={index} className='nav-text'>
								<Link to={item.path}>
									<Icon>{item.icon}</Icon>
									<span className='nav-item-title'>{item.title}</span>
								</Link>
							</li>
						)
					})}
					{/* Sign Out Button */}
					<li className='nav-text sign-out'>
						<button
							onClick={handleSignOut}
						>
							<Icon>
								<ExitToApp />
							</Icon>
							<span className='nav-item-title'>{'SignOut'}</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Sidebar
