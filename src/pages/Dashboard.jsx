// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import API from "../api/axios";
import Card from "../components/Card";
import CalorieChart from "../components/CalorieChart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await API.get("/dashboard");
    setData(res.data.data);
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 bg-secondary min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Top Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Card>
          <p className="text-gray-500">Calories</p>
          <h2 className="text-xl font-bold">
            {data.today.consumed_calories} kcal
          </h2>
        </Card>

        <Card>
          <p className="text-gray-500">Remaining</p>
          <h2 className="text-xl font-bold">
            {data.today.remaining_calories} kcal
          </h2>
        </Card>

        <Card>
          <p className="text-gray-500">Weight</p>
          <h2 className="text-xl font-bold">
            {data.weight || "N/A"} kg
          </h2>
        </Card>
      </div>

      {/* Graph */}
      <Card>
        <h2 className="mb-3 font-semibold">Progress</h2>
        <CalorieChart data={data.graph || []} />
      </Card>

      {/* Meals */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">Today's Meals</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {data.meals.map((meal, i) => (
            <Card key={i}>
              <p className="text-sm text-gray-500">{meal.meal_type}</p>
              <h3 className="font-medium">{meal.food_name}</h3>
              <p>{meal.calories} kcal</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;