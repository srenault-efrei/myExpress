
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

  app.get('/', function (req, res) {
    const request_url = req.url;
    const { query } = url.parse(request_url, true)
    const { name } = query
    res.write(` <h1 style = 'color : green' >Hello ${name || 'World'} </h1>`);
  })

    app.get('/home', function (req, res) {
      res.write('Hello Worlddssds!')
    })

  
  app.post('/students', function (req, res) {
    res.write("POST request")

  })

  app.post('/', function (req, res) {
    res.write("POST request")

  })

  app.put('/students/4', function (req, res) {
    res.write('PUT request')
  })


  app.put('/students/15', function (req, res) {
    res.write('PUT request')
  }) 

  app.delete('/', function (req, res) {
    res.write('DELETE request to homepage')
  })

  app.delete('/1', function (req, res) {
    res.write('DELETE request to homepage')
  })


  app.delete('/students/1', function (req, res) {
    res.write('DELETE request to homepage')
  })

  app.all('/secret', function (req, res, next) {
    console.log('Accessing the secret section ...')
    next() // pass control to the next handler
  })

  app.render('home',{ maison: 'Loic',apppart:"Olivier" }, (err, html) => {
  //  console.log(html)
  })
  
  app.render('index', { name: 'Loic',prenom:"Olivier" }, (err, html) => {
    //  console.log(html)
    })

  app.listen(port, () => {
    console.log("app listening on port "+port)
  })
}
