import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./components/Header";
// import Info from "./components/Info";
import Chatbot from "./components/chatbot/Chatbot";

const App = () => (
  <div>
    <BrowserRouter>
      <div>
        <Header />
        {/* <Route exact path="/" component={Info} /> */}
        <Chatbot />
      </div>
    </BrowserRouter>
  </div>
);

export default App;
