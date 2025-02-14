import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from "./components/HomeScreen"; // Import the home screen component
import MovableCat from "./components/MovableCat"; // Import the game page component

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} /> {/* Home screen route */}
        <Route path="/game" element={<MovableCat />} /> {/* Game screen route */}
      </Routes>
    </Router>
  );
}
