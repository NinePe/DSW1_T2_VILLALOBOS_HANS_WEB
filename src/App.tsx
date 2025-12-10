import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BooksPage from "./pages/BooksPage";
import LoansPage from "./pages/LoansPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            {/* Módulo Libros */}
            <Route path="/" element={<BooksPage />} />

            {/* Módulo Préstamos */}
            <Route path="/loans" element={<LoansPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
