"use client";

import { useEffect, useState } from "react";
import "./Fetchmilk.css";

type Milk = {
  _id: string;
  milkId: number;
  milkType: string;
  quantity: number;
  date: string;
  time: string;
  category?: { name: string };
};

export default function Fetchmilk({ search }: { search: string }) {
  const [milkData, setMilkData] = useState<Milk[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:5000/api/milk");
      const data = await res.json();
      setMilkData(data.data || data);
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/milk/${id}`, {
      method: "DELETE",
    });

    setMilkData((prev) => prev.filter((m) => m._id !== id));
  };

  const handleEdit = async (item: Milk) => {
    const quantity = prompt("Enter quantity", String(item.quantity));
    if (!quantity) return;

    await fetch(`http://localhost:5000/api/milk/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Number(quantity) }),
    });

    setMilkData((prev) =>
      prev.map((m) =>
        m._id === item._id ? { ...m, quantity: Number(quantity) } : m
      )
    );
  };

  // SEARCH FILTER
  const filtered = milkData.filter((item) =>
    item.milkType.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="page">
      <h2>Milk Records</h2>

      {/* ================= TABLE (DESKTOP) ================= */}
      <div className="table-container">
        <table className="milk-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.milkId}</td>
                <td>{item.category?.name}</td>
                <td>{item.milkType}</td>
                <td>{item.quantity}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>
                  <button onClick={() => handleEdit(item)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={3}>Total</td>
              <td colSpan={4}>{total} L</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="mobile-cards">
        {filtered.map((item) => (
          <div className="milk-card" key={item._id}>
            <div className="card-header">
              <span className="badge">#{item.milkId}</span>
              <span className="type">{item.milkType}</span>
            </div>

            <div className="card-body">
              <p><b>Category:</b> {item.category?.name}</p>
              <p><b>Qty:</b> {item.quantity} L</p>
              <p><b>Date:</b> {item.date}</p>
              <p><b>Time:</b> {item.time}</p>
            </div>

            <div className="card-actions">
              <button onClick={() => handleEdit(item)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="total-box">
          Total Milk: <b>{total} L</b>
        </div>
      </div>
    </div>
  );
}