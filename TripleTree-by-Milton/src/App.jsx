import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ResPage from "./pages/Reservation";
import RoomDetail from "./pages/RoomDetail";
import Payment from "./pages/Payment";
import Locations from "./pages/Locations"
import Offers from "./pages/Offers"
import Register from "./pages/Register";
import CustomerService from "./pages/CustomerSupport";
import ProfilePage from "./pages/ProfilePage";

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
          <Route path="locations" element={<Locations/>} />
          <Route path="offers" element={<Offers/>} />
          <Route path="register" element={<Register/>} />
          <Route path="CustomerSupport" element={<CustomerService/>} />
          <Route path="ProfilePage" element={<ProfilePage/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
