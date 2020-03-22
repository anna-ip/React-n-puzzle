import React from "react";
import { Puzzle } from "./Components/Puzzle";

export const App = () => {
  return (
    <div className="window">
      <Puzzle />

      <button>Shuffle</button>
    </div>
  );
};
