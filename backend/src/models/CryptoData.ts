import { Schema, model, Document } from 'mongoose';

interface ICryptoData extends Document {
  id: string;
  current_price: number;
  market_cap: number;
  last_updated: Date;
}

const CryptoDataSchema = new Schema<ICryptoData>({
  id: { type: String, required: true },
  current_price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now },
});

const CryptoData = model<ICryptoData>('CryptoData', CryptoDataSchema);

export default CryptoData;
export { ICryptoData };
