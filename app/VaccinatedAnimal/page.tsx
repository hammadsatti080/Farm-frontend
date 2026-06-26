"use client";

import { useEffect, useState } from "react";
import "./AddVaccination.css";
import { useRouter } from "next/navigation";


interface Animal {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
}

interface VaccineCategory {
  _id: string;
  animalCategory: {
    name: string;
  };
  vaccines: { name: string }[];
}

export default function Page() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<VaccineCategory[]>([]);

  const [form, setForm] = useState({
    animalId: "",
    vaccineName: "",
    doctorId: "",
    dateGiven: "",
    nextDueDate: "",
    notes: "",
  });

  // ================= FETCH SAFE =================
  useEffect(() => {
    const load = async () => {
      try {
        const animalsRes = await fetch(
          "https://farm-backend-lac.vercel.app/api/Handleanimals"
        );
        const doctorsRes = await fetch(
          "https://farm-backend-lac.vercel.app/api/handleteam"
        );
        const vaccineRes = await fetch(
          "https://farm-backend-lac.vercel.app/api/vaccine-category"
        );

        const animalsData = await animalsRes.json();
        const doctorsData = await doctorsRes.json();
        const vaccineData = await vaccineRes.json();

        setAnimals(
          Array.isArray(animalsData)
            ? animalsData
            : animalsData.data || []
        );

        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : doctorsData.data || []
        );

        setCategories(
          Array.isArray(vaccineData)
            ? vaccineData
            : vaccineData.data || []
        );
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    load();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      await fetch("https://farm-backend-lac.vercel.app/api/vaccination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Vaccination Added Successfully");

      setForm({
        animalId: "",
        vaccineName: "",
        doctorId: "",
        dateGiven: "",
        nextDueDate: "",
        notes: "",
      });
    } catch (err) {
      console.log(err);
      alert("Error saving vaccination");
    }
  };

const router = useRouter();
const handlego=()=>{
  router.back();
}

  return (
    <div className="container">
      <h2 className="title">💉 Add Vaccination</h2>

      {/* ANIMAL */}
      <select
        className="select"
        value={form.animalId}
        onChange={(e) =>
          setForm({ ...form, animalId: e.target.value })
        }
      >
        <option value="">Select Animal</option>
        {animals.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* VACCINE */}
      <select
        className="select"
        value={form.vaccineName}
        onChange={(e) =>
          setForm({ ...form, vaccineName: e.target.value })
        }
      >
        <option value="">Select Vaccine</option>

        {categories.map((cat) =>
          cat.vaccines?.map((v, i) => (
            <option key={i} value={v.name}>
              {cat.animalCategory?.name} → {v.name}
            </option>
          ))
        )}
      </select>

      {/* DOCTOR */}
      <select
        className="select"
        value={form.doctorId}
        onChange={(e) =>
          setForm({ ...form, doctorId: e.target.value })
        }
      >
        <option value="">Select Doctor</option>
        {doctors.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* DATE GIVEN */}
      <input
        type="date"
        className="input"
        value={form.dateGiven}
        onChange={(e) =>
          setForm({ ...form, dateGiven: e.target.value })
        }
      />

      {/* NEXT DUE */}
      <input
        type="date"
        className="input"
        value={form.nextDueDate}
        onChange={(e) =>
          setForm({ ...form, nextDueDate: e.target.value })
        }
      />

      {/* NOTES */}
      <textarea
        className="textarea"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) =>
          setForm({ ...form, notes: e.target.value })
        }
      />

      {/* SAVE */}
      <button className="btn" onClick={handleSubmit}>
        Save Vaccination
      </button>
      <button className="btn" style={{backgroundColor:"green"}} onClick={handlego}>
        Go back
      </button>
     
     
    </div>
  );
}