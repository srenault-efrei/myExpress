
const express = require('./my-express')
const app = express()
const url = require('url');
const args = process.argv.slice(2)

if (args.length !== 1) {
  console.log("usage: node server.js <PORT_Name>");
  process.exit(0)
}
else {
  const port = parseInt(args[0])

  // ---------------------------------------------------- GET-----------------------------------------------------

  app.get('/', function (req, res) {
    const request_url = req.url;
    const { query } = url.parse(request_url, true)
    const { name } = query
    res.write(` <h1 style = 'color : green' >Hello ${name || 'World'} </h1>`);
  })


  // ----------------------------------------------------  POST-----------------------------------------------------


  app.post('/students', function (req, res) {
    res.write("POST request")

  })



  // ----------------------------------------------------  PUT-----------------------------------------------------


  app.put('/students/1', function (req, res) {
    res.write('PUT request')
  })


  // ----------------------------------------------------  DELETE-----------------------------------------------------


  app.delete('/students/1', function (req, res) {
    res.write('DELETE request to homepage')
  })


  // ---------------------------------------------------- ALL -----------------------------------------------------


  // app.all('/home', function (req, res, next) {
  //   console.log('Accessing the secret section ...')

  // })

  // ----------------------------------------------------  RENDER-----------------------------------------------------

  app.render('home', { name: 'Loic' }, (err, html) => {
    if (err != '') {
      console.log(err)
    }
  })


  // ----------------------------------------------------LISTEN-----------------------------------------------------


  app.listen(port, () => {
    console.log("app listening on port " + port)
  })
}
