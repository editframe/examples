import React from 'react';
import {Timegroup} from '@editframe/react';
import {Seal} from '../Seal';
import {EndingSeal} from '../EndingSeal';
const ranges=[[1,4,0],[4,7,1],[7,10,23],[10,13,2],[13,16,3],[16,19,4],[19,22,5],[22,25,6],[25,28,7],[28,31,8],[31,34,9],[34,37,10],[37,40,11],[40,43,12],[43,46,13],[46,49,14],[49,52,15],[52,55,16],[55,58,17],[58,61,18],[61,64,19],[64,67,20],[67,70,21],[70,71,22]];
export function TunnelScene(){return <Timegroup mode="fixed" duration="2.366666666s" className="scene tunnel">
 {Array.from({length:5},(_,i)=><div key={i} className={`tunnel-square tunnel-square-${i}`}/>)}
 <div className="seal-sizer">{ranges.map(([a,b,k])=><div key={a} className="seal-state" style={{animation:`seal-${a} 2.366666666s steps(1,end) both`}}><div style={{width:"100%",height:"100%",transform:k===0?"scale(1.04)":k===1?"scale(1.09)":k===23?"translateY(-1.5%) scale(1.04)":k===4?"scale(1.11)":k===5?"translateY(-1%) scale(1.05)":k===3?"translateY(-1%) scale(1.04)":undefined}}>{k===23?<EndingSeal state={3} idPrefix={`intro-${a}`}/>:k<6?<EndingSeal state={[1,2,4,5,6,7][k]} idPrefix={`intro-${a}`}/>:<Seal kind={k} id={`seal-${a}`}/>}</div></div>)}</div>

 </Timegroup>}
