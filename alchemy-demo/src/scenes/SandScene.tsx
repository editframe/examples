import React from 'react';
import {Timegroup} from '@editframe/react';
import {Alchemist,PhilosopherCode} from '../PhilosopherArtwork';
import {Network} from '../Network';
import '../sand-motion.css';
export function TimedLetters({text,prefix}:{text:string;prefix:string}){let j=0;return <>{text.split('').map((c,i)=>c===' '?<span key={i}> </span>:<span className={`timed-letter ${prefix}-${j++}`} key={i}>{c}</span>)}</>}
export function ThoughtCopy(){return <div className="thought-camera"><div className="thought-copy"><div><TimedLetters text="INTO" prefix="thought-0"/></div><div><TimedLetters text="THOUGHT" prefix="thought-1"/></div></div></div>}
export function AICopy(){return <div className="ai-camera"><div className="ai-copy"><svg aria-label="A" width="184" height="260" style={{display:"inline-block",verticalAlign:"top",overflow:"visible"}}><path d="M0 224L72 34H114L185 224H142L128 182H57L42 224Z M93 80L68 150H116Z" fill="#000" fillRule="evenodd"/></svg><span className="ai-i">I</span></div></div>}
export function SandScene(){return <Timegroup mode="fixed" duration="4.033333333s" className="scene sand-scene">
 <div className="outgoing-code"><PhilosopherCode idPrefix="sand-code"/></div><div className="outgoing-alchemist"><Alchemist/></div>
 <div className="particles">{Array.from({length:169},(_,i)=><div className={`sand-particle sand-particle-${i}`} key={i}/>)}</div>
 <div className="sand-camera"><div className="sand-copy"><div><TimedLetters text="IMAGINE A FORM OF ALCHEMY" prefix="sand-0"/></div><div><TimedLetters text="THAT TURNS SAND..." prefix="sand-1"/></div></div></div>
 <ThoughtCopy/><Network/><AICopy/>
 </Timegroup>}
