import { baseUrl } from './apiConstants'

async function whoami() {
	try {
		const responseObject = await fetch(`${baseUrl}/whoami`)
		const me = await responseObject.json()
		if ("error" in me) {
			console.log(me)
			return {
				failureMessage: "Failed to set up circulation desk. The server is probably not correctly configured."
			}
		}
		return me
	}
	catch (error) {
		console.log("An error occurred while connecting to our server:\n--\n", error)
		return {
			failureMessage: "An error occurred while connecting to our server."
		}
	}
}
export default whoami