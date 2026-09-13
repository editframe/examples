import React from "react";

const spend = "M625 786 L679 771 L733 757 L787 697 L842 691 L896 682 L950 601 L1004 589 L1058 584 L1113 537 L1167 528 L1221 502 L1266 497";
const traces = [
  {name:"root cause analysis",color:"#10b981",x:552,y:786,delay:1.583333,d:"M0 0 C36 13 58 -22 83 -18 S133 23 151 24 S183 17 205 10 S233 15 256 7 S287 1 306 10 S334 26 355 23"},
  {name:"feature work",color:"#4f46e5",x:668,y:705,delay:1.966667,d:"M0 0 C33 1 42 -7 66 5 S103 38 129 26 S164 -26 195 -18 S232 44 260 41 S309 8 355 22"},
  {name:"run creation fix",color:"#3b82f6",x:784,y:625,delay:2.35,d:"M0 0 C36 0 52 26 80 20 S119 -13 145 -3 S186 28 208 25 S248 11 264 -4 S292 0 307 11 S335 25 355 22"},
  {name:"code review",color:"#f87171",x:899,y:544,delay:2.733333,d:"M0 0 C21 4 33 -4 52 7 S82 19 103 0 S133 -20 150 5 S179 49 203 20 S228 -17 253 0 S280 27 305 18 S332 12 355 22"},
  {name:"frontend update",color:"#ec4899",x:1015,y:463,delay:3.116667,d:"M0 0 C29 -1 40 24 59 18 S80 -22 101 -6 S129 51 150 15 S174 -52 196 -17 S221 37 245 17 S270 9 288 21 S313 20 330 17 S345 18 355 22"},
];
export function Chart({separated=false}:{separated?:boolean}) {
  return <svg className={`chart ${separated?"separated":"spending"}`} width="1920" height="1080" viewBox="0 0 1920 1080">
    <g className="chart-plane">
      <path d="M607 486 V800 H1294" fill="none" stroke="#d4d4d8" strokeWidth="2" className="chart-axes"/>
      <g className="chart-grid" fill="none" stroke="#ececee" strokeWidth="1.5">
        <path d="M607 486 H1294 V800" stroke="#d4d4d8" strokeWidth="2"/>
        <path d="M607 564.5 H1294 M607 643 H1294 M607 721.5 H1294"/>
        {[1,2,3,4,5].map(n=><path key={n} d={`M${607+n*114.5} 486 V800`}/>)}
      </g>
    </g>
    <text className="chart-title" x={separated?0:914} y={separated?0:410}>AI Spend</text>
    {separated && traces.map((t,i)=><g key={t.name}>
      <path d={t.d} fill="none" stroke={["#76d4b5","#8199eb","#8ab4fc","#f99296","#f396c0"][i]} strokeWidth="5.5" strokeLinecap="round" className={`trace-path-${i}`}/>
      <text x="0" y="0" fill={t.color} transform={`matrix(1 .21 0 1 ${t.x+378} ${t.y+33})`} className={`work-label trace-label-${i}`} style={{animationDelay:`${t.delay+.5}s`}}>{t.name}</text>
    </g>)}
    <path className="spend-line" d={spend} fill="none" stroke="#111111" strokeWidth={separated?7:4} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
