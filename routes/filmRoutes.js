const express = require('express');
const filmController = require('./../controllers/filmController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/favorites', authController.protect, filmController.getFavorites);
router.patch(
  '/:id/add-favorites',
  authController.protect,
  userController.setFilmAndUserIds,
  userController.addToFavorites
);
router.patch(
  '/:id/remove-favorites',
  authController.protect,
  userController.setFilmAndUserIds,
  userController.removeFromFavorites
);

router.get('/', filmController.getAllFilms);
router.get('/:id', filmController.getFilm);

module.exports = router;
