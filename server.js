const path = require('path')
const express = require('express')
const request = require('request')

const encodeQueryData = (data) => {
  const ret = []
  for (let d in data) ret.push(`${encodeURIComponent(d)  }=${  encodeURIComponent(data[d])}`) //eslint-disable-line
  return ret.join('&')
}

const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/query/:path', (req, res) => {
  request(
    { url: `https://api-v2.soundcloud.com/${req.params.path}?${encodeQueryData(req.query)}` },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error })
      }

      return res.json(JSON.parse(body))
    },
  )
})

app.get('/query/:param1/:param2/:param3', (req, res) => {
  request(
    { url: `https://api-v2.soundcloud.com/${req.params.param1}/${req.params.param2}/${req.params.param3}?${encodeQueryData(req.query)}` },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error })
      }

      return res.json(JSON.parse(body))
    },
  )
})

app.get('/stream/:param1/:param2/:param3', (req, res) => {
  request(
    { url: `https://api-v2.soundcloud.com/media/soundcloud:tracks:${req.params.param2}/${req.params.param3}/stream/${req.params.param1}?${encodeQueryData(req.query)}` },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error })
      }

      return res.json(JSON.parse(body))
    },
  )
})

app.use(express.static(path.join(__dirname, 'build')))

const serverPort = process.env.PORT || 8080
const serverHost = '0.0.0.0'

app.get('*', ((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}))
app.listen(serverPort, serverHost, () => {
  console.log('Listening on port %d', serverPort)
})
