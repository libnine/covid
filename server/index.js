const express = require('express')
const app = express()

app.use(express.static('./build'))

app.get('/', (req, res) => {
  res.sendFile('./build/index.html')
})

app.listen(4000, '0.0.0.0', () => {
  console.log("Listening on 4000")
})