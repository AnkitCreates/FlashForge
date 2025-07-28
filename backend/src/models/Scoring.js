const getPointsForDifficulty = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return 3;
    case "medium":
      return 2;
    case "hard":
      return 1;
    default:
      return 0;
  }
};

const calculateDeckScore = async (deckId, reviewRepo, cardRepo) => {
  const cards = await cardRepo.find({ where: { deck: { id: deckId } } });
  const cardIds = cards.map((card) => card.id);

  const allReviews = await reviewRepo.find({
    where: cardIds.map((id) => ({ card: { id } })),
  });

  let totalPoints = 0;
  let reviewCount = 0;

  allReviews.forEach((review) => {
    totalPoints += getPointsForDifficulty(review.difficulty);
    reviewCount++;
  });

  return reviewCount ? totalPoints / (reviewCount * 3) * 100 : 0; // score in %
};

module.exports = {
  getPointsForDifficulty,
  calculateDeckScore,
};