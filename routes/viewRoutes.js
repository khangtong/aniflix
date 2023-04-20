const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get(
  '/favorites',
  authController.isLoggedIn,
  viewController.getFavorites
);
router.get('/film/:slug', authController.isLoggedIn, viewController.getFilm);
router.get(
  '/search',
  authController.isLoggedIn,
  viewController.getSearchedFilms
);
router.get('/me', authController.protect, viewController.getMe);

module.exports = router;
