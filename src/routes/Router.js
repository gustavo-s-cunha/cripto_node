import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";

import Main from "../pages/main/Main";
import Analises from "../pages/analises/FileAnalises";

function Router() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/analises" element={<Analises />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
