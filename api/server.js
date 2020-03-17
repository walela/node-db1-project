const express = require('express')
const morgan = require('morgan')

const accountsRouter = require('./accounts/accountsRouter')

const server = express()
server.use(morgan('dev'))
server.use(express.json())

server.use('api/accounts', accountsRouter)

server.get('/', (_, res) => {
  res.send('<h1>Accounts API with knex</h1>')
})

server.all('*', (req, res) => {
  res.status(404).send('<h1>Whoops! Resource was not found on the server.</h1>')
})

module.exports = server
