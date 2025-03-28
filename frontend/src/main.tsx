import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";



ReactDOM.createRoot(document.getElementById("root")!).render(
    //<React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    //</React.StrictMode>
);
