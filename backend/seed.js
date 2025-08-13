const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/productModel');
const products = require('./data/products');
 // Tu archivo con los productos

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔗 Conectado a MongoDB');

    await Product.deleteMany(); // Limpia la colección actual
    await Product.insertMany(products); // Inserta los nuevos

    console.log('✅ Productos insertados correctamente');
    mongoose.disconnect();
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
