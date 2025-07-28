const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deck.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/:deckId/export",authMiddleware, deckController.exportDeck);

router.use(authMiddleware);

router.post('/', deckController.createDeck);
router.get('/', deckController.getUserDecks);
router.put('/:id', deckController.updateDeck);
router.delete('/:id', deckController.deleteDeck);

module.exports = router;