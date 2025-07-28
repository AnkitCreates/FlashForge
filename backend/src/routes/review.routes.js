const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/start', reviewController.startReview);
router.post('/submit', reviewController.submitReview);

module.exports = router;