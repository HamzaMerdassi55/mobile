const express = require('express');
const router = express.Router();
const evenmentController = require('../Controller/evenmentController');

router.get('/evenments', evenmentController.getAllEvenments);
router.post('/evenments', evenmentController.createEvenment);

module.exports = router;
