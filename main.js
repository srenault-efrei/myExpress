
const express = require('./my-express')
const app = express()
const url = require('url');
const args = process.argv.slice(2)

if (args.length !== 1) {
  console.log("usage: node server.js <PORT_Name>");
}
else {
  const port = parseInt(args[0])

  app.get('/', function (req, res) {
    const request_url = req.url;
    const { query } = url.parse(request_url, true)
    const { name } = query
    res.write(` <h1 style = 'color : green' >Hello ${name || 'World'} </h1>`);
  })
  
  app.post('/students', function (req, res) {
    res.write("POST request")

  })

  app.put('/students/2', function (req, res) {
    res.write('PUT request')
  })


    // // app.get('/home', function (req, res) {
  // //   res.write('Hello Worlddssds!')
  // // })

  // app.put('/students/sff', function (req, res) {
  //   res.write('PUT request')
  // }) 

  // app.delete('/', function (req, res) {
  //   res.write('DELETE request to homepage')
  // })

  app.delete('/', function (req, res) {
    res.write('DELETE request to homepage')
  })

  // app.all('/secret', function (req, res, next) {
  //   console.log('Accessing the secret section ...')
  //   next() // pass control to the next handler
  // })

  app.listen(port, () => {
    console.log("app listening on port "+port)
  })
}
