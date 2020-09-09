// 
// Dependencies
// 
const express = require('express')
const axios = require('axios')
const fs = require('fs')
const bodyParser = require('body-parser')

// 
// Setup server values
// 
const app = express()
const jsonParser = bodyParser.json()
const port = process.env.NODE_PORT || 3000;
// 
// Setup API settings
// 
const config = require('./config');
// 
// Routes
// 
app.get('/', (req, res) => index(req, res))
app.use(express.static('client'))
app.get('/users/:userId', (req, res ) => {
  console.log("user id scan");
  getUser(req.params, res);
})
app.post('/users/:userId/loans?', jsonParser, (req, res)=> {
  console.log(req.query.item_barcode)
  console.log(req.body)
  requestLoan(req.params, req.query, req.body, res)
})
app.get('/is-touch', (req, res) => {
	res.json({ "touch": config.touch })
})
app.listen(port, () => console.log(`Selfcheck has started listening at ${port}`))

async function getUser(params, res){
  console.log(`Retrieving user with id ${params.userId}.`)

  let u = await get_api_user(params.userId)

  if(u){
	  res.json(u)
  }else{
    res.send('something went wrong with the lookup')
  }
}

async function requestLoan(params, query, body, res){
  console.log(`Loan processing started ${JSON.stringify(params)} and ${JSON.stringify(query)} and ${JSON.stringify(body)}`)
  
  let loan = await api_request_loan(params.userId, query.item_barcode)
  
  if (loan.error){
    res.send(`${loan.error[0].errorMessage}`)
  }
  else if(loan){
    res.json(loan)
  }else{
	  res.send('something went wrong with the lookup')
  }

}
// 
// API calls
// 
function get_api_user(id){
  const options = {
    baseURL: config.hostname,
    port: 443,
    url: '/almaws/v1/users/'+id+'?expand=loans,requests,fees&format=json',
    method: 'get',
    headers: {Authorization: `apikey ${config.apiKey}` }
  }

  // console.log(JSON.stringify(options))
  const getData = async options => {
    try {
      const response = await axios.request(options)
      const data = response.data

      return data
    }catch (error){
      console.log(error)
    }
  }

  return getData(options)
}

function api_request_loan(userid, barcode){
  let library_xml = `<?xml version='1.0' encoding='UTF-8'?><item_loan><circ_desk>${config.circDesk}</circ_desk><library>${config.libraryName}</library></item_loan>`
  const options = {
    baseURL: config.hostname,
    port: 443,
    url: `/almaws/v1/users/${userid}/loans?user_id_type=all_unique&item_barcode=${barcode}`,
    data: library_xml,
    method: 'post',
    headers: {
      'Content-Type': `application/xml`,
      Authorization: `apikey ${config.apiKey}`}
  }

  const getData = async options => {
    try {
      const response = await axios.request(options)
      const data = response.data

      return data
    }catch(error){
      if(error.response){
        console.log(error.response.data)
        console.log(`ErrorList ${JSON.stringify(error.response.data.errorList)}`)
        console.log(error.response.status)
        console.log(error.response.headers)
        return error.response.data.errorList
      }else if (error.request){
        console.log(error.request)
        return error.request
      }else{
        console.log(error.message)
        return error.message
      }
    }
  }

  return getData(options)
  
}
