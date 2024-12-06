import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ResPage from "./pages/Reservation";
import RoomDetail from "./pages/RoomDetail";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="Reservations" element={<ResPage/>} />
          <Route path="room/:id" element={<RoomDetail />} />
          <Route path="payment" element={<Payment/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
