import React from 'react';
import {CoinArtwork} from './CoinArtwork';
import {RoseArtwork} from './RoseArtwork';
const ring='M-78 -58C-41 -111 33 -118 77 -66C118 -23 113 40 65 79C13 122 -51 108 -87 59C-113 21 -111 -15 -78 -58Z';
const thin='M-94 -17C-94 -70 -43 -103 4 -100C62 -98 107 -50 102 9C99 59 59 102 7 102C-46 107 -96 63 -99 13';
function Leaves(){return <g fill="#000"><path d="M-11 71C-14 32 -15 13 4 -2M-9 60C-38 52 -65 51 -94 28M-12 53C23 36 64 33 87 5" stroke="#000" strokeWidth="3" fill="none"/><path d="M-15 5C-67 -11 -25 -70 5 -57C52 -59 43 -9 6 -1L-15 5Z"/><path d="M-34 53Q-69 13 -60 16Q-30 22 -34 53M-57 47Q-86 15 -79 12Q-51 22 -57 47M-8 48Q21 17 20 11Q-11 25 -8 48M32 34Q54 4 54 -7Q27 0 32 34M-72 76Q-103 49 -95 45Q-67 52 -72 76M-24 85Q-50 65 -59 74Q-44 91 -24 85M10 86Q36 70 46 78Q36 94 10 86M72 7Q98 -17 94 -31Q72 -19 72 7"/></g>}
function Head({angle=0}:{angle?:number}){return <g transform={`rotate(${angle})`}><path d="M-91 -28L-102 -52L-93 -78L-82 -73L-74 -92L-67 -79L-44 -80L-66 -64L-85 -57L-80 -38Z" fill="#000"/><path d="M-76 -67Q-92 -88 -101 -103L-80 -90L-66 -105L-62 -78Z" fill="#000"/><path d="M-77 -51Q-65 -35 -59 -20L-37 -12M-67 -38L-64 -8L-52 -20M-39 -13L-27 -25" fill="none" stroke="#000" strokeWidth="5"/></g>}
function Bird(){return <g fill="#000"><path d="M-12 -11C-25 -14 -31 -6 -26 3L-9 18L-6 32L5 19L13 3L9 -6Z"/><path d="M-7 23L-1 43L-12 53L4 61L10 48L2 27M-24 -5Q-57 -42 -80 -45Q-67 -8 -24 -5M15 9Q40 -18 62 -13Q56 13 28 19Z"/><path d="M-3 -24L7 -27L16 -19L16 -34L5 -33Z"/></g>}
function Coin({eye=false}:{eye?:boolean}){return <g><path d={ring} fill="#000"/><g fill="none" stroke="#fff"><ellipse rx={eye?69:78} ry={eye?49:77} transform="rotate(28)" strokeWidth={eye?6:2}/><circle r="42" strokeWidth={eye?5:2}/><circle r="14" strokeWidth="3"/></g><circle r={eye?12:4} fill="#fff"/>{!eye&&Array.from({length:28},(_,i)=>{const a=i*Math.PI/14;return <path key={i} d={`M${Math.cos(a)*84} ${Math.sin(a)*84}l${Math.cos(a)*13} ${Math.sin(a)*13}`} stroke="#fff" strokeWidth="6"/>})}</g>}
function DragonLarge(){return <g transform="translate(-5 2)"><path d="M29 -98C81 -91 105 -39 105 9C108 43 103 70 88 83L67 97L51 106L35 102L45 94L65 87L55 86L33 91L31 85L58 77L77 73C102 47 102 -10 92 -39C76 -69 58 -91 29 -98Z" fill="#000"/><path d="M-30 -91L-23 -98L-20 -106L-17 -102L-12 -103L-11 -108L-6 -100L-1 -103L0 -99L6 -96L2 -91L-10 -88L-22 -89L-41 -78Z" fill="#000"/><path d="M-48 -64C-65 -52 -75 -25 -72 -16L-58 -15L-61 -30L-53 -45L-48 -64ZM-63 -1L-72 -5L-71 15L-64 43L-58 32L-60 19L-61 2Z" fill="#000"/><path d="M-68 49Q-45 85 2 96Q-43 87 -68 49" fill="#000" opacity=".3"/>
<path d="M-77 -13L-82 -14L-90 -24L-97 -22L-105 -18L-113 -18L-126 -6L-124 5L-111 4L-107 12L-94 13L-87 8L-78 -1ZM-101 -15L-110 -20L-121 -17L-131 -3L-123 5L-111 4L-114 -9L-101 -15ZM-101 -37L-112 -39L-131 -28L-132 -17L-123 -18L-112 -23L-101 -37Z" fill="#000"/>
<path d="M-78 6L-92 20L-113 18L-109 2L-101 -5L-98 8L-88 12L-78 6Z" fill="#000"/><path d="M-54 -40L-56 -31L-52 -28L-49 -38M-54 -15L-56 -5L-52 7M-47 22L-51 29L-48 36L-40 32L-39 23Z" fill="#000"/></g>}
export function Seal({kind=0,id='seal'}:{kind?:number,id?:string}){
 if(kind===10||kind===14)return <svg width="100%" height="100%" viewBox="-108 -108 216 216" preserveAspectRatio="none"><CoinArtwork id={id} variant={kind===10?'dark':'decorated'}/></svg>;
 if(kind===15)return <svg width="100%" height="100%" viewBox="0 0 457 362" preserveAspectRatio="none"><RoseArtwork id={id}/></svg>;
 const large=kind===18;const view=large?'-136 -104 246 210':kind===0||[6,8,12,15,16,20].includes(kind)?'-119 -119 238 238':'-108 -108 216 216';
 const weight=[32,4,9,5,1.6,4,28,15,29,5,0,15,18,8,0,20,19,18,0,10,17,0,8][kind];
 const textural=kind>1; const printAlpha=[16,20,22].includes(kind)?'0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 18 -8':'0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 12 -3.2';
 return <svg viewBox={view} width="100%" height="100%" preserveAspectRatio="none" overflow="visible"><defs>
 <filter id={`${id}-rough`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={kind>=15?'.14':'.32'} numOctaves="3" seed={21+kind} result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={kind===0?1:kind>=15?5:2.2} xChannelSelector="R" yChannelSelector="G"/></filter>
 <filter id={`${id}-ink`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={[16,20,22].includes(kind)?".75":".53"} numOctaves="3" seed={31+kind} result="grain"/><feColorMatrix in="grain" type="matrix" values={printAlpha} result="speck"/><feComposite in="SourceGraphic" in2="speck" operator="in"/></filter>
 </defs><g filter={`url(#${id}-rough)`}><g filter={textural?`url(#${id}-ink)`:undefined}>
 {large?<DragonLarge/>:<>
 {[10,14,21].includes(kind)?<Coin eye={kind===21}/>:<path d={kind<2||kind===4||kind===5?thin:ring} fill="none" stroke="#000" strokeWidth={weight} strokeLinecap="round"/>}
 {kind===2&&<><circle r="73" stroke="#000" strokeWidth="3" fill="none"/>{Array.from({length:38},(_,i)=><path key={i} transform={`rotate(${i*360/38})`} d="M0 -72Q-6 -80 -3 -95M-3 -100L0 -110" stroke="#000" strokeWidth="3" fill="none"/>)}</>}
 {kind===3&&<><path d="M93 -35C126 13 77 100 24 103L-16 96C59 96 103 39 93 -35Z" fill="#000"/><path d="M-86 39L-109 23L-104 44L-91 52L-88 74L-77 91L-83 65L-69 77L-78 50Z" fill="#000"/><circle r="21" fill="#000"/>{Array.from({length:24},(_,i)=><path key={i} d={i%2===0?"M0 -24C-8 -39 9 -53 0 -77C4 -54 17 -42 5 -25Z":"M0 -26Q-7 -49 2 -68Q-2 -50 3 -27Z"} fill="#000" transform={`rotate(${i*15})`}/>)}</>}
 {kind===4&&<path d="M-107 -36L-69 -18L-81 12L-109 36" stroke="#fff" strokeWidth="9" fill="none"/>}
 {kind===6&&<><path d="M-87 -22L-108 -12L-105 40L-84 54L-87 -22Z" fill="#000"/>{Array.from({length:35},(_,i)=><path key={i} d={`M${Math.cos(i*4)*70} ${Math.sin(i*7)*66}l2 6`} stroke="#000" strokeWidth=".5"/>)}</>}
 {(kind===7||kind===16)&&<><Head angle={5}/><path d="M58 59L48 32L41 38L40 49L61 65M66 42L78 21L82 23L74 41L88 45" fill="none" stroke="#000" strokeWidth="7"/></>}
 {kind===15&&<><Leaves/><path d="M-85 54Q-109 45 -103 29L-87 37Z" fill="#000"/></>}
 {kind===8&&<><circle cx="3" cy="4" r="24" fill="#000"/><path d="M-3 21L-1 37L15 43L12 49L-3 48L4 59L-13 55L-21 43L-38 39L-39 32L-26 34L-38 7L-33 -2L-23 13L-19 33L-9 34Z" fill="#000"/><path d="M-52 -23L-42 -29L-38 -39L-27 -42L-20 -37L-27 -31L-18 -26L-24 -18L-36 -22L-40 -13L-38 -8L-44 -4L-49 -7L-44 -15Z" fill="#000"/><path d="M44 -23L40 -14L42 -5L34 -2L36 6L32 17L23 24L31 25L39 17L42 23L40 30L49 27L52 18L46 12L58 9L61 -2L59 -9L50 -1L48 -11L49 -21Z" fill="#000"/><path d="M-99 -65L-108 -50L-115 -31L-114 -8L-108 0L-104 -17L-94 -20L-94 -55Z" fill="#000"/></>}
 {kind===9&&<><circle r="8" fill="#000"/><circle cx="15" cy="65" r="6" fill="#000"/><path d="M-77 -22L-89 10M-78 -21L-85 -50M-40 -70L-34 -41" stroke="#000" strokeWidth="3" fill="none"/></>}
 {kind===11&&<><Head angle={0}/><path d="M76 -43C39 -64 27 -12 58 3L63 19L72 27L66 49L78 62L84 21L91 -15Z" fill="#000"/></>}
 {kind===12&&Array.from({length:280},(_,i)=>{const a=i*2.39996,r=Math.sqrt((i+.5)/280)*80;return <path key={i} d={`M${Math.cos(a)*r} ${Math.sin(a)*r}l${2+Math.sin(i*4)*3} ${Math.cos(i*2)*4}`} stroke="#000" strokeWidth="1.3"/>})}
 {kind===13&&<><path d="M-87 -49L-87 -73L-77 -88L-71 -69L-55 -73L-62 -57L-82 -46Z" fill="#000"/><path d="M79 52L83 76L69 89L56 77Z" fill="#000"/><path d="M0 -44L7 -10L31 -31L12 -3L44 0L12 7L31 33L5 13L0 45L-5 13L-33 33L-13 7L-45 0L-12 -5L-33 -31L-6 -12Z" fill="#000"/><circle r="7" fill="#fff"/></>}
 {kind===17&&<g><Head angle={7}/><path d="M49 -83L44 -35L48 -1L59 26L57 64L67 83L86 67L96 35L92 -5L82 -42L63 -78ZM-80 0L-16 5L35 -11L53 4" fill="#000"/><path d="M-69 -16L-57 37L-44 49L-47 16Z" fill="#000"/></g>}
 {kind===19&&<><Head angle={15}/><path d="M-71 -63L-91 -80L-88 -118L-66 -135L-76 -113L-66 -96L-52 -122L-44 -112L-55 -88L-39 -113L-34 -98L-55 -77Z" fill="#000"/><Bird/></>}
 {(kind===20||kind===22)&&<path d="M41 -88L61 -104L81 -102L78 -83L68 -85L62 -65L74 -51L49 -59L40 -73Z" fill="#000"/>}
 </>}
 </g></g></svg>
}
