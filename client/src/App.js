import { Component } from 'react'

import './tailwind.output.css'
import './App.css';
import LoginLayout from "./components/LoginLayout"

import login from "./api/login"

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userName: "",
			userLoans: 0,
			userRequests: 0,
			userFines: 0,
			logoutTimeLeft: 61,
		}
	}
	componentDidMount() {
		this.timerId = window.setInterval(() => {
			const newLogoutTimeLeft = this.state.logoutTimeLeft > 1 ? this.state.logoutTimeLeft - 1 : 0
			this.setState({ logoutTimeLeft: newLogoutTimeLeft })
			console.log(this.state.logoutTimeLeft)
		}, 1000)
	}
	componentWillUnmount() {
		window.clearInterval(this.timerId)
	}
	doLogin(userId) {
		console.log(login({ userId }))
	}
	render() {
		return (
			<LoginLayout
				backgroundImageUrl={"blanchard.jpg"}
				library="Buswell Library"
				organization="Wheaton College"
				login={this.doLogin.bind(this)} />
		)
	}
}

export default App;
