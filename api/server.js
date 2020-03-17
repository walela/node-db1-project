const express = require('express')
const morgan = require('morgan')

const db = require('../data/dbConfig')
const server = express()

server.use(express.json())
server.use(morgan('dev'))

function getAll() {
  return db.select('id', 'name', 'budget').from('accounts')
}

function getById(id) {
  return db('posts')
    .where({ id: id })
    .select('id', 'name', 'budget')
}

server.get('/', (_, res) => {
  res.send('<h1>Accounts API with knex</h1>')
})

server.get('/api/accounts/', async (req, res) => {
  try {
    const data = await getAll()
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error getting accounts' })
  }
})

server.all('*', (req, res) => {
  res.status(404).send('<h1>Whoops! Resource was not found on the server.</h1>')
})

module.exports = server
