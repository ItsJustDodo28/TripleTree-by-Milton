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
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

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
          <Route path="login" element={<Login/>} />
          <Route path="ProfilePage" element={
            <ProtectedRoute allowedRoles={['user']}>
              <ProfilePage/>
            </ProtectedRoute>
            } />
          <Route path="AdminDashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard/>
            </ProtectedRoute>
            } />

          <Route path="unauthorized" element={<h1>You don&apos;t have access</h1>} />
          <Route path="*" element={<><h1>404</h1><h1 style={{fontSize: 13}}>Page Not Found</h1></>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
