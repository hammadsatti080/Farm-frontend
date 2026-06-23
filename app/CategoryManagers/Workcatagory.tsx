
"use client";

import React, {
    useEffect,
    useState,
} from "react";

interface WorkType {
    _id: string;
    name: string;
}

const API =
    "http://localhost:5000/api/work-typesCatagory";

export default function Workcatagory() {
    const [types, setTypes] = useState<
        WorkType[]
    >([]);

    const [name, setName] =
        useState("");

    const [editId, setEditId] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const fetchTypes = async () => {
        const res = await fetch(API);
        const data = await res.json();
        setTypes(data || []);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            await fetchTypes();

            setLoading(false);
        })();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            if (editId) {
                await fetch(
                    `${API}/${editId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                        }),
                    }
                );
            } else {
                await fetch(API, {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                    }),
                });
            }

            setName("");
            setEditId(null);

            fetchTypes();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (
        id: string
    ) => {
        if (
            !confirm(
                "Delete this category?"
            )
        )
            return;

        try {
            await fetch(`${API}/${id}`, {
                method: "DELETE",
            });

            fetchTypes();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="container">
                <div className="wrapper">
                    <div className="header">
                        <h1>
                            📦 Work Categories
                        </h1>
                        <p>
                            Manage your work
                            categories
                        </p>
                    </div>

                    <div className="form">
                        <input
                            type="text"
                            placeholder="Enter Category Name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            onClick={handleSave}
                        >
                            {editId
                                ? "Update Category"
                                : "Add Category"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">
                            Loading...
                        </div>
                    ) : (
                        <div className="grid">
                            {types.map((item) => (
                                <div
                                    key={item._id}
                                    className="card"
                                >
                                    <h3>
                                        {item.name}
                                    </h3>

                                    <div className="actions">
                                        <button
                                            className="editBtn"
                                            onClick={() => {
                                                setName(
                                                    item.name
                                                );
                                                setEditId(
                                                    item._id
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="deleteBtn"
                                            onClick={() =>
                                                handleDelete(
                                                    item._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: linear-gradient(
            135deg,
            #f3f4f6,
            #e5e7eb
          );
          padding: 20px;
        }

        .wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 25px;
        }

        .header h1 {
          margin: 0;
          font-size: 34px;
          color: #111827;
        }

        .header p {
          color: #6b7280;
          margin-top: 8px;
        }

        .form {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 5px 20px
            rgba(0, 0, 0, 0.08);

          display: flex;
          gap: 12px;
          margin-bottom: 25px;
        }

        .form input {
          flex: 1;
          min-width: 0;
          width: 100%;
          padding: 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          outline: none;
        }

        .form button {
          border: none;
          background: #2563eb;
          color: white;
          padding: 14px 20px;
          border-radius: 10px;
          cursor: pointer;
          white-space: nowrap;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          padding: 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(250px, 1fr)
          );
          gap: 40px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 5px 20px
            rgba(0, 0, 0, 0.08);
        }

        .card h3 {
          margin-top: 0;
          color: #111827;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .editBtn {
          flex: 1;
          background: #f59e0b;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .deleteBtn {
          flex: 1;
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .header h1 {
            font-size: 24px;
          }

          .form {
            flex-direction: column;
          }

          .form button {
            width: 100%;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .editBtn,
          .deleteBtn {
            width: 100%;
          }
        }
      `}</style>
        </>
    );
}

