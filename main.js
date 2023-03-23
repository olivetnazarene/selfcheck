// 
// Dependencies
// 
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const fs = require('fs');

// 
// Setup server values
// 
const app = express()
const jsonParser = bodyParser.json()
const port = process.env.NODE_PORT || 3000;
// 
// Setup API settings
// 
const config = require('./config')
let all_ip_set
// ensure that the venn diagram of ips does not have intersections
{
	const all_ip_array = [].concat(...config.locations.map(l => l.permitIpAddresses))
	all_ip_set = new Set(all_ip_array)
	if (all_ip_array.length !== all_ip_set.size) {
		throw ("Multiple locations are configured with the same ip address but that's not allowed")
	}
}
// ensure that circ desks have different names
{
	const circDeskAndLibraryNames_array = config.locations.map(l => l.apiLibraryName + "_" + l.apiCircDesk)
	const circDeskAndLibraryNames_set = new Set(circDeskAndLibraryNames_array)
	if (circDeskAndLibraryNames_array.length !== circDeskAndLibraryNames_set.size) {
		throw ("Multiple locations are configured with the same name but that's not allowed")
	}
}

app.set('trust proxy', true)
const libraryConfigFromIp = ip => {
	if (!all_ip_set.has(ip)) {
		return {
			failureMessage: `Could not find your ip (${ip}) in permitIpAddresses for any location`
		}
	}
	else {
		return config.locations.find(location => location.permitIpAddresses.includes(ip))
	}
}
// 
// Routes
// 
app.use(express.static('client/build'))
app.get('/users/:userId', (req, res) => {
	console.log("user id scan");
	log_session();
	getUser(req.params, res);

})
app.get('/users/:userId/loans?', jsonParser, (req, res) => {
	console.log(req.query.item_barcode)
	console.log(req.body)
	const ipAddress = req.ip.split(":").pop()
	requestLoan(req.params, req.query, ipAddress, req.body, res)
})
app.get('/whoami', (req, res) => {
	const ipAddress = req.ip.split(":").pop()
	const conf = libraryConfigFromIp(ipAddress)
	if ("failureMessage" in conf) {
		return res.json({
			error: "Sorry, we could not find a circulation desk for your ip address.",
			message: conf.failureMessage
		})
	}
	// Pass the config details we intend to pass back (not just everything in that object)
	const {
		libraryLogoUrl: libraryLogo,
		featureImageUrl: featureImage,
		libraryNameString: libraryName,
		organizationNameString: organizationName } = conf
	if (!libraryName || !organizationName) {
		return res.json({
			error: "Sorry, your circulation desk is missing configuration details"
		})
	}
	return res.json({
		libraryLogo,
		featureImage,
		libraryName,
		organizationName
	})
})
app.listen(port, () => console.log(`Selfcheck has started listening at ${port}`))

async function getUser(params, res) {
	console.log(`Retrieving user with id ${params.userId}.`)

	let user = await get_api_user(params.userId)
	if (!user) {
		return res.json({ error: 'something went wrong with the lookup' })
	}
	res.json(user)
}

async function requestLoan(params, query, ip, body, res) {
	console.log(`Loan processing started ${JSON.stringify(params)} and ${JSON.stringify(query)} and ${JSON.stringify(body)}`)

	let loan = await api_request_loan(params.userId, ip, query.item_barcode)
	console.log(loan)

	if (loan.error) {
		console.log("API returned with error")
		return res.json({ error: loan.error[0].errorMessage })
	} else if (loan) {
		console.log("successfully loaned book to user")
		console.log(loan)
		return res.json(loan)
	} else {
		console.log("No error from API but something else went wrong")
		return res.json({ error: 'something went wrong with the lookup' })
	}
}
// 
// API calls
// 
function get_api_user(id) {
	const options = {
		baseURL: config.hostname,
		port: 443,
		url: '/almaws/v1/users/' + id + '?expand=loans,requests,fees&format=json',
		method: 'get',
		headers: {
			Authorization: `apikey ${config.apiKey}`
		}
	}

	// console.log(JSON.stringify(options))
	const getData = async options => {
		try {
			const response = await axios.request(options)
			const data = response.data

			return data
		} catch (error) {
			console.log(error)
		}
	}

	return getData(options)
}

function api_request_loan(userid, ip, barcode) {
	const { apiCircDesk, apiLibraryName, failureMessage } = libraryConfigFromIp(ip)
	if (failureMessage) {
		// api_request_loan should return a promise so this is a promise that resolves to an error
		return new Promise((resolve, reject) => {
			resolve({
				error: [{
					message: "Sorry, we could not find a circulation desk for your ip address."
				}],
			})
		})
	}

	const library_xml = `<?xml version='1.0' encoding='UTF-8'?><item_loan><circ_desk>${apiCircDesk}</circ_desk><library>${apiLibraryName}</library></item_loan>`
	const options = {
		baseURL: config.hostname,
		port: 443,
		url: `/almaws/v1/users/${userid}/loans?user_id_type=all_unique&item_barcode=${barcode}`,
		data: library_xml,
		method: 'post',
		headers: {
			'Content-Type': `application/xml`,
			'Authorization': `apikey ${config.apiKey}`
		}
	}

	const getData = async options => {
		try {
			const response = await axios.request(options)
			const data = response.data

			return data
		} catch (error) {
			if (error.response) {
				console.log(error.response.data)
				console.log(`ErrorList ${JSON.stringify(error.response.data.errorList)}`)
				console.log(error.response.status)
				console.log(error.response.headers)
				return error.response.data.errorList
			} else if (error.request) {
				console.log(error.request)
				return error.request
			} else {
				console.log(error.message)
				return error.message
			}
		}
	}

	return getData(options)
}

function log_session(){
	var date = new Date()
	var day = date.toISOString().slice(0,10) 
	var time = date.toLocaleString()
	var line = "User logged in at " + time + "\n"
	var filename = "log/access_"+day+".log"
	var stream = fs.createWriteStream(filename, {flags:'a'});
	stream.write(line);
	stream.end();
}
