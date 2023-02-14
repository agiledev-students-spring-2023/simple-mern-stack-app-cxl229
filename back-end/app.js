require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// route to the about us page, with text and image
app.get('/aboutus', (req, res) => {
  // send json with information
  try {
    res.json({
      text: "I'm Charlotte, I am 20 years old and a senior at NYU. My major is computer science and my minor is digital art and design. " +
            "I've been programming for about six years now. I'm from New Jersey and I really like cats. I have a striped black cat at home, and he is very awesome. " +
            "In my free time, I like to read, write, draw, and do game development. I hope to apply my creative talents to programming in order to " +
            "create interesting, unique, fun, and useful software. I'm a grader for the data structures class here at NYU, and the president of the 3D printing club. " +
            "Social causes I care about include sustainability and girls in STEM. I'm skilled not only in coding, but also in graphic design, art, and writing. " +
            "My favorite color is pink, my favorite food is hot pot, my favorite movie is 'The Secret World of Arrietty', and my favorite song is 'Sad Machine'. " +
            "I can play the flute and piccolo. I like Broadway musicals and fantasy video games. I spend most of my time studying and doing homework. " +
            "I'll be graduating at the end of this semester!",
      image: '/about.jpg',
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to load about us page',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
