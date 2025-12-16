# Stock Portfolio App

**Submitted by:** Niyant Patel (niyantp)

**Group Members:** Niyant Patel (niyantp), Bhrugu Bhatt (bbhatt1)

**App Description:** A stock portfolio tracker that allows users to search real-time stock prices using the Finnhub API and record buy/sell transactions stored in MongoDB.

**YouTube Video Link:** https://youtu.be/uHEhIPPZUqc

**APIs:** Finnhub Stock API (https://finnhub.io/)

**Contact Email:** niyantp@terpmail.umd.edu

**Deployed App Link:** https://three35-final-project-sqew.onrender.com/

---

## Setup (Local Development)

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with:
   ```
   MONGO_CONNECTION_STRING=your_mongodb_uri
   FINNHUB_API_KEY=your_finnhub_api_key
   ```
4. Run `node server.js` to start the server
5. Open `http://localhost:3000`
