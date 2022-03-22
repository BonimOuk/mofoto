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
      author: '621825a9116423323efc26c0',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, aperiam quibusdam! Velit voluptatem voluptatum doloribus illum quia possimus, earum dolores cupiditate ratione vitae tenetur molestiae, facere, fugiat iusto qui tempore!',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/bonim/image/upload/v1647921130/Mofoto/fob2izgtuxdcwepjn8tf.jpg',
          filename: 'Mofoto/fob2izgtuxdcwepjn8tf',
        },
        {
          url: 'https://res.cloudinary.com/bonim/image/upload/v1647921130/Mofoto/ogvysl7f9pef0yqzzsbk.jpg',
          filename: 'Mofoto/ogvysl7f9pef0yqzzsbk',
        },
      ],
    });
    await mof.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
