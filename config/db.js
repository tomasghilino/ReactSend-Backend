const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    ('DB Conectada');
  } catch (error) {
    ('Hubo un error');
    error;
    process.exit(1);
  }
};

module.exports = conectarDB;
