import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from './index';

const base_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
const socket_url = process.env.REACT_APP_SOCKET_URL || "ws://localhost:8080"

console.log(base_url, socket_url)

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  last_updated: string;
}

interface CryptoState {
  data: CryptoData[];
  loading: boolean;
  error: string | null;
  selectedCrypto: string;
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
  selectedCrypto: 'bitcoin',
};

export const fetchInitialCryptoData = createAsyncThunk(
  'crypto/fetchInitialCryptoData',
  async (cryptoId: string) => {
    const response = await axios.get<CryptoData[]>(`${base_url}/api/crypto/recent/${cryptoId}`);
    return response.data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSelectedCrypto(state, action: PayloadAction<string>) {
      state.selectedCrypto = action.payload;
      state.data = [];
    },
    addCryptoData(state, action: PayloadAction<CryptoData>) {
      state.data=[action.payload,...state.data]
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInitialCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { setSelectedCrypto, addCryptoData, setLoading, setError } = cryptoSlice.actions;

export const connectWebSocket = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const ws = new WebSocket(`${socket_url}`);

  ws.onopen = () => {
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const data: CryptoData[] = JSON.parse(event.data);
    const { selectedCrypto } = getState().crypto;
    const filteredData = data.find(crypto => crypto.id === selectedCrypto);
    if(filteredData){
      dispatch(addCryptoData(filteredData));
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    dispatch(setError('WebSocket error'));
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export default cryptoSlice.reducer;
