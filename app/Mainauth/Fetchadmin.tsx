"use client";

import { useEffect, useState } from "react";
import "./Fetchadmin.css";

export default function Fetchadmin() {
  const API = "http://localhost:5000/api/auth";

 // ✅ After
interface Admin {
  _id: string;
  username: string;
  password: string;
  adminId: string;
}

const [admins, setAdmins] = useState<Admin[]>([]);
const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  /* ================= FETCH ================= */
 const fetchAdmins = async () => {
  try {
    const res = await fetch(`${API}/admins`);
    const data = await res.json();

    setAdmins(data.admins); // ✅ FIX HERE
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API}/admins`);
      const data = await res.json();
      setAdmins(data.admins);
    } catch (err) {
      console.log(err);
    }
  };
  fetchAdmins();
}, []);

  /* ================= DELETE ================= */
  const deleteAdmin = async (id: string) => {
    await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
    });

    fetchAdmins();
  };

  /* ================= START EDIT ================= */
  const startEdit = (admin : Admin) => {
    setEditingId(admin._id);
    setForm({
      username: admin.username,
      password: admin.password,
    });
  };

  /* ================= UPDATE ================= */
  const updateAdmin = async () => {
    await fetch(`${API}/update/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setEditingId(null);
    setForm({ username: "", password: "" });
    fetchAdmins();
  };

  /* ================= UI ================= */
  return (
    <div className="cards-section">
      <h2 style={{textAlign:"center"}}>Registered Admins</h2>

      {/* EDIT FORM */}
      {editingId && (
        <div className="edit-box">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button onClick={updateAdmin}>Update</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      )}

      {/* CARDS */}
      <div className="grid">
        {admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          admins.map((admin) => (
            <div className="admin-card" key={admin._id}>
              <div className="avatar">
                {admin.username?.charAt(0).toUpperCase()}
              </div>

              <h3>{admin.username}</h3>
              <p>{admin.password}</p>
              <p>ID: {admin.adminId}</p>

              <div className="actions">
                <button onClick={() => startEdit(admin)}>Edit</button>
                <button onClick={() => deleteAdmin(admin._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}