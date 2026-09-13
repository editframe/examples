import React from 'react';

function Star({x,y,r=4}:{x:number;y:number;r?:number}){return <path transform={`translate(${x} ${y}) scale(${r/5})`} d="M-.6 -6L1 -2.5L4.8 -4.5L3 0L7 1L2.8 2.2L3 5.8L.4 3.1L-2 6L-2.1 2.7L-6 3L-3.2 .5L-5 -2.7L-1.5 -1.8Z" fill="black"/>}
function Orb({x,y,moon=false}:{x:number;y:number;moon?:boolean}){return <g transform={`translate(${x} ${y})`}>
 <g fill="none" stroke="black" strokeWidth=".23">{Array.from({length:93},(_,i)=>{const a=i*Math.PI*2/93+.026*Math.sin(i*7.1);const r=19+Math.sin(i*2.71)**2*7;return <path key={i} d={`M${Math.cos(a)*10.6} ${Math.sin(a)*10.6}Q${Math.cos(a+.01)*16} ${Math.sin(a+.01)*16} ${Math.cos(a+.014*Math.sin(i))*r} ${Math.sin(a+.014*Math.sin(i))*r}`} strokeWidth={i%7===0?.55:.17+Math.sin(i*4)**2*.22}/>})}</g>
 <path d={moon?'M-11 -2C-10 -11 -2 -13 5 -10C14 -7 15 4 7 11C-2 16 -14 8 -11 -2Z':'M-11 -4C-8 -12 2 -13 9 -8C15 -1 11 10 3 12C-8 13 -14 5 -11 -4Z'} fill="white" stroke="black" strokeWidth=".6"/>
 {moon?<><path d="M3 -11C9 -7 10 1 4 6C-2 11 -10 8 -11 2M-8 -5l2 -2l2 1l-2 2ZM-5 -1l2 1l-1 2l-2 -1ZM-7 3l3 1l-2 2l-2 -1Z" fill="none" stroke="black" strokeWidth=".8"/><path d="M-7 -6l2 -1M0 -6l1 3" stroke="black" strokeWidth="1.2"/></>:<><path d="M-8 -3q3 -2 5 -1M2 -4q3 -2 5 0M-2 -1l-1 3l3 1M-3 7q3 -1 5 0" fill="none" stroke="black" strokeWidth="1"/><path d="M-7 -2l3 -1M3 -3l2 1M-1 9h3" stroke="black" strokeWidth="1.2"/></>}
 </g>}
function ScriptMarks({x,y,width=20,rows=3}:{x:number;y:number;width?:number;rows?:number}){return <g transform={`translate(${x} ${y})`} stroke="black" fill="none" strokeWidth=".24">{Array.from({length:rows},(_,r)=><path key={r} d={`M0 ${r*2.5}q2 -3 1.3 0t2 0q1 -2 1.4 -1t2 .7q2 -4 2 -1t3 0q1 -3 2 -1t${width/4} 0`}/>)}</g>}
export function PlanetFigureArtwork(){return <g transform="translate(-775.375494 -539.011858) scale(1.027667984)">
 <defs><filter id="planet-primary-print" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="2.1" numOctaves="2" seed="43" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale=".45" result="rough"/><feColorMatrix in="grain" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 22 -3.5" result="ink"/><feComposite in="rough" in2="ink" operator="in"/></filter></defs>
 <g filter="url(#planet-primary-print)" strokeLinecap="round" strokeLinejoin="round">
 {/* Anatomy, its long leg contours remain pale and fine. */}
 <g stroke="black" fill="white" strokeWidth=".35">
  <path d="M747 432C744 428 747 424 751 424C753 421 757 422 759 424C763 421 769 424 770 430L769 440L764 449L764 456C769 459 776 460 779 465C783 474 780 485 782 497L784 514L781 519L775 517L773 494L771 486L769 510L775 526L771 534L773 552C774 563 769 575 768 582L766 599L762 619L761 624L767 628L768 631L762 633L755 631L754 627L756 620L754 609L749 596L745 585L742 572L740 559L741 540L738 531L733 524L735 514L741 502L738 485L734 477L727 484L722 489L716 484L710 474L705 460L703 449L704 444L707 443L710 448L713 461L720 476L725 472L733 464L747 459L753 457L754 449L749 444Z"/>
  <path d="M749 451L754 454M755 454L761 456M743 466q4 -3 8 0M758 466q4 1 7 -2M743 475q0 4 5 4M763 476q-1 4 -5 4M751 482l-1 6M750 493q3 2 7 0M743 533C746 548 743 558 748 571M755 533L757 552L759 573L757 583M768 542L769 559M758 584L762 591L760 607M749 585L755 593M756 620L759 624L758 630M761 624L762 629M744 570l2 6" fill="none"/>
  <path d="M704 444l-2 -4l1 -5l1 6M706 445l-1 -6l1 -4l1 7M708 448l-1 -6l2 -5l1 8M709 448l1 -4l2 -1" fill="none"/>
 </g>
 {/* Hair, facial planes and small tilted facial marks. */}
 <path d="M746 432L744 429L747 426L747 428L750 426L752 427L755 423L756 426L760 426L761 424L764 426L767 424L770 426L771 432L769 439L768 445L765 450L763 449L763 443L766 438L766 431L762 430L760 428L757 429L753 427L750 431Z" fill="black"/>
 <g fill="none" stroke="black" strokeWidth=".5"><path d="M745 426q-2 -4 3 -4M749 424q0 -4 4 -2M755 422q2 -3 4 0M761 423q3 -2 5 1M748 435l3 -1M757 433l4 1M753 437l-1 3l3 1M755 444l3 -.7M757 447l2 -.6M750 444l2 3M754 449l5 1"/><path d="M748 436l2 -.3M758 435h2" strokeWidth="1.8"/></g>
 <path d="M764 448L763 456L759 458L765 458L766 452Z M777 468L774 470L776 475L773 479L776 481L778 478L780 485L778 490L780 495L778 500L781 512L783 516L783 501L781 490L782 479Z M734 470L731 470L732 475L735 477L736 482L738 481L738 475Z" fill="black"/>
 <g fill="none" stroke="black" strokeWidth=".27">{Array.from({length:26},(_,i)=><path key={i} d={`M${776+Math.sin(i*3.2)*2} ${471+i*1.65}l${2+Math.sin(i)*2} ${2.8+Math.sin(i*2)}`}/>)}<path d="M776 482l-1 6M776 494l2 4M779 501l-2 6M733 471l2 6"/></g>
 {/* Dark central organ/flame and floral waist. */}
 <path d="M753 483C753 490 749 493 748 500C746 505 746 511 748 516C742 512 741 504 739 501C737 508 740 516 744 521C746 523 747 525 752 526C756 528 760 523 762 520C766 516 767 509 767 504L763 511L760 516L758 508C760 500 755 492 753 483Z" fill="black"/>
 <g stroke="white" strokeWidth=".48" fill="none"><path d="M752 489l-1 3l2 -1l-1 5l2 2l-3 3l3 2l-2 4l3 2l-1 5M747 498q-3 8 1 14M741 504l3 7M754 515l-1 7M760 517l2 -5"/><path d="M754 492L756 501L755 506L758 511L757 518L753 520L751 513L752 507Z" fill="white"/></g>
 <g stroke="black" fill="white" strokeWidth=".35">{Array.from({length:28},(_,i)=>{const x=732+(i%8)*5.1+Math.sin(i*2.2)*2,y=515+Math.floor(i/8)*4+Math.sin(i*3)*1.5;return <path key={i} d={`M${x} ${y}q-3 -2 -3 1q-3 3 1 3q0 3 3 1q4 1 3 -2q2 -3 -1 -3Z`}/>})}</g>
 <path d="M751 437l2 -.7l1 .8l-2 1.2ZM756 441l2 -.8l1.3 1l-2 1.2ZM758 445l2 -.5l.5 .8l-2 .6Z" fill="black"/>
 <g fill="none" stroke="black" strokeWidth=".24"><path d="M761 630l12 -1m-10 2l21 -1m-19 2l25 -1m-22 -3l12 .2m3 -.2l23 -.4m-13 2l20 -.5M751 633l17 -.4m-9 1l14 -.5"/></g>
 <path d="M738 529l4 1l2 -1l3 2l3 -1l5 2l4 -2l3 1l3 -2l5 1l2 -3l3 3l-2 4l-9 0l-8 -1l-6 0l-8 -1Z" fill="black"/>
 <g stroke="black" fill="none" strokeWidth=".23"><path d="M730 511q-4 -2 -6 1t4 2q-6 4 -2 6M732 514l-10 -8M733 517l-8 2M735 520l-9 4M733 511l-4 -6"/>{Array.from({length:14},(_,i)=><path key={i} d={`M${749+i*.8} ${631+Math.sin(i)*1.4}l${7+Math.sin(i*3)*5} -1`}/>)}</g>
 {/* Open book, held in the right hand. */}
 <path d="M777 513L790 516L804 512L805 530L791 534L777 530Z" fill="white" stroke="black" strokeWidth=".55"/>
 <path d="M790 516L791 533M803 514l1 15M777 515l1 13" stroke="black" strokeWidth=".4"/>
 <ScriptMarks x={779} y={517} width={9} rows={5}/>
 <path d="M794 518q4 -3 7 0M794 519h7M800 523a4 4 0 1 0 0 8a4 4 0 1 0 0 -8M800 523v8l-3 -3l3 -2" fill="none" stroke="black" strokeWidth=".32"/>
 <path d="M779 530q2 5 5 2l2 -1M789 533q2 3 4 0M794 533q2 2 4 -1" stroke="black" fill="none" strokeWidth="1"/>
 {/* Planetary connecting lines and instrument. */}
 <g fill="none" stroke="black" strokeWidth=".39"><path d="M750 518L724 413M746 521L720 454M753 521L798 406M757 520L824 429M759 517L830 458M769 434L842 520M753 506L695 532"/></g>
 <g fill="none" stroke="black" strokeWidth=".35"><path d="M698 414L685 442Q706 454 727 437ZM698 414L687 440Q706 450 725 436M685 442L684 445Q706 457 729 439L727 437"/>{Array.from({length:7},(_,i)=><path key={i} d={`M698 414L${687+i*6.15} ${440+Math.sin(i/6*Math.PI)*7-i*.6}`}/>)}{Array.from({length:16},(_,i)=><path key={i} d={`M${686+i*2.65} ${443+Math.sin(i/15*Math.PI)*7-i*.32}l.5 2`}/>)}</g>
 <Star x={724} y={413} r={3}/><Star x={720} y={454} r={4}/><Star x={695} y={532} r={5}/><Star x={824} y={429} r={4.8}/><Star x={830} y={458} r={4.8}/>
 <Orb x={798} y={406}/><Orb x={842} y={520} moon/>
 <g fontFamily="cursive" fontStyle="italic" fontSize="5" fill="black"><text x="757" y="399">Sol</text><text x="761" y="404">capo</text><text x="830" y="430" fontSize="3.2">Venere</text><text x="810" y="458" fontSize="3.6">Mercurio</text><text x="681" y="527">Marte</text><text x="822" y="547">Luna</text><text x="831" y="553" fontSize="3.8">il capo</text></g>
 <ScriptMarks x={813} y={401} width={20} rows={2}/><ScriptMarks x={711} y={409} width={20} rows={2}/><ScriptMarks x={718} y={460} width={8} rows={2}/><ScriptMarks x={847} y={547} width={17} rows={2}/>
 </g>
 </g>}
