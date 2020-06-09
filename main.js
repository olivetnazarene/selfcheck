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
const port = 3000
// 
// Setup API settings
// 
const hostname = 'https://api-na.hosted.exlibrisgroup.com'
const apiKey = 'xxxxxxxxxxxxxxxxxxxx'
const libraryName = "XXXXX";
const circDesk = "XXXXXXXXXXXXXXXX";
// 
// Routes
// 
app.get('/', (req, res) => index(req, res))
app.get('/css/self-check.css', (req, res)=> css(res))
app.get('/js/self-check.js', (req, res)=> js(res))
app.get('/users/:userId', (req, res ) => {
  console.log("user id scan");
  getUser(req.params, res);
})
app.post('/users/:userId/loans?', jsonParser, (req, res)=> {
  console.log(req.query.item_barcode)
  console.log(req.body)
  requestLoan(req.params, req.query, req.body, res)
})

app.listen(port, () => console.log(`Selfcheck has started listening at ${port}`))
// 
// Route handler functions
// 
function index(req, res){
  console.log(`Loading index page with request ${req}`)
  let html = fs.readFileSync('self-check.html');
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(html)
  res.end()
  return res
}

function css(res){
  let css = fs.readFileSync('css/self-check.css');
  if(css){
    res.writeHeader(200, {"Content-Type": "text/css"});
    res.write(css)
    res.end()
    return res
  }else{
    res.writeHeader(400, {"Msg": "something went wrong"})
    res.end()
  }
}

function js(res){
  let js = fs.readFileSync('js/self-check.js');
  if(js){
    res.writeHeader(200, {"Content-Type": "text/javascript"});
    res.write(js)
    res.end()
    return res
  }else{
    res.writeHeader(400, {"Msg": "something went wrong"})
    res.end()
  }
}

async function getUser(params, res){

  console.log(`Retrieving user with id ${params.userId}.`)

  let u = await get_api_user(params.userId)

  if(u){
    res.writeHeader(200, {"Content-Type": "text/json"})
    res.write(`${JSON.stringify(u)}`)
    res.end()
  }else{
    res.writeHeader(400, {"Content-Type": "text/plain"})
    res.write('something went wrong with the lookup')
    res.end()
  }
}

async function requestLoan(params, query, body, res){
  console.log(`Loan processing started ${JSON.stringify(params)} and ${JSON.stringify(query)} and ${JSON.stringify(body)}`)
  
  let loan = await api_request_loan(params.userId, query.item_barcode)
  
  if (loan.error){
    res.writeHeader(400, {"Content-Type": "text/plain"})
    res.write(`${loan.error[0].errorMessage}`)
    res.end()
  }
  else if(loan){
    res.writeHeader(200, {"Content-Type": "text/xml"})
    res.write(loan)
    res.end()
  }else{
    res.writeHeader(400, {"Content-Type": "text/plain"})
    res.write('something went wrong with the lookup')
    res.end()
  }

}
// 
// API calls
// 
function get_api_user(id){
  const options = {
    baseURL: hostname,
    port: 443,
    url: '/almaws/v1/users/'+id+'?expand=loans,requests,fees&format=json',
    method: 'get',
    headers: {Authorization: `apikey ${apiKey}` }
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
  let library_xml = `<?xml version='1.0' encoding='UTF-8'?><item_loan><circ_desk>${circDesk}</circ_desk><library>${libraryName}</library></item_loan>`
  const options = {
    baseURL: hostname,
    port: 443,
    url: `/almaws/v1/users/${userid}/loans?user_id_type=all_unique&item_barcode=${barcode}`,
    data: library_xml,
    method: 'post',
    headers: {
      'Content-Type': `application/xml`,
      Authorization: `apikey ${apiKey}`}
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
      }else{
        console.log(error.message)
      }
    }
  }

  return getData(options)
  
}