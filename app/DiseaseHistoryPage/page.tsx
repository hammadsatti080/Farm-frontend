"use client";

import { useEffect, useState } from "react";
import "./DiseaseHistory.css";
import { useRouter } from "next/navigation";

interface FormData {
  animalId: string;
  diseaseName: string;
  diagnosisDate: string;
  recoveryDate: string;
  doctorId: string;
  symptoms: string;
  notes: string;
  status: string;
}
interface Animal {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
}

interface DiseaseItem {
  _id: string;
  animalId?: Animal;
  diseaseName: string;
  diagnosisDate: string;
  recoveryDate?: string;
  doctorId?: Doctor;
  symptoms?: string;
  notes?: string;
  status: string;
}

export default function Page() {
 const [animals, setAnimals] = useState<Animal[]>([]);
const [doctors, setDoctors] = useState<Doctor[]>([]);
const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
const [filtered, setFiltered] = useState<DiseaseItem[]>([]);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    animalId: "",
    diseaseName: "",
    diagnosisDate: "",
    recoveryDate: "",
    doctorId: "",
    symptoms: "",
    notes: "",
    status: "Active",
  });

  // ================= LOAD =================

  // ================= FETCH ANIMALS =================
  const fetchAnimals = async () => {
    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/Handleanimals");
      const data = await res.json();
      setAnimals(data?.data || data || []);
    } catch {
      setAnimals([]);
    }
  };

  // ================= FETCH DOCTORS =================
  const fetchDoctors = async () => {
    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/handleteam");
      const data = await res.json();
      setDoctors(data?.data || data || []);
    } catch {
      setDoctors([]);
    }
  };

  // ================= FETCH DISEASES =================
  const fetchDiseases = async () => {
    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/disease-history");
      const data = await res.json();

      const records = data?.data || [];
      setDiseases(records);
      setFiltered(records);
    } catch {
      setDiseases([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
  const loadData = async () => {
    await fetchAnimals();
    await fetchDoctors();
    await fetchDiseases();
  };

  loadData();
}, []);


  // ================= SEARCH =================
  const handleSearch = (value: string) => {
    setSearch(value);

    const result = diseases.filter((item: DiseaseItem) => {
      return (
        item.animalId?.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.diseaseName?.toLowerCase().includes(value.toLowerCase()) ||
        item.doctorId?.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.status?.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFiltered(result);
  };

  // ================= FORM =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (item: DiseaseItem) => {
  setForm({
    animalId: item.animalId?._id || "",
    diseaseName: item.diseaseName,
    diagnosisDate: item.diagnosisDate?.split("T")[0],
    recoveryDate: item.recoveryDate?.split("T")[0] || "",
    doctorId: item.doctorId?._id || "",
    symptoms: item.symptoms || "",
    notes: item.notes || "",
    status: item.status,
  });

  setEditId(item._id);
  setOpen(true);
};

  // ================= SUBMIT =================
 const handleSubmit = async () => {
  try {
    const url = editId
      ? `https://farm-backend-lac.vercel.app/api/disease-history/${editId}`
      : `https://farm-backend-lac.vercel.app/api/disease-history`;

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await fetchDiseases();

    setOpen(false);
    setEditId(null);

    setForm({
      animalId: "",
      diseaseName: "",
      diagnosisDate: "",
      recoveryDate: "",
      doctorId: "",
      symptoms: "",
      notes: "",
      status: "Active",
    });
  } catch {
    alert("Error saving record");
  }
};

const handleDelete = async (id: string) => {
  const confirmDelete = confirm("Are you sure you want to delete this record?");

  if (!confirmDelete) return;

  try {
    await fetch(`https://farm-backend-lac.vercel.app/api/disease-history/${id}`, {
      method: "DELETE",
    });

    await fetchDiseases();
  } catch {
    alert("Delete failed");
  }
};

const router = useRouter();
const handlegoback=()=>{
  router.back();
}
  return (
    <div className="page">
      <h2>🐄 Disease History</h2>

      {/* TOP BAR */}
      <div className="topbar">
        <input
          className="search"
          placeholder="Search animal, disease, doctor..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <button className="addBtn" onClick={() => setOpen(true)}>
          ➕ Add Disease
        </button>
        <button className="addBtn" onClick={handlegoback}>
           Go back
        </button>
      </div>

      {/* TABLE */}
      
      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Animal</th>
              <th>Disease</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Acton</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item: DiseaseItem) => (
              <tr key={item._id}>
                <td>{item.animalId?.name}</td>
                <td>{item.diseaseName}</td>
                <td>{item.doctorId?.name}</td>
                <td>
                  {new Date(item.diagnosisDate).toLocaleDateString()}
                </td>
                <td>{item.status}</td>
             <td className="actions">
  <button
    onClick={() => handleEdit(item)}
    style={{
      padding: "5px 10px",
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(item._id)}
    style={{
      padding: "5px 10px",
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>{editId ? "Edit Disease Record" : "Add Disease Record"}</h3>

            <div className="grid">
              <select
                name="animalId"
                value={form.animalId}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Animal</option>
                {animals.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <input
                name="diseaseName"
                placeholder="Disease Name"
                value={form.diseaseName}
                onChange={handleChange}
                className="input"
              />

              <input
                type="date"
                name="diagnosisDate"
                value={form.diagnosisDate}
                onChange={handleChange}
                className="input"
              />

              <input
                type="date"
                name="recoveryDate"
                value={form.recoveryDate}
                onChange={handleChange}
                className="input"
              />

              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                <option value="Active">Active</option>
                <option value="Recovered">Recovered</option>
              </select>

              <textarea
                name="symptoms"
                placeholder="Symptoms"
                value={form.symptoms}
                onChange={handleChange}
                className="input"
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="modalActions">
              <button className="cancelBtn" onClick={() => setOpen(false)}>
                Cancel
              </button>

              <button className="saveBtn" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}