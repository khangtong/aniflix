const Film = require('./../models/filmModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    status: 'success',
    results: user.favorites.length,
    data: user.favorites,
  });
});

exports.getAllFilms = factory.getAll(Film);
exports.getFilm = factory.getOne(Film);
