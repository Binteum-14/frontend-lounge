import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import OwnerLounge from "./pages/OwnerLounge/OwnerLounge";
import McmCheck from "./pages/MCMCheck/MCMCheck";
import BagDetailView from "./pages/MCMCheck/BagDetailView";
import VisitPassView from "./pages/MCMCheck/VisitPassView";

import LoungeRoute from "./route";


function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/owner-lounge"
          element={<OwnerLounge />}
        />

        <Route
          path="/mcm-check"
          element={<McmCheck />}
        />

        <Route
          path="/bag-detail"
          element={<BagDetailView />}
        />

        <Route
          path="/focus-lounge"
          element={<LoungeRoute />}
        />

        <Route
          path="/visit-pass"
          element={<VisitPassView />}
        />

      </Routes>
    </Router>
  );
}


export default App;