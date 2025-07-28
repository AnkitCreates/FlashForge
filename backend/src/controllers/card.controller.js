const { AppDataSource } = require("../data-source");
const Card = require("../models/Card");
const Deck = require("../models/Deck");

exports.addCard = async (req, res) => {
  const { front, back, deckId } = req.body;
  try {
    const cardRepo = AppDataSource.getRepository("Card");
    const deckRepo = AppDataSource.getRepository(Deck);

    const deck = await deckRepo.findOneBy({ id: parseInt(deckId) });
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const newCard = cardRepo.create({ front, back, deck });
    await cardRepo.save(newCard);

    return res.status(201).json(newCard);
  } catch (err) {
    console.error("Add card error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add card", detail: err.message });
  }
};

exports.getCardsByDeck = async (req, res) => {
  const { deckId } = req.params;
  try {
    const cardRepo = AppDataSource.getRepository("Card");
    const cards = await cardRepo.find({
      where: { deck: { id: parseInt(deckId) } },
    });
    return res.json(cards);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get cards" });
  }
};

exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { front, back } = req.body;

  try {
    const cardRepo = AppDataSource.getRepository("Card");

    const existingCard = await cardRepo.findOneBy({ id });

    if (!existingCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    existingCard.front = front;
    existingCard.back = back;

    await cardRepo.save(existingCard);

    return res.json(existingCard);
  } catch (err) {
    console.error("Update card error:", err);
    return res
      .status(500)
      .json({ error: "Failed to update card", detail: err.message });
  }
};

// not necessary
exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const cardRepo = AppDataSource.getRepository("Card");

    const existingCard = await cardRepo.findOneBy({ id });
    if (!existingCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    await cardRepo.remove(existingCard);

    return res.json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("Delete card error:", err);
    return res
      .status(500)
      .json({ error: "Failed to delete card", detail: err.message });
  }
};