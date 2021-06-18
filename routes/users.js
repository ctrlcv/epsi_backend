const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/users.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/signin', usersController.signIn);
router.post('/signup', usersController.signUp);
router.post('/token', usersController.getToken);
router.post('/accesstoken', usersController.getAccessToken);
router.post('/userinfo', usersController.getUserInfo);
router.post('/updateuser', verifyToken, usersController.updateUser);

module.exports = router;
