"use client";

import React, { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
interface Role {
  _id: string;
  name: string;
}

interface TeamForm {
  name: string;
  farmNo: string;
  phone: string;
  role: string;
  paymentFee: string;
  joinDate: string;
  bloodGroup: string;
  status: string;
}

interface TeamItem extends TeamForm {
  _id: string;
}

/* ---------------- API ---------------- */
const TEAM_API = "http://localhost:5000/api/handleteam";
const ROLE_API = "http://localhost:5000/api/work-typesCatagory";

/* ---------------- COMPONENT ---------------- */
export default function Handleteam() {
  const [list, setList] = useState<TeamItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const [form, setForm] = useState<TeamForm>({
    name: "",
    farmNo: "",
    phone: "",
    role: "",
    paymentFee: "",
    joinDate: "",
    bloodGroup: "",
    status: "Active",
  });

  /* ---------------- MOBILE DETECT ---------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchTeam = async () => {
    const res = await fetch(TEAM_API);
    const data = await res.json();
    setList(data || []);
  };




  /* ---------------- FETCH (FIXED) ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamRes, roleRes] = await Promise.all([
          fetch(TEAM_API),
          fetch(ROLE_API),
        ]);

        const teamData = await teamRes.json();
        const roleData = await roleRes.json();

        setList(teamData || []);
        setRoles(roleData || []);
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    loadData();
  }, []);


  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!form.name || !form.farmNo || !form.phone || !form.role) {
      alert("Required fields missing");
      return;
    }

    const url = editId ? `${TEAM_API}/${editId}` : TEAM_API;
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        paymentFee: form.paymentFee ? Number(form.paymentFee) : 0,
      }),
    });

    setOpen(false);
    setEditId(null);

    setForm({
      name: "",
      farmNo: "",
      phone: "",
      role: "",
      paymentFee: "",
      joinDate: "",
      bloodGroup: "",
      status: "Active",
    });

    fetchTeam();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    await fetch(`${TEAM_API}/${id}`, { method: "DELETE" });
    fetchTeam();
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (item: TeamItem) => {
    setForm(item);
    setEditId(item._id);
    setOpen(true);
  };

  /* ---------------- FILTER ---------------- */
  const filtered = list.filter((x) =>
    `${x.name} ${x.phone} ${x.farmNo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page">

      {/* HEADER */}
      <div className="headerCard">
        <div>
          <h2>👨‍🌾 Farm Team Dashboard</h2>
          <p>Manage workers, roles & farm staff</p>
        </div>

        <div className="topBar">
          <input
            placeholder="Search worker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setOpen(true)}>+ Add Worker</button>
        </div>
      </div>

      {/* LIST */}
      <div className="tableCard">

        {isMobile ? (
          /* ================= MOBILE CARD VIEW ================= */
          <div className="mobileList">
            {filtered.map((item) => (
              <div className="mobileCard" key={item._id}>
                <div><b>{item.name}</b> ({item.farmNo})</div>
                <div>📞 {item.phone}</div>
                <div>👨‍🌾 {item.role}</div>
                <div>💰 Fee: {item.paymentFee}</div>
                <div>🩸 Blood: {item.bloodGroup || "-"}</div>
<div>
  📅 DOJ:{" "}
  {item.joinDate
    ? new Date(item.joinDate).toLocaleDateString()
    : "-"}
</div>
                <div>
                  Status:{" "}
                  <span className={item.status === "Active" ? "active" : "inactive"}>
                    {item.status}
                  </span>
                </div>

                <div className="btnRow">
                  <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= DESKTOP TABLE ================= */
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Farm No</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Fee</th>
                <th>Blood</th>
                   <th>DOJ</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.farmNo}</td>
                  <td>{item.phone}</td>
                  <td>{item.role}</td>
                  <td>{item.paymentFee}</td>
                  <td>{item.bloodGroup || "-"}</td>
       <td>
  {item.joinDate
    ? new Date(item.joinDate).toLocaleDateString()
    : "-"}
</td>
                  <td>
                    <span className={item.status === "Active" ? "active" : "inactive"}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* MODAL */}
      {open && (
        <div className="modal">
          <div className="modalBox">
            <h3>{editId ? "Update Worker" : "Add Worker"}</h3>

            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="farmNo" placeholder="Farm No" value={form.farmNo} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

            <select name="role" value={form.role} onChange={handleChange}>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r.name}>{r.name}</option>
              ))}
            </select>

            <input name="paymentFee" placeholder="Payment Fee" onChange={handleChange} />
            <input type="date" name="joinDate" onChange={handleChange} />

            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              <option value="">Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
            </select>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modalActions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`
        .page {
          padding: 16px;
          background: #f4f6f9;
          min-height: 100vh;
          font-family: Arial;
        }

        /* HEADER */
        .headerCard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          background: white;
          padding: 15px;
          border-radius: 12px;
        }

        .topBar {
          display: flex;
          gap: 10px;
        }

        input, select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        button {
          padding: 10px 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* TABLE */
        .tableCard {
          margin-top: 12px;
          background: white;
          padding: 10px;
          border-radius: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        /* BUTTONS */
        .edit {
          background: #f59e0b;
          color: white;
          margin-right: 5px;
        }

        .delete {
          background: #ef4444;
          color: white;
        }

        .active {
          color: green;
          font-weight: bold;
        }

        .inactive {
          color: red;
          font-weight: bold;
        }

        /* MOBILE CARDS */
        .mobileList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobileCard {
          background: #fff;
          padding: 12px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .btnRow {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        /* MODAL */
       .modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.6);

  z-index: 99999;

  padding: 10px;
  box-sizing: border-box;
}

        .modalBox {
          background: white;
          width: 100%;
          max-width: 420px;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modalActions {
          display: flex;
          gap: 10px;
        }

        .modalActions button:first-child {
          flex: 1;
          background: #16a34a;
          color: white;
        }

        .modalActions button:last-child {
          flex: 1;
          background: #ef4444;
          color: white;
        }

        /* RESPONSIVE FIX */
        @media (max-width: 768px) {
          .headerCard {
            flex-direction: column;
            align-items: stretch;
          }

          .topBar {
            flex-direction: column;
            width: 100%;
          }

          .topBar input,
          .topBar button {
            width: 90%;
          }

          table {
            min-width: 600px;
          }

          .modalBox {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}