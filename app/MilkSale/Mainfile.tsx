"use client";

import React from "react";
import Topnavbar from "./Topnavbar";
import SalesTable from "./SalesTable";
import Salegraph from "./Salegraph";


export default function Mainfile() {
 

  return (
    <div>
         <Topnavbar  
      />
      <SalesTable  
      />
      <Salegraph  
      />
  
    </div>
  );
}