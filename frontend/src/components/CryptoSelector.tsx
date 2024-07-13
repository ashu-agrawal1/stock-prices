import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setSelectedCrypto } from "../store/cryptoSlice";
import "./CryptoSelector.css";

const CryptoSelector: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCrypto } = useSelector((state: RootState) => state.crypto);

  return (
    <div style={{ margin: "8px", marginTop: "20px" }}>
      <button onClick={() => setShowModal(true)} style={{ padding: "4px" }}>
        Change Crypto
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ margin: "8px", marginBottom: "12px" }}>
              Select Crypto
            </h2>
            <select
              id="c"
              onChange={(e) => {
                dispatch(setSelectedCrypto(e.target.value));
                setShowModal(false);
              }}
              value={selectedCrypto}
              style={{ margin: "8px", height: "30px" }}
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="dogecoin">Dogecoin</option>
              <option value="litecoin">Litecoin</option>
              <option value="ripple">Ripple</option>
            </select>
            {/* <button onClick={handleSave}>Save</button> */}
            <button
              onClick={() => setShowModal(false)}
              style={{ padding: "4px", margin: "8px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoSelector;
