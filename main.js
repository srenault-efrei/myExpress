const express = require('./my-express')
const app = express()

// app.get('/', function (req, res,name) {
//   res.write(` <h1 style = 'color : green' >Hello ${name || 'World'} </h1>`);
// })

app.get('/', function (req, res, name) {
  res.write("<h1 style = 'color : green' >Hello World </h1>");
})

app.post('/students', function (req, res) {
  res.write("<h1> Utilisateur ajouté </h1>")
})

// app.put('/', function (req, res) {
//   res.send('PUT request to homepage')
// })

// app.delete('/', function (req, res) {
//   res.send('DELETE request to homepage')
// })

// app.all('/secret', function (req, res, next) {
//   console.log('Accessing the secret section ...')
//   next() // pass control to the next handler
// })

app.listen(4242)