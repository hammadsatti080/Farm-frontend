"use client";

import { useEffect, useState } from "react";
import "./CategoryManager.css"
interface Category {
  _id: string;
  name: string;
}

export default function CategoryManager() {
  const [name, setName] = useState("");
  const [editId, setEditId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
  const res = await fetch("https://farm-backend-lac.vercel.app/api/categories");
  const data = await res.json();

  setCategories(data.data || data); // IMPORTANT FIX
};
useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/categories");
      const data = await res.json();

      setCategories(data.data || data);
    } catch (error) {
      console.error(error);
    }
  };

  loadCategories();
}, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (editId) {
        await fetch(`https://farm-backend-lac.vercel.app/api/categories/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        setEditId("");
      } else {
        await fetch("https://farm-backend-lac.vercel.app/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      }

      setName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditId(category._id);
    setName(category.name);
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://farm-backend-lac.vercel.app/api/categories/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  };

  return (
    <div>
      <h2>Category Management</h2>

      <div className="category-form">
        <input
          type="text"
          placeholder="Enter category"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category._id}
            className="category-card"
          >
            <h3>{category.name}</h3>

            <div className="card-actions">
              <button
                onClick={() =>
                  handleEdit(category)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(category._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}