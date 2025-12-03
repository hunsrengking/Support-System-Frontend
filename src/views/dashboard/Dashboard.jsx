import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">Total Tickets: 2847</div>
        <div className="bg-white p-4 rounded-xl shadow border">Vehicles: 3205</div>
        <div className="bg-white p-4 rounded-xl shadow border">Services Today: 28</div>
        <div className="bg-white p-4 rounded-xl shadow border">Revenue Today: $2450</div>
        <div className="bg-white p-4 rounded-xl shadow border">Pending Tickets: 12</div>
      </div>
    </div>
  );
};

export default Dashboard;