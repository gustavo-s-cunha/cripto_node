import React, { useEffect, useState } from "react";
import "./App.css";
import Router from "./routes/Router";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


//https://ateliware.com/blog/react-router?gad=1&gclid=Cj0KCQjw3JanBhCPARIsAJpXTx4sEQeILOq-9uDdb-6ahE3-8MM41BJwFSkATVvA1jlAgdppwkAmr88aAu1uEALw_wcB
//npm install @mui/material @mui/styled-engine-sc styled-components
//npm install @fontsource/roboto
//npm install @mui/icons-material
function App() {
  //const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:3333/")
  //     .then((response) => response.json())
  //     .then((data) => setMessage(data.message))
  //     .catch((error) => console.error("An error occurred:", error));
  // }, []);

  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}

export default App;
