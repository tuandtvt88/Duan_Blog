import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {MyContextProvider} from "./components/Mycontext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <MyContextProvider>
    <App />
      </MyContextProvider>
  </BrowserRouter>
);
