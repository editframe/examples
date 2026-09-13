import React from 'react';
import {Timegroup} from '@editframe/react';
import {Alchemist,PhilosopherCode} from '../PhilosopherArtwork';
import {Seal} from '../Seal';
import {PhilosopherRing} from '../PhilosopherRing';

import '../philosopher-motion.css';
const rare='INTO SOMETHING THAT WAS VERY RARE.';
const left=['THERE','WAS','THIS','THING','CALLED','THE','PHILOSOPHER’S','STONE'];
const right=['THAT','HE','KEPT','TRYING','TO','DISCOVER'];
function Letters({text,prefix}:{text:string;prefix:string}){let j=0;return <>{text.split('').map((c,i)=>c===' '?<span key={i}> </span>:<span key={i} className={`${prefix}-${j++} timed-letter`}>{c}</span>)}</>}
export function PhilosopherScene(){return <Timegroup mode="fixed" duration="4.633333333s" className="scene philosopher-scene">
 <div className="rare-camera"><div className="rare-copy"><Letters text={rare} prefix="rare"/></div></div>
 <div className="left-headline">{left.map((line,i)=><div className={`left-line left-line-${i}`} key={line}><Letters text={line} prefix={`left-${i}`}/></div>)}</div>
 <div className="code-camera"><PhilosopherCode/></div>
 <div className="alchemist-camera"><Alchemist/></div>
 <div className="stone-geometry"><svg width="300" height="300" viewBox="-100 -100 200 200"><g filter="url(#code-grain)" fill="none" stroke="black" strokeWidth="1.4"><path className="stone-circle" pathLength="1" strokeDasharray="1" d="M36 -36A51 51 0 1 1 -36 -36A51 51 0 0 1 36 -36"/><path className="stone-triangle" pathLength="1" strokeDasharray="1" d="M0 -50L44 26H-44L0 -50"/><path className="stone-inner" pathLength="1" strokeDasharray="1" d="M-21 26V-3Q-21 -16 -8 -16H8Q21 -16 21 -3V26Z"/></g></svg></div>
 {[0,20,14,20,0,13,14,15].map((kind,i)=><div className={`philosopher-ring philosopher-ring-${i}`} key={i}>{[1,3,4,5].includes(i)?<PhilosopherRing variant={i===1?"dust":i===5?"star":i===4?"heavy":"snake"} id={`philosopher-vector-${i}`}/>:<Seal kind={kind} id={`philosopher-seal-${i}`}/>}</div>)}
 <div className="right-headline-camera"><div className="right-headline">{right.map((line,i)=><div key={line}><Letters text={line} prefix={`right-${i}`}/></div>)}</div></div>
 <div className="imagine-bridge"><Letters text="IMAGINE A FORM OF ALCHEMY" prefix="imagine"/></div>
 </Timegroup>}

