const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Deck",
  tableName: "decks",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    lastReviewed: {
      type: "timestamp",
      nullable: true,
    },
    score: {
      type: "float",
      default: 0,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    cards: {
      type: "one-to-many",
      target: "Card",
      inverseSide: "deck",
      cascade: true,
    },
  },
});