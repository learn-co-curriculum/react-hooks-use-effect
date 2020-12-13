import React, { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("useEffect called");
  });

  console.log("Component rendering");

  return <button>Click Me</button>;
}

export default App;
