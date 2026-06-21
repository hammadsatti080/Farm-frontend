"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SalesDashboard.module.css";

type Category = {
  _id: string;
  name: string;
};

type Sale = {
  _id: string;
  totalPrice: number;
  category?: string | Category;
};
export default function SalesDashboard() {
const [sales, setSales] = useState<Sale[]>([]);
const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [salesRes, catRes] = await Promise.all([
        fetch("https://farm-backend-lac.vercel.app/api/sales"),
        fetch("https://farm-backend-lac.vercel.app/api/categories"),
      ]);

      const salesData = await salesRes.json();
      const catData = await catRes.json();

      setSales(Array.isArray(salesData) ? salesData : salesData.data || []);
      setCategories(Array.isArray(catData) ? catData : []);
    };

    fetchData();
  }, []);

  const totalRevenue = useMemo(
    () => sales.reduce((sum, s) => sum + Number(s.totalPrice || 0), 0),
    [sales]
  );

  const categoryMap = useMemo<Record<string, number>>(() => {
  const map: Record<string, number> = {};

  sales.forEach((s) => {
    const name =
      typeof s.category === "object"
        ? s.category?.name
        : categories.find((c) => c._id === s.category)?.name || "Unknown";

    map[name] = (map[name] || 0) + 1;
  });

  return map;
}, [sales, categories]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>📊 Sales Dashboard</h1>

      <div className={styles.cardGrid}>
        <div className={`${styles.card} ${styles.revenue}`}>
          <h3 className={styles.title}>💰 Revenue</h3>
          <h2 className={styles.value}>
            {totalRevenue.toLocaleString()} RS
          </h2>
          <p className={styles.subText}>Total earnings</p>
        </div>

        <div className={`${styles.card} ${styles.sales}`}>
          <h3 className={styles.title}>📦 Sales</h3>
          <h2 className={styles.value}>{sales.length}</h2>
          <p className={styles.subText}>Total transactions</p>
        </div>

        <div className={`${styles.card} ${styles.category}`}>
          <h3 className={styles.titleDark}>🏷 Categories</h3>

          <div>
            {Object.entries(categoryMap).map(([name, count]) => (
              <div key={name} className={styles.categoryRow}>
                <span>{name}</span>
                <span className={styles.badge}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}