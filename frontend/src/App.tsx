import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import CryptoTable from "./components/CryptoTable";
import CryptoSelector from "./components/CryptoSelector";
import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <CryptoSelector />
        <CryptoTable />
      </div>
    </Provider>
  );
};

export default App;
