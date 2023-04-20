const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const Film = require('../models/filmModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) callback(null, true);
  else callback(new AppError('Please upload only image files.', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Log error if user POST password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('This route is not allowed to POST password data.', 400)
    );

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.setFilmAndUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.film) req.body.film = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.addToFavorites = catchAsync(async (req, res, next) => {
  const film = await Film.findById(req.body.film);
  const user = await User.findById(req.user.id);

  if (!user || !film)
    return next(new AppError('No document found with that ID', 404));

  film.favoriteByUsers.push(req.user.id);
  await film.save();

  user.favorites.push(req.body.film);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.removeFromFavorites = catchAsync(async (req, res, next) => {
  const film = await Film.findById(req.body.film);
  const user = await User.findById(req.user.id);

  if (!user || !film)
    return next(new AppError('No document found with that ID', 404));

  // Delete user ref from film.favoriteByUsers
  film.favoriteByUsers = film.favoriteByUsers.filter((el) => el != req.user.id);
  await film.save();

  // Delete film ref from user.favorites
  user.favorites = user.favorites.filter((el) => el != req.body.film);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
