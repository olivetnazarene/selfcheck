import { Component } from 'react'

import './tailwind.output.css'
// import './App.css';

import LoginLayout from "./components/LoginLayout"
import CheckoutLayout from './components/CheckoutLayout';

import login from "./api/login"
import checkout from "./api/checkout"

const LOGIN_ALERT_TIMEOUT_SECONDS = 10
const CHECKOUT_ALERT_TIMEOUT_SECONDS = 2
const LOGOUT_TIME_LIMIT = 60

const INITIAL_STATE = {
	loggedIn: false,
	userName: "",
	userLoans: 0,
	userRequests: 0,
	userFines: 0,
	userId: null,
	loginAlertMessage: "",
	showLoginAlert: false,
	logoutTimeLeft: LOGOUT_TIME_LIMIT,
	showCheckoutAlert: false,
	checkoutAlertMessage: "",
	booksCheckedOut: [],
}

class App extends Component {
	userBarcode = null
	constructor(props) {
		super(props)
		this.state = Object.assign({}, INITIAL_STATE)
	}
	async doLogin(userBarcode) {
		const newUser = await login({ userBarcode })
		if ("failureMessage" in newUser) {
			this.setState({ loginAlertMessage: newUser.failureMessage, showLoginAlert: true })
			window.clearTimeout(this.loginFailureMessageTimeout)
			this.loginFailureMessageTimeout = window.setTimeout(() => {
				this.setState({ showLoginAlert: false })
			}, LOGIN_ALERT_TIMEOUT_SECONDS * 1000)
		}
		else {
			const { userName, userLoans, userRequests, userFines, userId } = newUser
			this.setState({
				userName, userLoans, userRequests, userFines, userId,
				showLoginAlert: false,
				logoutTimeLeft: LOGOUT_TIME_LIMIT,
				loggedIn: true,
			})
			this.userBarcode = userId
		}
	}
	doLogout() {
		this.setState(Object.assign({}, INITIAL_STATE))
	}
	async doCheckoutBook(bookBarcode) {
		// Allow Logout by scanning barcode
		if (bookBarcode === this.userBarcode) {
			return this.doLogout()
		}

		const checkedOutBarcodes = this.state.booksCheckedOut.map(b => b.barcode)
		if (checkedOutBarcodes.includes(bookBarcode)) {
			// Promote Book in List
			const oldBooksCheckedOut = this.state.booksCheckedOut.slice()
			const thisBookIndex = oldBooksCheckedOut.findIndex(b => b.barcode === bookBarcode)
			const thisBook = oldBooksCheckedOut.splice(thisBookIndex, 1)
			const booksCheckedOut = [thisBook].concat(oldBooksCheckedOut)
			return this.setState({ booksCheckedOut })
		}

		// Otherwise, try checking the book out
		const userId = this.state.userId
		const newBook = await checkout({ bookBarcode, userId })
		if ("failureMessage" in newBook) {
			// Error checking out book
			this.setState({
				logoutTimeLeft: LOGOUT_TIME_LIMIT,
				showCheckoutAlert: true,
				checkoutAlertMessage: newBook.failureMessage
			})
			window.clearTimeout(this.checkoutFailureMessageTimeout)
			this.checkoutFailureMessageTimeout = window.setTimeout(() => {
				this.setState({ showCheckoutAlert: false })
			}, CHECKOUT_ALERT_TIMEOUT_SECONDS * 1000)
		}
		else {
			// Successfully checked out book
			this.setState({
				logoutTimeLeft: LOGOUT_TIME_LIMIT,
				showCheckoutAlert: false,
				booksCheckedOut: [newBook].concat(this.state.booksCheckedOut)
			})
		}
	}


	componentDidMount() {
		this.timerId = window.setInterval(() => {
			if (this.state.logoutTimeLeft - 1 === 0) {
				this.doLogout()
			}
			const newLogoutTimeLeft = this.state.logoutTimeLeft > 1 ? this.state.logoutTimeLeft - 1 : 0
			this.setState({ logoutTimeLeft: newLogoutTimeLeft })
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
				books={this.state.booksCheckedOut}
				checkoutBook={this.doCheckoutBook.bind(this)}
				showAlert={this.state.showCheckoutAlert}
				alertMessage={this.state.checkoutAlertMessage}
			/>
		}
		else {
			return <LoginLayout
				backgroundImageUrl={"blanchard.jpg"}
				library="Buswell Library"
				organization="Wheaton College"
				login={this.doLogin.bind(this)}
				showAlert={this.state.showLoginAlert}
				alertMessage={this.state.loginAlertMessage}
			/>
		}
	}
}

export default App;
