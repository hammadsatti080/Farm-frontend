"use client";

import { useEffect, useState } from "react";
import "./Navmilk.css";

type Category = {
  _id: string;
  name: string;
};

export default function Navmilk({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    category: "",
    milkType: "",
    quantity: "",
    date: "",
  });

  const [time] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/categories");
      const data = await res.json();
      setCategories(data.data || data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleSubmit = async () => {
    await fetch("https://farm-backend-lac.vercel.app/api/milk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ category: "", milkType: "", quantity: "", date: "" });
    setOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        <div className="searchBox">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search milk type..."
          />
        </div>

        <button onClick={() => setOpen(true)}>+ Add Milk</button>
      </nav>

      {/* MODAL */}
      {open && (
        <div className="modalOverlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Milk</h2>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={form.milkType}
              onChange={(e) =>
                setForm({ ...form, milkType: e.target.value })
              }
            >
              <option value="">Milk Type</option>
              <option>Cow</option>
              <option>Goat</option>
              <option>Buffalo</option>
            </select>

            <input
              type="number"
              placeholder="Quantity (KG)"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <input
              type="date"
              value={form.date}
              min={today}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <div className="timeBox">
              ⏰ {time}
            </div>

            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}