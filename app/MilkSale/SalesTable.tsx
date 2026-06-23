"use client";

import { useEffect, useState,  } from "react";

type Category = {
    _id: string;
    name: string;
};

type Sale = {
    _id: string;
    name: string;
    quantity: number;
    pricePerKg: number;
    totalPrice: number;
    date?: string;
    milkType?: string;
    category?: Category | string;
};

export default function SalesTable() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [categoryFilter, setCategoryFilter] = useState("");
    const [milkFilter, setMilkFilter] = useState("");

useEffect(() => {
  const fetchSales = async () => {
    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/sales");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setSales(data.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchSales();
}, []);

    const handleDelete = async (id: string) => {
        await fetch(`https://farm-backend-lac.vercel.app/api/sales/${id}`, {
            method: "DELETE",
        });

        setSales((prev) => prev.filter((i) => i._id !== id));
    };

    const handleEdit = async (item: Sale) => {
        const newQty = prompt("Enter quantity", String(item.quantity));
        if (!newQty) return;

        const qty = Number(newQty);
        if (isNaN(qty)) return;

        await fetch(`https://farm-backend-lac.vercel.app/api/sales/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: qty }),
        });

        setSales((prev) =>
            prev.map((s) => (s._id === item._id ? { ...s, quantity: qty } : s))
        );
    };

    const filtered = sales.filter((item) => {
        const cat =
            typeof item.category === "object" ? item.category?.name : item.category;

        return (
            (!categoryFilter || cat === categoryFilter) &&
            (!milkFilter || item.milkType === milkFilter)
        );
    });

    const categories = [
        ...new Set(
            sales.map((s) =>
                typeof s.category === "object" ? s.category?.name : s.category
            )
        ),
    ].filter(Boolean);

    const milkTypes = ["Cow", "Buffalo", "Goat"];

    if (loading) return <p className="status">Loading...</p>;
    if (error) return <p className="status error">{error}</p>;

    return (
        <div className="page">
            <h2>Sales Records</h2>

            {/* ================= FILTERS ================= */}
            <div className="filters">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Category</option>
                    {categories.map((c, i) => (
                        <option key={i} value={c!}>
                            {c}
                        </option>
                    ))}
                </select>

                <select
                    value={milkFilter}
                    onChange={(e) => setMilkFilter(e.target.value)}
                >
                    <option value="">Milk Type</option>
                    {milkTypes.map((m, i) => (
                        <option key={i} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            {/* ================= TABLE ================= */}
            <div className="table-container">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Milk</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>
                                    {typeof item.category === "object"
                                        ? item.category?.name
                                        : item.category}
                                </td>
                                <td>{item.milkType}</td>
                                <td>{item.quantity}</td>
                                <td>{item.pricePerKg}</td>
                                <td>{item.totalPrice}</td>
                                <td>{item.date}</td>
                                <td>
                                    <button className="edit" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                    <button className="delete" onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="mobile-cards">
                {filtered.map((item) => (
                    <div key={item._id} className="card">
                        <div className="card-header">
                            <b>{item.name}</b>
                            <span>{item.milkType}</span>
                        </div>

                        <p>Category: {typeof item.category === "object" ? item.category?.name : item.category}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>Total: {item.totalPrice}</p>

                        <div className="card-actions">
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= CSS ================= */}
            <style jsx>{`
        .page {
          padding: 20px;
          background: #f4f6fb;
          min-height: 100vh;
        }

        h2 {
          margin-bottom: 15px;
        }

        /* FILTERS */
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        /* TABLE */
        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        .sales-table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
        }

        th {
          background: #4f46e5;
          color: white;
          padding: 12px;
          text-align: left;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        tr:hover {
          background: #f9fafb;
        }

        /* BUTTONS */
        .edit {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 5px 10px;
          margin-right: 5px;
          border-radius: 6px;
        }

        .delete {
          background: #ef4444;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
        }

        /* MOBILE */
        .mobile-cards {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .card {
          background: white;
          padding: 12px;
          border-radius: 10px;
          border-left: 5px solid #4f46e5;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .sales-table {
            display: none;
          }

          .mobile-cards {
            display: flex;
          }

          .filters {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
}