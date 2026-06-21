"use client";

import { useEffect, useState } from "react";

interface AnimalCategory {
  _id: string;
  name: string;
}

export default function BuyanimalCatagory() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<AnimalCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const API = "http://localhost:5000/api/animalcategories";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(API);

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        setEditingId(null);
      } else {
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      }

      setName("");
      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: AnimalCategory) => {
    setName(item.name);
    setEditingId(item._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
      }}
      className="buyanimal-wrapper"
    >
      {/* Responsive breakpoint styles (inline style objects can't do media queries) */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .buyanimal-wrapper {
            padding: 12px !important;
          }
          .buyanimal-title {
            font-size: 22px !important;
            margin-bottom: 18px !important;
           
          }
          .buyanimal-form-card {
            padding: 14px !important;
            border-radius: 10px !important;
          }
          .buyanimal-form-row {
            flex-direction: column !important;
          }
          .buyanimal-input {
            flex: 1 1 100% !important;
            width: 90% !important;
            font-size: 15px !important;
            padding: 12px !important;
          }
          .buyanimal-submit-btn {
            width: 100% !important;
            padding: 12px !important;
          }
          .buyanimal-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .buyanimal-card {
            padding: 16px !important;
          }
          .buyanimal-card h3 {
            font-size: 16px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .buyanimal-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          className="buyanimal-title"
          style={{
            textAlign: "left",
            marginBottom: "30px",
            color: "#0f172a",
            fontSize: "28px",
          }}
        >
          Animal Categories
        </h1>

        <div
          className="buyanimal-form-card"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <div
            className="buyanimal-form-row"
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Enter animal category"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="buyanimal-input"
              style={{
                flex: "1 1 300px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                minWidth: 0,
              }}
            />

            <button
              onClick={handleSubmit}
              className="buyanimal-submit-btn"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: editingId ? "#f59e0b" : "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div
          className="buyanimal-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          {categories.length > 0 ? (
            categories.map((item) => (
              <div
                key={item._id}
                className="buyanimal-card"
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
                }}
              >
                <h3
                  style={{
                    marginBottom: "20px",
                    color: "#1e293b",
                    textTransform: "capitalize",
                    wordBreak: "break-word",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      background: "#f59e0b",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      flex: 1,
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "30px",
                background: "#fff",
                borderRadius: "12px",
              }}
            >
              No Categories Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}