import { Component } from 'react'

import './tailwind.output.css'
// import './App.css';

import LoginLayout from "./components/LoginLayout"
import CheckoutLayout from './components/CheckoutLayout';

import whoami from "./api/whoami"
import login from "./api/login"
import checkout from "./api/checkout"

const LOGIN_ALERT_TIMEOUT_SECONDS = 10
const CHECKOUT_ALERT_TIMEOUT_SECONDS = 2
const LOGOUT_TIME_LIMIT = 60

const LOGGED_OUT_STATE = {
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
		this.state = Object.assign({
			loading: true,
			libraryName: "",
			organizationName: "",
			featureImage: "",
		}, LOGGED_OUT_STATE)
	}
	async doLogin(userBarcode) {
		this.setState({showLoginAlert: true, loginAlertMessage: "Finding user."})
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
			this.userBarcode = userBarcode
		}
	}
	doLogout() {
		this.setState({showLoginAlert: true, loginAlertMessage: "Ending session."})
		this.setState(Object.assign({}, LOGGED_OUT_STATE))
	}
	async doCheckoutBook(bookBarcode) {
		// Allow Logout by scanning barcode
		if (bookBarcode === this.userBarcode) {
			return this.doLogout()
		}
		this.setState({showCheckoutAlert: true, checkoutAlertMessage: "Checking out item." })

		const checkedOutBarcodes = this.state.booksCheckedOut.map(b => b.barcode)
		if (checkedOutBarcodes.includes(bookBarcode)) {
			// Promote Book in List
			const oldBooksCheckedOut = this.state.booksCheckedOut.slice()
			const thisBookIndex = oldBooksCheckedOut.findIndex(b => b.barcode === bookBarcode)
			// Remember that .splice return an array so we can concat directly
			const booksCheckedOut = oldBooksCheckedOut
				.splice(thisBookIndex, 1)
				.concat(oldBooksCheckedOut)
			// Pretend to have successfully checked out a book
			return this.setState({
				logoutTimeLeft: LOGOUT_TIME_LIMIT,
				showCheckoutAlert: false,
				booksCheckedOut,
			})
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
		const selfDetails = whoami()
		selfDetails.then(json => {
			if ("failureMessage" in json) {
				console.error(json)
				return
			}
			else {
				const { libraryLogo, libraryName, organizationName, featureImage } = json
				const featureImageNotDefault = featureImage === "url/to/image.jpg" ? null : featureImage
				const libraryLogoNotDefault = libraryLogo === "url/to/image.jpg" ? null : libraryLogo
				this.setState({
					loading: false,
					libraryLogo: libraryLogoNotDefault,
					libraryName,
					organizationName,
					featureImage: featureImageNotDefault
				})
			}
		})

		this.timerId = window.setInterval(() => {
			if (this.state.logoutTimeLeft - 0.01 <= 0) {
				this.doLogout()
			}
			const newLogoutTimeLeft = this.state.logoutTimeLeft > 0 ? this.state.logoutTimeLeft - 0.01 : 0
			this.setState({ logoutTimeLeft: newLogoutTimeLeft })
		}, 10)
	}
	componentWillUnmount() {
		window.clearInterval(this.timerId)
	}
	render() {
		if (this.state.loading) {
			// return <LoadingLayout />
			return <div>Loading</div>
		}
		else if (this.state.loggedIn) {
			return <CheckoutLayout
				libraryLogo={this.state.libraryLogo}
				library={this.state.libraryName}
				organization={this.state.organizationName}
				userName={this.state.userName}
				userLoans={this.state.userLoans}
				userRequests={this.state.userRequests}
				userFines={this.state.userFines}
				timeout={this.state.logoutTimeLeft}
				timeLimit={LOGOUT_TIME_LIMIT}
				books={this.state.booksCheckedOut}
				checkoutBook={this.doCheckoutBook.bind(this)}
				showAlert={this.state.showCheckoutAlert}
				alertMessage={this.state.checkoutAlertMessage}
			/>
		}
		else {
			return <LoginLayout
				libraryLogo={this.state.libraryLogo}
				backgroundImageUrl={this.state.featureImage}
				library={this.state.libraryName}
				organization={this.state.organizationName}
				login={this.doLogin.bind(this)}
				showAlert={this.state.showLoginAlert}
				alertMessage={this.state.loginAlertMessage}
			/>
		}
	}
}

export default App;
