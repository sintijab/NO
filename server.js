const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, 'build')))
app.set('port', (process.env.PORT || 8080))
app.get('*', ((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}))
app.listen(app.get('port'), () => console.log(`Listening on ${app.get('port')}`))
