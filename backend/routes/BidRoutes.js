// BidRoutes.js
import express from 'express';
const router = express.Router();

// define your routes here
router.get('/', (req, res) => {
  res.send('Bid route works!');
});

export default router;   // <-- this line is crucial