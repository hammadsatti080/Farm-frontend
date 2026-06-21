"use client";

import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./ChartDashboard.css";

type Milk = {
  _id: string;
  milkType: string;
  quantity: number;
};

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

export default function ChartDashboard() {
  const [data, setData] = useState<Milk[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/milk");
      const json = await res.json();
      setData(json.data || json);
    };

    load();
  }, []);

  // ================= GROUP DATA =================
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    data.forEach((item) => {
      const type = item.milkType || "Unknown";
      map[type] = (map[type] || 0) + Number(item.quantity || 0);
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [data]);

  const totalMilk = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="dashboard">

      <h2>🥛 Milk Analytics Dashboard</h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="cards">
        <div className="card">
          <h3>Total Milk</h3>
          <p>{totalMilk} L</p>
        </div>

        {chartData.map((item) => (
          <div className="card" key={item.name}>
            <h3>{item.name}</h3>
            <p>{item.value} L</p>
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts">

        {/* PIE CHART */}
        <div className="chartBox">
          <h3>Milk Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="chartBox">
          <h3>Milk Comparison</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}