import React from 'react';

export function PhilosopherRing({variant,id}:{variant:'dust'|'snake'|'heavy'|'star',id:string}){
 const thin=variant==='snake'||variant==='dust';
 return <svg viewBox="0 0 600 600" width="100%" height="100%" overflow="visible"><defs><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency={thin?'.12':'.24'} numOctaves="3" seed="37" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={thin?9:6} result="rough"/><feColorMatrix in="noise" type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 18 ${thin?-5.5:-2.9}`} result="ink"/><feComposite in="rough" in2="ink" operator="in"/></filter></defs><g filter={`url(#${id})`}>
 <g transform="translate(309 300) scale(.95 .94) translate(-309 -300)"><path d="M88 102C143 23 236 0 321 12C423 20 514 91 559 183C603 273 593 369 546 451C486 555 380 601 263 583C146 566 58 487 27 388C0 302 13 216 48 153" stroke="#000" strokeWidth={thin?35:variant==='heavy'?35:25} fill="none"/>
 {!thin&&<path d="M45 166C10 274 22 363 57 433C108 535 196 577 279 582C341 586 389 575 434 553L454 568C383 603 301 608 231 590C118 565 38 480 15 391C-3 315 0 252 23 198Z" fill="#000"/>}
 <g transform="translate(76 90) scale(1.3 1.08) translate(-76 -120)"><path d="M46 158L31 142L38 117L45 90L62 69L68 75L86 63L90 82L109 79L112 67L126 80L120 101L108 112L99 122L89 147L71 155L62 173L52 174L58 154Z M53 144L64 114L82 100L87 116L74 129L67 147Z" fill="#000" fillRule="evenodd"/>
 <path d="M69 128L83 111L92 98M50 151L59 146" stroke="#fff" strokeWidth="7" fill="none"/></g></g>
 {variant==='dust'&&<g fill="black">{Array.from({length:39},(_,i)=>{const a=Math.PI*1.08+i/38*Math.PI*.76;const r=309+Math.sin(i*2.91)**2*22;return <circle key={i} cx={309+Math.cos(a)*r} cy={300+Math.sin(a)*r} r={1.7+Math.sin(i*4.17)**2*4}/>})}</g>}
 {variant==='heavy'&&<g fill="#000"><path d="M194 212L203 206L210 219L204 227L194 222Z M172 254L185 248L189 257L180 266L172 263Z M420 291L425 285L432 291L427 300Z M372 441L375 429L380 442L393 449L388 457L377 450Z M332 474L337 471L344 481L340 487L333 482Z"/><path d="M159 291L151 287L145 292M273 362L279 366M375 223L382 228" stroke="#000" strokeWidth="3"/></g>}
 {variant==='star'&&<g transform="translate(309 300)"><path d="M0 -101L12 -27L77 -76L30 -13L103 0L28 12L77 76L13 31L0 101L-14 31L-77 76L-30 14L-102 0L-29 -13L-75 -76L-14 -28Z" fill="#000"/><circle r="17" fill="#fff"/></g>}
 </g></svg>;
}
