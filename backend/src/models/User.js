const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    username: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    decks: {
      target: "Deck",
      type: "one-to-many",
      inverseSide: "user",
    },
  },
});