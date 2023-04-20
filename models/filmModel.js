const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  status: {
    type: Boolean,
  },
  msg: {
    type: String,
    trim: true,
  },
  movie: {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    origin_name: {
      type: String,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    thumb_url: {
      type: String,
      trim: true,
    },
    poster_url: {
      type: String,
      trim: true,
    },
    trailer_url: {
      type: String,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
    episode_current: {
      type: String,
      trim: true,
    },
    episode_total: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    year: {
      type: Number,
    },
    category: [
      {
        name: {
          type: String,
          trim: true,
        },
      },
    ],
    country: [
      {
        name: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  episodes: [
    {
      server_name: {
        type: String,
        trim: true,
      },
      server_data: [
        {
          name: {
            type: String,
            trim: true,
          },
          slug: {
            type: String,
            trim: true,
          },
          filename: {
            type: String,
            trim: true,
          },
          link_embed: {
            type: String,
            trim: true,
          },
          link_m3u8: {
            type: String,
            trim: true,
          },
        },
      ],
    },
  ],
  favoriteByUsers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
