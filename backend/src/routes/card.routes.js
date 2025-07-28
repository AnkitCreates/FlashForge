const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', cardController.addCard);
router.get('/deck/:deckId', cardController.getCardsByDeck);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

module.exports = router;