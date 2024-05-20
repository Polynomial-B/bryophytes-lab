// ! This is a program, totally separate to express, that is going to put some data into our database
// ! for testing purposes.

// ? SEEDING IS FOR DEVS
// & POSTMAN IS ~ CLIENT SIDE

const mongoose = require('mongoose')
require('dotenv').config();

const Moss = require('./models/moss.js')


const bryophytesData = require('./seedData.js') 


async function seed() {
  
  console.log('Seeding has begun.')
  
  await mongoose.connect(process.env.MONGODB_URI)
  
  console.log('Connection successful.')

  // ? CLEAR DATABASE 
  await mongoose.connection.db.dropDatabase()

  // ? ADD TO DATABASE
  const test = await Moss.create(bryophytesData)

  console.log(test)

  mongoose.disconnect()
}

seed()