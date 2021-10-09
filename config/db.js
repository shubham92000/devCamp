const mongoose = require('mongoose');
// const colors = require('colors');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser : true
  });
  console.log(`mongo db connected: ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;