const express = require('express');
const router = express.Router();
const epsiController = require('./../controllers/epsi.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/groupcd', verifyToken, epsiController.getGroupCode);
router.post('/materialcd', verifyToken, epsiController.getMaterialCode);
router.post('/typecd', verifyToken, epsiController.getTypeCode);
router.post('/epsi', verifyToken, epsiController.getEpsiData);

module.exports = router;
