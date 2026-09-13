import React from 'react';
export const philosopherCode=[
"# THE PHILOSOPHER'S ENGINE V1.0",
"# SEEK ETERNAL TRUTH THROUGH NUMERICAL TRANSMUTATION",
"",
"CLASS ELIXIROFLIFE:",
"    DEF __INIT__(SELF):",
"        SELF.ITERATIONS = FLOAT('INF')",
"        SELF.CONSCIOUSNESS = 0",
"        SELF.GOLD_RATIO = 1.618033988749",
"",
"    DEF PHILOSOPHERS_STONE(SELF, CONSCIOUSNESS_LEVEL):",
"        WHILE CONSCIOUSNESS_LEVEL < 42:",
"            CONSCIOUSNESS_LEVEL *= SELF.GOLD_RATIO",
"            YIELD SELF.TRANSMUTE(CONSCIOUSNESS_LEVEL)",
"",
"    DEF TRANSMUTE(SELF, NUMBER):",
"        # CONVERT BASE METAL (INTEGERS) INTO PURE ESSENCE",
"        ESSENCE = NUMBER ** NUMBER",
'        RETURN ESSENCE IF ESSENCE != ESSENCE ELSE "PARADOX"',
];
export {Alchemist} from './AlchemistArtwork';
export function PhilosopherCode({idPrefix="philosopher"}:{idPrefix?:string}){return <svg width="1920" height="1080" viewBox="0 0 1920 1080" overflow="visible"><defs>{philosopherCode.flatMap((_,i)=>[false,true].map(black=><clipPath id={`${idPrefix}-clip-${i}-${black}`} key={`${i}-${black}`}><rect x="0" y="0" width="1920" height="1080" style={{width:1920,height:1080}} className={`code-clip-${black?"black":"gray"}-${i}`}/></clipPath>))}<filter id="code-grain" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".46" numOctaves="3" seed="83" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="8" result="rough"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 -8.5" result="ink"/><feComposite in="rough" in2="ink" operator="in"/></filter><filter id="code-fine" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="83" result="fine"/><feDisplacementMap in="SourceGraphic" in2="fine" scale=".05" result="edge"/><feColorMatrix in="fine" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 -3.0" result="paper"/><feComposite in="edge" in2="paper" operator="in"/></filter></defs>
 {[false,true].map(clear=><g key={String(clear)} className={clear?'code-clear':'code-printed'} filter={clear?'url(#code-fine)':'url(#code-grain)'} transform="translate(18 0) scale(1.16 1) translate(-18 0)" fontFamily="Nimbus Sans" fontWeight="700" fontSize="24" fill="#000">{philosopherCode.flatMap((line,i)=>[false,true].map(black=><text key={`${i}-${black}`} x="18" y={41+i*34} xmlSpace="preserve" style={{whiteSpace:'pre'}} fill={black?"#000":"#999"} clipPath={`url(#${idPrefix}-clip-${i}-${black})`} className={`code-row code-row-${i}`}>{clear?line.split('').map((c,k)=>c==='_'?<tspan key={k} fill="#b8b8b8">_</tspan>:c):line}</text>))}</g>)}</svg>}
