const mongoose = require('mongoose');
const { env } = require('../../config/env');

const connectMongo = async () => {
  await mongoose.connect(env.MONGO_URI);
};

module.exports = connectMongo;
