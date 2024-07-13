import axios from 'axios';
import express from 'express';
import mongoose from 'mongoose';
import cryptoRoutes from './routes/crypto';
import CryptoData, { ICryptoData } from './models/CryptoData';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config()

const POLL_INTERVAL:number = +(process.env.POLL_INTERVAL || 30000) ; // 30 seconds
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin', 'ripple'];
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cryptoDB';
const PORT = process.env.PORT || 8080;


async function connectToMongo() {
  await mongoose.connect(MONGO_URI,{family:4});
  console.log('Connected to MongoDB');
}

async function fetchCryptoData(ids: string[]): Promise<ICryptoData[]> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
  const response = await axios.get(url);
  return ids.map(id => ({
    id,
    current_price: response.data[id].usd,
    market_cap: response.data[id].usd_market_cap,
    last_updated: new Date(),
  })) as ICryptoData[];
}

async function saveCryptoData(data: ICryptoData[]) {
  const operations = data.map(item => ({
    updateOne: {
      filter: { id: item.id, last_updated: item.last_updated },
      update: { $set: item },
      upsert: true,
    },
  }));
  await CryptoData.bulkWrite(operations);
  // console.log('Crypto data saved to MongoDB');
}

async function pollCryptoData() {
  try {
    const data = await fetchCryptoData(CRYPTO_IDS);
    // console.log('Current Crypto Data:', data);
    await saveCryptoData(data);
    return data;
  } catch (error) {
    console.error('Error fetching or saving crypto data:');
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/crypto', cryptoRoutes);

connectToMongo().then(_=>{
  pollCryptoData();
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

const wss = new WebSocketServer({ server });
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

setInterval(async () => {
  const data = await pollCryptoData();
  if (data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}, POLL_INTERVAL);
})
