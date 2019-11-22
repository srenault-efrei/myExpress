const express = require('./my-express')
const app =  express()




app.get('/home', function (req, res) {
  res.write('hello')
  })

 app.listen(4242)