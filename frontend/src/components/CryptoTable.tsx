import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchInitialCryptoData, connectWebSocket } from "../store/cryptoSlice";
import "./CryptoTable.css";

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, selectedCrypto } = useSelector(
    (state: RootState) => state.crypto
  );

  useEffect(() => {
    dispatch(fetchInitialCryptoData(selectedCrypto));
  }, [dispatch, selectedCrypto]);

  useEffect(() => {
    dispatch(connectWebSocket());
  }, []);

  return (
    <div style={{ textAlign: "center"}}>
      <h1 style={{ textTransform: "capitalize" }}>{selectedCrypto} Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Price in $</th>
              <th>Market Cap in $</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((crypto, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{crypto.current_price}</td>
                <td>{crypto.market_cap}</td>
                <td>{new Date(crypto.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
