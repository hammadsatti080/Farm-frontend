"use client";

import { useEffect, useState } from "react";
import "./VaccineCategoryCards.css";

interface AnimalCategory {
  _id: string;
  name: string;
}

interface Vaccine {
  name: string;
}

interface VaccineCategoryItem {
  _id: string;
  animalCategory: AnimalCategory;
  vaccines: Vaccine[];
}

export default function VaccineCategoryCards() {
  const [records, setRecords] = useState<VaccineCategoryItem[]>([]);
  const [categories, setCategories] = useState<AnimalCategory[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    animalCategory: "",
    vaccines: [{ name: "" }],
  });

  // ================= FETCH DATA =================
  const fetchData = async () => {
    const res = await fetch(
      "https://farm-backend-lac.vercel.app/api/vaccine-category"
    );
    const data = await res.json();
    setRecords(data.data || data);
  };

  const fetchCategories = async () => {
    const res = await fetch(
      "https://farm-backend-lac.vercel.app/api/animalcategories"
    );
    const data = await res.json();
    setCategories(data.data || data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
      await fetchCategories();
    };

    load();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this record?");
    if (!ok) return;

    await fetch(
      `https://farm-backend-lac.vercel.app/api/vaccine-category/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchData();
  };

  // ================= EDIT OPEN =================
  const openEdit = (item: VaccineCategoryItem) => {
    setEditId(item._id);

    setForm({
      animalCategory: item.animalCategory?._id || "",
      vaccines: item.vaccines?.length
        ? item.vaccines
        : [{ name: "" }],
    });

    setEditOpen(true);
  };

  // ================= VACCINE HANDLERS =================
  const addVaccine = () => {
    setForm((prev) => ({
      ...prev,
      vaccines: [...prev.vaccines, { name: "" }],
    }));
  };

  const updateVaccine = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.vaccines];
      updated[index].name = value;
      return { ...prev, vaccines: updated };
    });
  };

  const removeVaccine = (index: number) => {
    setForm((prev) => ({
      ...prev,
      vaccines: prev.vaccines.filter((_, i) => i !== index),
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    await fetch(
      `https://farm-backend-lac.vercel.app/api/vaccine-category/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    setEditOpen(false);
    setEditId(null);

    fetchData();
  };

  return (
    <div>
      {/* ================= CARDS ================= */}
      <div className="cardsGrid">
        {records.map((item) => (
          <div key={item._id} className="card">
            <h3 className="cardTitle">
              {item.animalCategory?.name}
            </h3>

            <ul className="vaccineList">
              {item.vaccines?.map((v, i) => (
                <li key={i}>{v.name}</li>
              ))}
            </ul>

            <div className="btnRow">
              <button
                onClick={() => openEdit(item)}
                className="btn btnEdit"
                style={{width:"50px"}}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="btn btnDelete"
 style={{width:"60px"}}
>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Edit Vaccine Category</h3>

            {/* CATEGORY */}
            <select
              className="selectBox"
              value={form.animalCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  animalCategory: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>

              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* VACCINES */}
            <div className="vaccineBox">
              <button type="button" onClick={addVaccine}>
                ➕ Add Vaccine
              </button>

              {form.vaccines.map((v, i) => (
                <div key={i} className="vaccineRow">
                  <input
                    className="input"
                    value={v.name}
                    onChange={(e) =>
                      updateVaccine(i, e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeVaccine(i)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="modalActions">
              <button
                className="btn btnCancel"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btnUpdate"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}