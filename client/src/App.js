import { Component } from 'react'

import './tailwind.output.css'
import './App.css';

import LoginLayout from "./components/LoginLayout"
import CheckoutLayout from './components/CheckoutLayout';

import login from "./api/login"

const ALERT_TIMEOUT_SECONDS = 10

const INITIAL_STATE = {
	loggedIn: false,
	userName: "",
	userLoans: 0,
	userRequests: 0,
	userFines: 0,
	loginFailureMessage: "",
	logoutTimeLeft: 61,
	showAlert: false,
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = Object.assign({}, INITIAL_STATE)
	}
	doLogin(userId) {
		const newUser = login({ userId })
		if ("failureMessage" in newUser) {
			this.setState({ loginFailureMessage: newUser.failureMessage, showAlert: true })
			window.clearTimeout(this.failureMessageTimeout)
			this.failureMessageTimeout = window.setTimeout(() => {
				this.setState({ showAlert: false })
			}, ALERT_TIMEOUT_SECONDS * 1000)
		}
		else {
			const { userName, userLoans, userRequests, userFines } = newUser
			this.setState({
				userName, userLoans, userRequests, userFines,
				logoutTimeLeft: 61,
				loggedIn: true,
			})
		}
	}
	doLogout() {
		this.setState(Object.assign({}, INITIAL_STATE))
	}


	componentDidMount() {
		this.timerId = window.setInterval(() => {
			if (this.state.logoutTimeLeft - 1 === 0) {
				this.doLogout()
			}
			const newLogoutTimeLeft = this.state.logoutTimeLeft > 1 ? this.state.logoutTimeLeft - 1 : 0
			this.setState({ logoutTimeLeft: newLogoutTimeLeft })
			console.log(this.state.logoutTimeLeft)
		}, 1000)
	}
	componentWillUnmount() {
		window.clearInterval(this.timerId)
	}
	render() {
		if (this.state.loggedIn) {
			return <CheckoutLayout
				library="Buswell Library"
				organization="Wheaton College"
				userName={this.state.userName}
				userLoans={this.state.userLoans}
				userRequests={this.state.userRequests}
				userFines={this.state.userFines}
				timeout={this.state.logoutTimeLeft}
				booksCheckedOut={[{ dueDate: "01/22/1924", author: "Daniel Block", title: "The Gospel According to Moses" }]}
			/>
		}
		else {
			return <LoginLayout
				backgroundImageUrl={"blanchard.jpg"}
				library="Buswell Library"
				organization="Wheaton College"
				login={this.doLogin.bind(this)}
				showAlert={this.state.showAlert}
				alertMessage={this.state.loginFailureMessage}
			/>
		}
	}
}

export default App;
