"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback  } from "react";
type Category = {
    _id: string;
    name: string;
};

export default function Topnavbar() {
   
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableMilk, setAvailableMilk] = useState(0);

    const [form, setForm] = useState({
        category: "",
        name: "",
        type: "",
        milkType: "",
        quantity: 1,
        pricePerKg: "",
        date: "",
    });

    type MilkStock = {
    _id: string;
    quantity: number;
    milkType: string;
    category:
        | string
        | {
              _id: string;
              name?: string;
          };
};

    const [,setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data));
    }, []);

const refreshStock = useCallback(async () => {
    if (!form.category || !form.type) return;

    const res = await fetch("http://localhost:5000/api/milk");
    const result = await res.json();

    const data: MilkStock[] = Array.isArray(result) ? result : result.data;

    const stock = data.find((i: MilkStock) => {
        const catId =
            typeof i.category === "object" ? i.category._id : i.category;

        return (
            String(catId) === String(form.category) &&
            i.milkType?.toLowerCase() === form.type?.toLowerCase()
        );
    });

    setAvailableMilk(stock ? Number(stock.quantity) : 0);
}, [form.category, form.type]);

useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshStock();
}, [refreshStock]);

    const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const totalPrice = form.pricePerKg
        ? form.quantity * Number(form.pricePerKg)
        : 0;

    const increaseQty = () => {
        if (form.quantity >= availableMilk) {
            alert(`Only ${availableMilk} KG available`);
            return;
        }
        setForm({ ...form, quantity: form.quantity + 1 });
    };

    const decreaseQty = () => {
        if (form.quantity > 1) {
            setForm({ ...form, quantity: form.quantity - 1 });
        }
    };
    /*
        const handleSaveSale = async () => {
            const payload = {
                category: form.category,
                name: form.name,
                milkType: form.type,
                quantity: form.quantity,
                pricePerKg: Number(form.pricePerKg),
                totalPrice,
                date: form.date,
                time,
            };
    
            const res = await fetch("http://localhost:5000/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                alert(result.error || "Failed to save sale");
                return;
            }
    
            await refreshStock();
    
            alert("Sale Added!");
    
            setForm({
                category: "",
                name: "",
                type: "",
                milkType: "",
                quantity: 1,
                pricePerKg: "",
                date: "",
            });
    
            setOpen(false);
        };
    */

    const handleSaveSale = async () => {
        // 1️⃣ Basic validation
        if (!form.category || !form.type || !form.name || !form.pricePerKg) {
            alert("Please fill all required fields");
            return;
        }

        // 2️⃣ Stock check (IMPORTANT)
        if (availableMilk <= 0) {
            alert("❌ This milk type is out of stock");
            return;
        }

        // 3️⃣ Quantity validation
        if (form.quantity > availableMilk) {
            alert(`❌ Only ${availableMilk} KG available`);
            return;
        }

        // 4️⃣ Final payload
        const payload = {
            category: form.category,
            name: form.name,
            milkType: form.type,
            quantity: form.quantity,
            pricePerKg: Number(form.pricePerKg),
            totalPrice,
            date: form.date,
            time,
        };

        try {
            const res = await fetch("http://localhost:5000/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || "Failed to save sale");
                return;
            }

            // 5️⃣ Refresh stock after sale
            await refreshStock();

            alert("✅ Sale Added Successfully!");

            // 6️⃣ Reset form
            setForm({
                category: "",
                name: "",
                type: "",
                milkType: "",
                quantity: 1,
                pricePerKg: "",
                date: "",
            });

            setOpen(false);
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };


  const router = useRouter();

  const handleButton = () => {
    router.push("/Salegraph");
  };
    return (
        <>
            {/* TOP BAR */}
            <div className="navbar">
                

                <button className="addBtn" onClick={() => setOpen(true)}>
                    + Add Sale
                </button>
                 <button className="addBtn" onClick={handleButton}>
              Go to Sale Graph
             </button>
            </div>

            {/* MODAL */}
            {open && (
                <div className="overlay" onClick={() => setOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="title">🧾 Add New Sale</h2>

                        <div className="grid">
                            <input
                                placeholder="Customer Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />

                            <select
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
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

                            <select
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        type: e.target.value,
                                        milkType: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Type</option>
                                <option>Cow</option>
                                <option>Buffalo</option>
                                <option>Goat</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Price per KG"
                                value={form.pricePerKg}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pricePerKg: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                    setForm({ ...form, date: e.target.value })
                                }
                            />
                        </div>

                        {/* STOCK INFO */}
                        <div className="stockBox">
                            🥛 Available Stock:{" "}
                            <b>{availableMilk} KG</b>
                        </div>

                        {/* QUANTITY */}
                        <div className="qtyBox">
                            <button onClick={decreaseQty}>−</button>
                            <span>{form.quantity}</span>
                            <button onClick={increaseQty}>+</button>
                        </div>

                        {/* TOTAL */}
                        <div className="total">
                            💰 Total: <b>{totalPrice}</b>
                        </div>

                        {/* ACTIONS */}
                        <div className="actions">
                            <button
                                className="save"
                                onClick={handleSaveSale}
                                disabled={availableMilk <= 0}
                            >
                                Save
                            </button>

                            <button
                                className="close"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STYLES */}
            <style jsx>{`
              .navbar {
             
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;

    background: #ffffff;
    border-bottom: 1px solid #eee;
  
border-radius : 20px;
    position: sticky;
    top: 0;
    z-index: 10;
}
                .search {
                    width: 50%;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    outline: none;
                }

                .addBtn {
                    background: #16a34a;
                    color: white;
                    border: none;
                    padding: 10px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;

    /* 👇 IMPORTANT: blur effect */
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);

    /* 👇 ensure it's above everything */
    z-index: 999;
}

.modal {
    background: white;
    width: 420px;
    max-width: 100%;
    padding: 20px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    /* 👇 ensure above overlay blur layer */
    z-index: 1000;
       margin-top: 75px;
  
}

                .title {
                    margin-bottom: 15px;
                }

                .grid {
                    display: grid;
                    gap: 10px;
                }

                input,
                select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    outline: none;
                }

                .stockBox {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f0fdf4;
                    border-radius: 8px;
                }

                .qtyBox {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    margin: 15px 0;
                }

                .qtyBox button {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    border: none;
                    background: #eee;
                    font-size: 18px;
                    cursor: pointer;
                }

                .total {
                    text-align: center;
                    margin-bottom: 15px;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                }

                .save {
                    flex: 1;
                    background: #16a34a;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                }

                .close {
                    flex: 1;
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                }
            `}</style>
        </>
    );
}