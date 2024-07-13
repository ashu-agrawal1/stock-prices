import { Router } from 'express';
import CryptoData from '../models/CryptoData';

const router = Router();

router.get('/recent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CryptoData.find({ id }).sort({ last_updated: -1 }).limit(20).exec();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

export default router;
