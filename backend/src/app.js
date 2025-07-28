const express = require('express');;
const cors = require('cors');
const { AppDataSource } = require('./data-source');

// Routers
const userRouter = require('./routes/user.routes');
const deckRouter = require('./routes/deck.routes');
const cardRouter = require('./routes/card.routes');
const reviewRouter = require('./routes/review.routes');

const app = express();
const PORT = process.env.PORT || 3000;  // specifying the port

// Middleware
app.use(cors());
// app.use(morgan('dev'));
app.use(express.json());

// Root route
app.get('/', (req , res) => {
  res.send('Flashcard API is running');
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/decks', deckRouter);
app.use('/api/cards', cardRouter);
app.use('/api/reviews', reviewRouter);

// Start server only after DB connects
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });