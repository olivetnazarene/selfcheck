export default function login({ userId }) {
	if (!userId) {
		return {
			failureMessage: "Please enter a barcode number to login."
		}
	}
	else {
		//fetch.then(){
		return {
			userName: "James Cuénod",
			userLoans: 68,
			userRequests: 3,
			userFines: 12,
		}
		// }.catch({
		// failureMessage: "This doesn't login yet!"
		// })
	}
}