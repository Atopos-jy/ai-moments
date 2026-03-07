import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Tailwind CSS
import "./index.css";

//store
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 包裹Provider，注入Redux仓库 */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
