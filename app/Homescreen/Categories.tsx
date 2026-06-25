"use client";

import React, { useEffect, useState } from "react";
import {
    Wheat,
    Milk,
    Leaf,
    LeafyGreen,
    Tractor,
    Carrot,
    Sprout,
    Bird,
    PawPrint,
    Fish,
    Drumstick,
    Egg,
    Beef,
    Flower2,
    Warehouse,
    TreeDeciduous,
    HandHeart,
    HeartPulse,
    Palette,
    Briefcase,
    Coins,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import "./TopCategories.css";

interface CategoryItem {
    _id: string;
    name: string;
    createdAt?: string;
}

const ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
    { keywords: ["crop", "wheat", "grain", "harvest"], icon: Wheat },
    { keywords: ["dairy", "milk"], icon: Milk },
    { keywords: ["organic", "vegetable", "veg"], icon: LeafyGreen },
    { keywords: ["equipment", "tractor", "machine"], icon: Tractor },
    { keywords: ["carrot", "root"], icon: Carrot },
    { keywords: ["seed", "sprout", "plant", "nursery"], icon: Sprout },
    { keywords: ["poultry", "chicken", "bird", "hen"], icon: Bird },
    { keywords: ["cattle", "cow", "livestock", "beef"], icon: Beef },
    { keywords: ["goat", "sheep", "wool", "paw", "pet"], icon: PawPrint },
    { keywords: ["fish", "aqua", "pond"], icon: Fish },
    { keywords: ["meat", "drumstick"], icon: Drumstick },
    { keywords: ["egg"], icon: Egg },
    { keywords: ["flower", "bloom", "garden"], icon: Flower2 },
    { keywords: ["storage", "warehouse", "barn"], icon: Warehouse },
    { keywords: ["tree", "orchard", "fruit"], icon: TreeDeciduous },
    { keywords: ["wellness", "health", "care"], icon: HeartPulse },
    { keywords: ["design", "craft", "art"], icon: Palette },
    { keywords: ["business", "management"], icon: Briefcase },
    { keywords: ["finance", "account", "money"], icon: Coins },
    { keywords: ["personal", "development"], icon: HandHeart },
    { keywords: ["leaf", "green", "eco"], icon: Leaf },
];

function getIconElement(name: string) {
    const lower = name.toLowerCase();

    for (const rule of ICON_RULES) {
        if (rule.keywords.some((kw) => lower.includes(kw))) {
            const IconComponent = rule.icon;

            return (
                <IconComponent
                    size={28}
                    strokeWidth={2}
                />
            );
        }
    }

    return (
        <Sparkles
            size={28}
            strokeWidth={2}
        />
    );
}

function CategoryCard({
    name,
    accent,
}: {
    name: string;
    accent: number;
}) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className={`cat-card accent-${accent} ${
                flipped ? "is-flipped" : ""
            }`}
            onClick={() => setFlipped((f) => !f)}
        >
            <div className="cat-card-inner">
                <div className="cat-card-face cat-card-front">
                    <div className="cat-icon">
                        {getIconElement(name)}
                    </div>

                    <h4>{name}</h4>
                </div>

                <div className="cat-card-face cat-card-back">
                    <span className="cat-back-label">
                        Category
                    </span>

                    <h4>{name}</h4>
                </div>
            </div>
        </div>
    );
}

export default function Categories() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [animalCategories, setAnimalCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const [catRes, animalRes] = await Promise.all([
                    fetch("https://farm-backend-lac.vercel.app/api/categories"),
                    fetch("https://farm-backend-lac.vercel.app/api/animalcategories"),
                ]);

                const [catData, animalData] = await Promise.all([
                    catRes.json(),
                    animalRes.json(),
                ]);

                setCategories(Array.isArray(catData) ? catData : []);
                setAnimalCategories(
                    Array.isArray(animalData) ? animalData : []
                );
            } catch (err) {
                console.error(err);
                setError(
                    "Couldn't load categories. Please try again shortly."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return (
        <section className="categories-section">
            <div className="cat-header">
                <span className="eyebrow">Explore</span>
                <h2>Categories</h2>
                <p className="cat-intro">
                    Browse what we grow, raise, and care for —
                    organized for quick discovery.
                </p>
            </div>

            {loading && (
                <p className="cat-status">
                    Loading categories...
                </p>
            )}

            {!loading && error && (
                <p className="cat-status error">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <>
                    <div className="cat-row">
                        <h3 className="cat-row-title">
                            <span className="cat-row-dot" />
                             Dairy Products
                        </h3>

                        {categories.length === 0 ? (
                            <p className="cat-status">
                                No categories yet.
                            </p>
                        ) : (
                            <div className="cat-grid">
                                {categories.map((cat, i) => (
                                    <CategoryCard
                                        key={cat._id}
                                        name={cat.name}
                                        accent={(i % 4) + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="cat-row">
                        <h3 className="cat-row-title">
                            <span className="cat-row-dot" />
                            Animal Categories
                        </h3>

                        {animalCategories.length === 0 ? (
                            <p className="cat-status">
                                No animal categories yet.
                            </p>
                        ) : (
                            <div className="cat-grid">
                                {animalCategories.map((cat, i) => (
                                    <CategoryCard
                                        key={cat._id}
                                        name={cat.name}
                                        accent={(i % 4) + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}