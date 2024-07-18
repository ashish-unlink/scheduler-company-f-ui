import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./redux";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import "./responsive.css";

let persistor = persistStore(store);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
reportWebVitals();
