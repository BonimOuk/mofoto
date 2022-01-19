const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Mofoto = require('../models/mofoto');

mongoose.connect('mongodb://localhost:27017/mofoto', {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Mofoto.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const mof = new Mofoto({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, aperiam quibusdam! Velit voluptatem voluptatum doloribus illum quia possimus, earum dolores cupiditate ratione vitae tenetur molestiae, facere, fugiat iusto qui tempore!',
      price,
    });
    await mof.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
