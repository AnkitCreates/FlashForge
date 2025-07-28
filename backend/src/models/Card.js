const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Card",
  tableName: "cards",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    front: {
      type: "text"
    },
    back: {
      type: "text"
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    }
  },
   
  relations: {
    deck: {
      type: "many-to-one",
      target: "Deck",
      joinColumn: true,
      onDelete: "CASCADE"
    },
    reviews: {
      type: "one-to-many",
      target: "Review",
      inverseSide: "card"
    }
  }
});