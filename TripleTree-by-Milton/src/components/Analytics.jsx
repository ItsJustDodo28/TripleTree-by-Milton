import { useEffect, useState } from "react";
import "../styles/Analytics.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [reservationStats, setReservationStats] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState([]);

  useEffect(() => {
    // Fetch analytics data from the backend
    const fetchAnalyticsData = async () => {
      try {
        const resResponse = await fetch("http://localhost:5000/api/analytics/reservations");
        const roomResponse = await fetch("http://localhost:5000/api/analytics/occupancy");
        
        const resData = await resResponse.json();
        const roomData = await roomResponse.json();

        setReservationStats(resData);
        setRoomOccupancy(roomData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const reservationChartData = {
    labels: reservationStats.map((stat) => stat.date),
    datasets: [
      {
        label: "Reservations",
        data: reservationStats.map((stat) => stat.count),
        backgroundColor: ["#494949"],
        borderWidth: 1,
      },
    ],
  };

  const occupancyChartData = {
    labels: roomOccupancy.map((room) => room.type),
    datasets: [
      {
        label: "Occupancy Rate",
        data: roomOccupancy.map((room) => room.occupancy),
        backgroundColor: ["#767b7e", "#494949", "#f4f4f4", "#ecf0f1"],
      },
    ],
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-chart">
        <h3>Reservations Over Time</h3>
        <Bar data={reservationChartData} />
      </div>
      <div className="analytics-chart">
        <h3>Room Occupancy</h3>
        <Doughnut data={occupancyChartData} />
      </div>
    </div>
  );
};

export default Analytics;
