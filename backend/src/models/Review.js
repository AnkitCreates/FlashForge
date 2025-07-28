const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Review",
  tableName: "reviews",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    difficulty: {
      type: "varchar"
    },
    reviewedAt: {
      type: "timestamp",
      createDate: true
    }
  },
  relations: {
    card: {
      type: "many-to-one",
      target: "Card",
      joinColumn: true,
      onDelete: "CASCADE"
    }
  }
});
