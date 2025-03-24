import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Home from "./Pages/Home";
import Mapa from "./Pages/Mapa";
import FullCalendar from "./Pages/FullCalendar";
import Graficos from "./Pages/Graficos";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/fullcalendar" element={<FullCalendar />} />
          <Route path="/graficos" element={<Graficos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
