document.addEventListener('DOMContentLoaded', () => {
    const tickerInput = document.getElementById('tickerInput');
    const stockInfo = document.getElementById('stockInfo');
    const stockSymbol = document.getElementById('stockSymbol');
    const currentPrice = document.getElementById('currentPrice');
    const highPrice = document.getElementById('highPrice');
    const lowPrice = document.getElementById('lowPrice');
    const buyBtn = document.getElementById('buyBtn');
    const sellBtn = document.getElementById('sellBtn');
    const quantityInput = document.getElementById('quantityInput');
    const transactionList = document.getElementById('transactionList');
    const portfolioValue = document.getElementById('portfolioValue');
    const clearBtn = document.getElementById('clearBtn');

    let currentTickerData = null;

    // Load initial transactions
    fetchTransactions();

    const searchForm = document.getElementById('searchForm');
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ticker = tickerInput.value.trim();
        if (!ticker) return;

        try {
            const response = await fetch(`/api/stock/${ticker}`);
            if (!response.ok) {
                const err = await response.json();
                alert(err.error || 'Stock not found');
                return;
            }

            const data = await response.json();
            currentTickerData = { ticker: ticker.toUpperCase(), price: data.c };

            stockSymbol.textContent = ticker.toUpperCase();
            currentPrice.textContent = `$${data.c}`;
            highPrice.textContent = `$${data.h}`;
            lowPrice.textContent = `$${data.l}`;

            stockInfo.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch stock data');
        }
    });

    async function handleTransaction(type) {
        if (!currentTickerData) return;

        const quantity = parseInt(quantityInput.value);
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        const transaction = {
            ticker: currentTickerData.ticker,
            price: currentTickerData.price,
            quantity: quantity,
            type: type
        };

        try {
            const response = await fetch('/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (response.ok) {
                alert('Transaction Saved!');
                quantityInput.value = '';
                fetchTransactions();
            } else {
                alert('Failed to save transaction');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving transaction');
        }
    }

    buyBtn.addEventListener('click', () => handleTransaction('BUY'));
    sellBtn.addEventListener('click', () => handleTransaction('SELL'));

    clearBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to clear all transactions?')) return;
        
        try {
            const response = await fetch('/api/clear');
            if (response.ok) {
                alert('Portfolio cleared!');
                // Reset to initial state
                tickerInput.value = '';
                quantityInput.value = '';
                stockInfo.classList.add('hidden');
                currentTickerData = null;
                fetchTransactions();
            } else {
                alert('Failed to clear portfolio');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error clearing portfolio');
        }
    });

    async function fetchTransactions() {
        try {
            const response = await fetch('/api/transactions');
            const transactions = await response.json();

            transactionList.innerHTML = transactions.map(t => `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString()} ${new Date(t.date).toLocaleTimeString()}</td>
                    <td style="color: ${t.type === 'BUY' ? '#27ae60' : '#e74c3c'}; font-weight: 600;">${t.type}</td>
                    <td>${t.ticker}</td>
                    <td>$${t.price.toLocaleString()}</td>
                    <td>${t.quantity}</td>
                    <td>$${t.total.toFixed(2)}</td>
                </tr>
            `).join('');

            // Calculate total portfolio value (BUY adds, SELL subtracts)
            const totalValue = transactions.reduce((sum, t) => {
                return t.type === 'BUY' ? sum + t.total : sum - t.total;
            }, 0);
            
            portfolioValue.textContent = `$${totalValue.toFixed(2)}`;
            portfolioValue.style.color = totalValue >= 0 ? '#27ae60' : '#e74c3c';
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }
});
