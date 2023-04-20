const Film = require('../models/filmModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get film data from collection
  let queryArr = [
    req.query.category?.split(' '),
    req.query.country?.split(' '),
  ];
  const features = new APIFeatures(Film.find(), req.query).filter();
  const films = await features.query;
  const featuresP = new APIFeatures(Film.find(), req.query).filter().paginate();
  const filmsP = await featuresP.query;

  if (!films.length)
    return res.status(404).render('error', {
      title: 'No film found.',
      statusCode: 404,
      errImg: '/img/app-img/page-not-found.png',
    });

  // 2. Build template
  // 3. Render that template using data from 1
  res.status(200).render('home', {
    user: res.locals?.user,
    results: films.length,
    curPage: !req.query?.page ? 1 : req.query?.page,
    films: filmsP,
    queryArr,
    navActive: 'home',
  });
});

exports.getFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(res.locals.user?.id).populate('favorites');

  if (!user)
    return next(new AppError('Please log in to use this feature.', 401));

  res.status(200).render('searchAndFavorites', {
    user,
    results: user.favorites.length,
    curPage: !req.query?.page ? 1 : req.query?.page,
    films: user.favorites,
    navActive: 'favorites',
  });
});

exports.getFilm = catchAsync(async (req, res, next) => {
  const film = await Film.findOne({ 'movie.slug': req.params.slug });
  let similarFilms = await Film.find({
    'movie.category': {
      $elemMatch: film.movie.category[0],
    },
  });
  similarFilms = similarFilms.filter(
    (el) => JSON.stringify(el) !== JSON.stringify(film)
  );

  if (!film) return next(new AppError('No film found.', 404));

  res.status(200).render('film', {
    user: res.locals?.user,
    film,
    similarFilms,
    navActive: null,
    isFavoriteByUser: film.favoriteByUsers.includes(res.locals.user?.id),
  });
});

exports.getSearchedFilms = catchAsync(async (req, res, next) => {
  // 1. Get film data from collection
  const features = new APIFeatures(Film.find(), req.query).filter();
  let films = await features.query;

  films = films.filter((el) =>
    req.query.s
      .toLowerCase()
      .split(' ')
      .some(
        (w) =>
          el.movie.name.toLowerCase().includes(w) ||
          el.movie.origin_name.toLowerCase().includes(w) ||
          el.movie.slug.toLowerCase().includes(w)
      )
  );

  if (!films.length)
    return res.status(404).render('error', {
      title: 'No film found.',
      statusCode: 404,
      errImg: '/img/app-img/page-not-found.png',
    });

  // 2. Build template
  // 3. Render that template using data from 1
  res.status(200).render('searchAndFavorites', {
    user: res.locals?.user,
    results: films.length,
    curPage: !req.query?.page ? 1 : req.query?.page,
    films,
    navActive: 'home',
  });
});

exports.getMe = (req, res, next) => {
  res.status(200).render('me', {
    user: req.user,
    navActive: null,
  });
};
