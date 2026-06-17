"use client";

import { useState } from "react";
import Navmilk from "./Navmilk";
import Fetchmilk from "./Fetchmilk";

export default function MilkPage() {
    const [search, setSearch] = useState("");

    return (
        <>
            <Navmilk search={search} setSearch={setSearch} />
            <Fetchmilk search={search} />
           
        </>
    );
}