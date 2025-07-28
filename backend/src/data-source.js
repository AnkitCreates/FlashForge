const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "flashcard_db",
  synchronize: true,
  logging: false,
  entities: [
    require("./models/User"),
    require("./models/Deck"),
    require("./models/Card"),
    require("./models/Review"),
  ],
  migrations: [],
  subscribers: [],
});

module.exports = {
  AppDataSource,
};