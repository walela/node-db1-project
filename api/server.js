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
  return db('accounts')
    .where({ id: id })
    .select('id', 'name', 'budget')
}

function create(account) {
  return db('accounts').insert(account)
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

server.get('/api/accounts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const data = await getById(id)
    if (data.length === 0) {
      res.status(200).json({ message: `No account with id ${id}` })
    } else {
      console.log(data) // data is an array of objects
      res.status(200).json(data[0])
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error getting post by id' })
  }
})

server.post('/api/accounts', async (req, res) => {
  const newAccount = req.body

  try {
    if (!newAccount.name || !newAccount.budget) {
      console.error('Malformed request')
      res
        .status(400)
        .json({ message: 'New accounts must include a name and budget' })
    }
    const data = await create(newAccount)
    console.log(data)
    res
      .status(200)
      .json({ message: `A new account with id of ${data[0]} was created` })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error creating new account' })
  }
})

server.all('*', (req, res) => {
  res.status(404).send('<h1>Whoops! Resource was not found on the server.</h1>')
})

module.exports = server
