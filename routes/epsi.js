const express = require('express');
const router = express.Router();
const epsiController = require('./../controllers/epsi.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/groupcd', epsiController.getGroupCode);
router.post('/materialcd', epsiController.getMaterialCode);
router.post('/typecd', epsiController.getTypeCode);
router.post('/epsi', epsiController.getEpsiData);
router.post('/epsiOne', epsiController.getEpsiOneData);
router.post('/store', verifyToken, epsiController.saveEpsiData);


module.exports = router;
