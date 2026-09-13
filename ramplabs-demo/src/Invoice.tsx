import React from "react";

const cards = [
  [190,350,.53,-4,0.45,"1.1M","2","$18.42"],
  [510,338,.50,3.3,1.10,"2.8M","4","$42.16"],
  [1410,342,.51,-2.5,1.55,"482K","1","$7.63"],
  [1730,360,.485,4.5,1.95,"1.7M","3","$26.04"],
  [230,605,.475,2.8,2.20,"336K","1","$5.22"],
  [520,790,.485,-4.9,2.50,"4.6M","6","$71.31"],
  [1400,793,.475,3.1,2.70,"965K","2","$14.90"],
  [1710,610,.50,-3.5,2.85,"2.2M","4","$33.48"],
  [90,820,.42,-5,2.95,"527K","1","$8.19"],
  [1840,820,.45,5,3.12,"1.4M","2","$21.76"],
  [700,846,.40,-3,3.20,"3.5M","5","$54.22"],
  [1228,850,.40,4,3.42,"391K","1","$6.07"],
] as const;

function Paper({tokens="5.6M", sessions="8", spend="$93.00"}) {
  return <div className="invoice-paper">
    <div className="invoice-header"><b>AI USAGE / INTERNAL AGENT</b><span className="stamp" /></div>
    {[["MODEL USAGE","METERED"],["TOKENS",tokens],["LINKED SESSIONS",sessions],["MODEL-CALL SPEND",spend],["WORK COMPLETED","AI SPEND"]].map(([label,value]) =>
      <div className="invoice-row" key={label}><span>{label}</span><b>{value}</b></div>)}
  </div>;
}

export function Invoice({tail=false}:{tail?:boolean}) {
  return <div className={`invoice-collage ${tail ? "invoice-tail" : ""}`}>
    {cards.map(([x,y,scale,rotate,delay,tokens,sessions,spend],i) => <div key={i} className={`card-motion card-motion-${i}`}><div className="invoice-position" style={{left:x,top:y,transform:`rotate(${rotate}deg) scale(${scale})`}}>
      <Paper tokens={tokens} sessions={sessions} spend={spend}/>
    </div></div>)}
    <div className="card-motion card-motion-12"><div className="invoice-position invoice-center" style={{left:960,top:540}}><Paper/></div></div>
  </div>;
}
