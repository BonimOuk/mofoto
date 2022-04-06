const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/bonim/image/upload/v1648181550/Mofoto/k77ol7ehhm1dga98mnei.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const MofotoSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

MofotoSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/mofotos/${this.id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>
  `;
});

MofotoSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Mofoto', MofotoSchema);
