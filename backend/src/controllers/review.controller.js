const { AppDataSource } = require("../data-source");
const Review = require("../models/Review");
const Card = require("../models/Card");
const Deck = require("../models/Deck");
const redisClient = require("../utils/redisClient");

exports.startReview = async (req, res) => {
  const { deckId, mode } = req.body;
  const cardRepo = AppDataSource.getRepository(Card);

  try {
    let cards;

    if (mode === "smart") {
      cards = await cardRepo
        .createQueryBuilder("card")
        .leftJoin("card.reviews", "review")
        .where("card.deckId = :deckId", { deckId })
        .groupBy("card.id, card.front, card.back, card.createdAt") // FIXED
        .orderBy("COALESCE(AVG(CAST(review.difficulty AS float)), 0)", "ASC")
        .limit(10)
        .getMany();
    } else {
      cards = await cardRepo.find({
        where: { deck: { id: parseInt(deckId) } },
      });
    }

    if (!cards.length) {
      return res.status(404).json({ message: "No cards found for this deck" });
    }

    return res.json(cards);
  } catch (err) {
    console.error("Review start error:", err);
    return res
      .status(500)
      .json({ error: "Failed to start review", detail: err.message });
  }
};

exports.submitReview = async (req, res) => {
  const { deckId, results } = req.body;
  const userId = req.user.id;

  try {
    const deckRepo = AppDataSource.getRepository(Deck);
    const reviewRepo = AppDataSource.getRepository(Review);
    const cardRepo = AppDataSource.getRepository(Card);

    const deck = await deckRepo.findOne({
      where: { id: deckId, user: { id: userId } },
      relations: ["user"],
    });

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    let total = 0;

    console.log("Incoming review results:", results);
    for (const { cardId, difficulty } of results) {
      const card = await cardRepo.findOneBy({ id: String(cardId) });
      if (card) {
        const review = reviewRepo.create({
          card,
          difficulty,
          deck,
          user: deck.user,
          reviewedAt: new Date(),
        });

        await reviewRepo.save(review);
        total += difficulty;
      }
    }


    const totalScore = results.reduce((sum, r) => sum + r.difficulty, 0);
    const avgScore = results.length > 0 ? totalScore / results.length : 0;

    deck.score = avgScore;
    deck.lastReviewed = new Date();
    await deckRepo.save(deck);  

    const cacheKey = `user:${userId}:decks`;  

    const cachedDecks = await redisClient.get(cacheKey);  

    if (cachedDecks) {
      const parsedDecks = JSON.parse(cachedDecks);
      const updatedDecks = parsedDecks.map((d) => {
        if (d.id === deck.id) {
          return {
            ...d,
            score: deck.score,
            lastReviewed: deck.lastReviewed,
          };
        }
        return d;
      });

      await redisClient.set(cacheKey, JSON.stringify(updatedDecks), "EX", 600);
      console.log(
        "♻️ Redis cache updated"
      );
    }

    return res.json({ message: "Review submitted", score: avgScore });
  } catch (err) {
    console.error("Review submit error:", err);
    return res
      .status(500)
      .json({ message: "Failed to submit review", error: err.message });
  }
};