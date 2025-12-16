const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

// Get stock data from Finnhub
router.get('/stock/:ticker', async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`);

        // Finnhub returns 0s if ticker not found or invalid
        if (response.data.c === 0 && response.data.h === 0 && response.data.l === 0) {
            return res.status(404).json({ error: 'Ticker not found' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Create a new transaction
router.post('/transaction', async (req, res) => {
    try {
        const { ticker, price, quantity, type } = req.body;

        if (!ticker || !price || !quantity || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const total = price * quantity;

        const transaction = new Transaction({
            ticker,
            price,
            quantity,
            total,
            type
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: 'Failed to save transaction' });
    }
});

// Get recent transactions
router.get('/transactions', async (req, res) => {
    try {
        // Get last 20 transactions, sorted by date descending
        const transactions = await Transaction.find().sort({ date: -1 }).limit(20);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Remove all transactions (Optional, for cleanup/testing)
router.get('/clear', async (req, res) => {
    try {
        await Transaction.deleteMany({});
        res.json({ message: 'All transactions cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear transactions' });
    }
});

module.exports = router;
