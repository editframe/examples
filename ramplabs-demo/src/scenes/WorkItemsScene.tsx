import React from "react";
import { Timegroup } from "@editframe/react";
import { Headline } from "../Headline";
import { duration, FRAMES } from "../timing";
const rows = [
  {label:"ROOT CAUSE ANALYSIS", title:"Found a race condition in the backend", type:"Root Cause Analysis & Investigation", area:"Backend API & Services", width:202},
  {label:"RUN CREATION FIX", title:"Prevented duplicate jobs", type:"Bug Fixing & Remediation", area:"Backend API & Services", width:173},
  {label:"FRONTEND UPDATE", title:"Moved the frontend to the new API", type:"Feature Implementation & Enhancements", area:"Web Frontend & React UI", width:163},
];
export function WorkItemsScene() {
 return <Timegroup mode="fixed" duration={duration(FRAMES.workItems)} className="scene workitems-scene">
  <Headline className="workitems-copy" lines={["The system described each", "work item and categorized it by", "work type, product area, and", "technical area."]}/>
  <div className="workitems-table">
   <div className="table-heading"><span>WORK ITEM</span><span>DESCRIPTION / SHARED CATEGORY</span></div>
   {rows.map((row,i)=><div className={`table-row row-${i}`} key={row.label} style={{top:291+i*178}}>
    <div className="workitem-label">{row.label}
     <svg className={`label-box label-box-${i}`} width={row.width+8} height="36" viewBox={`0 0 ${row.width+8} 36`}>
      <path pathLength="1" d={`M4 5 L${row.width*.3} 4 L${row.width*.58} 6 L${row.width-2} 4 L${row.width+1} 17 L${row.width-1} 28 L${row.width*.63} 27 L${row.width*.28} 29 L3 28 L2 17 L5 6`} />
     </svg>
    </div>
    <div className="workitem-description"><b>{row.title}</b><div>{row.type}<br/>BANKING, TREASURY &amp; UNDERWRITING · {row.area}</div></div>
   </div>)}
  </div>
 </Timegroup>;
}
