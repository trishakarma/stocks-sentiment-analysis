import express from 'express';
import { readData } from './connection';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();
const database = "sentiments";

router.get("/api/hello", (req, res) => {
  res.json("SingleStore Connected");
});

router.get("/api/market/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Market API error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

router.get("/api/database/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  
  try {
    const sqlRes = await readData({ database, symbol });
    const sentiment = analyzeSentiment(sqlRes);
    res.send(`${symbol}: ${sentiment}`);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).send('Error retrieving sentiment data');
  }
});

function analyzeSentiment(text: string): string {
  if (!text || text === 'No similar tweets found') {
    return 'No sentiment data available';
  }
  
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'bullish', 'up', 'rise', 'gain', 'profit'];
  const negativeWords = ['bad', 'poor', 'negative', 'bearish', 'down', 'fall', 'loss', 'drop', 'decline'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) {
    return 'Positive sentiment detected 📈';
  } else if (negativeCount > positiveCount) {
    return 'Negative sentiment detected 📉';
  } else {
    return 'Neutral sentiment detected ➡️';
  }
}

export default router;