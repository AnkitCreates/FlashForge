const redisClient = require("../utils/redisClient"); // Import client
const { AppDataSource } = require("../data-source");
const Deck = require("../models/Deck");
const User = require("../models/User");
const Card = require("../models/Card");

exports.createDeck = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  try {
    const deckRepo = AppDataSource.getRepository("Deck");
    const userRepo = AppDataSource.getRepository("User");

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newDeck = deckRepo.create({ title, user });
    await deckRepo.save(newDeck);
    await redisClient.del(`user:${userId}:decks`);

    return res.status(201).json(newDeck);
  } catch (err) {
    console.error("Create deck error:", err); // ← Add this
    return res
      .status(500)
      .json({ error: "Failed to create deck", details: err.message });
  }
};

exports.getUserDecks = async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `user:${userId}:decks`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Serving decks from cache");
      return res.json(JSON.parse(cached));
    }
    const deckRepo = AppDataSource.getRepository("Deck");
    const decks = await deckRepo.find({
      where: { user: { id: userId } },
    });
    await redisClient.set(cacheKey, JSON.stringify(decks), "EX", 600); // ✅ Correct for ioredis

    console.log("💽 Fetched decks from DB & cached");
    return res.json(decks);
  } catch (err) {
    console.error("getUserDecks error:", err);
    return res.status(500).json({ error: "Failed to fetch decks" });
  }
};

exports.updateDeck = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const deckRepo = AppDataSource.getRepository("Deck");
    await deckRepo.update({ id: parseInt(id) }, { title });
    const updated = await deckRepo.findOneBy({ id: parseInt(id) });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update deck" });
  }
};

exports.deleteDeck = async (req, res) => {
  const { id } = req.params;

  try {
    const deckRepo = AppDataSource.getRepository("Deck");
    await deckRepo.delete({ id: parseInt(id) });
    await redisClient.del(`user:${req.user.id}:decks`);
    return res.json({ message: "Deck deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete deck" });
  }
};

exports.exportDeck = async (req, res) => {
  const { deckId } = req.params;
  const userId = req.user.id;

  try {
    const deckRepo = AppDataSource.getRepository("Deck");
    const cardRepo = AppDataSource.getRepository("Card");

    const deck = await deckRepo.findOne({
      where: {
        id: parseInt(deckId),
        user: { id: userId },
      },
    });

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    const cards = await cardRepo.find({
      where: { deck: { id: deck.id } },
    });

    const exportData = {
      id: deck.id,
      title: deck.title,
      score: deck.score,
      lastReviewed: deck.lastReviewed,
      cards: cards.map((card) => ({
        front: card.front,
        back: card.back,
      })),
    };

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${deck.title}.json`
    );
    return res.json(exportData);
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: "Failed to export deck" });
  }
};
