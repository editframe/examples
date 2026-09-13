import React from 'react';
import {Timegroup} from '@editframe/react';
import {Engraving,Manuscript,Geometry} from '../Engravings';
import {Seal} from '../Seal';
import '../manuscript-motion.css';
type Box=[number,number,number,number];
function At({box,children,name}:{box:Box;children:React.ReactNode;name?:string}){return <div className={name?`far-piece far-${name}`:undefined} style={{transformOrigin:"0 0",position:'absolute',left:box[0],top:box[1],width:box[2],height:box[3]}}>{children}</div>}
function Drawing({kind,box,name}:{kind:string;box:Box;name?:string}){return <At box={box} name={name}><Engraving kind={kind}/></At>}
function Page({box,seed=1,lines=22,opacity=1,name}:{box:Box;seed?:number;lines?:number;opacity?:number;name?:string}){return <At box={box} name={name}><div style={{width:'100%',height:'100%',opacity}}><Manuscript lines={lines} seed={seed}/></div></At>}
function Layer({name,children}:{name:string;children:React.ReactNode}){return <div className={`manuscript-layer layer-${name}`}>{children}</div>}
const line1='TO TRANSMUTE SOMETHING';const line2='THAT WAS VERY COMMON';
function Words({value,offset=0}:{value:string;offset?:number}){return <>{value.split('').map((c,i)=><span key={i} className={`common-letter common-${i+offset}`}>{c}</span>)}</>}
export function ManuscriptScene(){return <Timegroup mode="fixed" duration="3.466666667s" className="scene manuscript-scene">
 <Layer name="far">
  <Page name="leftpaper" box={[337,358,245,364]} seed={3}/><Page name="rightpaper" box={[1162,403,219,278]} seed={9}/><Page name="bottompaper" box={[506,660,319,450]} seed={17}/><Page box={[987,726,170,335]} seed={4}/><Page box={[1360,856,600,430]} seed={12} lines={13}/>
  <Page name="topsmall" box={[873,61,155,270]} seed={18} opacity={.72}/><Page box={[1267,111,154,280]} seed={8} opacity={.72}/><Page box={[251,194,299,169]} seed={1} lines={15}/><Page box={[1660,179,340,626]} seed={7} lines={36}/><Page box={[643,225,55,92]} seed={2} opacity={.35}/>
  <Drawing name="planet" kind="planet-main" box={[640,398,229,253]}/><Drawing kind="winged" box={[268,125,266,235]}/><Drawing kind="fountain" box={[1650,182,480,465]}/><Drawing kind="figure" box={[1190,-50,116,181]}/><Drawing kind="figure" box={[1290,73,134,184]}/><Drawing kind="planet" box={[1014,856,190,290]}/><Drawing kind="planet" box={[-74,-205,367,340]}/>
  <div className="common-copy" style={{position:'absolute',left:727,top:571,fontSize:19,lineHeight:'23px',fontFamily:'Nimbus Sans',fontWeight:700,whiteSpace:'nowrap'}}><div><Words value={line1}/></div><div><Words value={line2} offset={line1.length}/></div></div>
 </Layer>
 <Layer name="script1"><Page box={[354,389,360,356]} seed={5}/></Layer>
 <Layer name="script2"><Page box={[1050,827,345,350]} seed={12}/><Page box={[1250,554,285,205]} seed={2} lines={14}/></Layer>
 <Layer name="figure"><Page box={[188,123,207,250]} seed={18}/><Drawing kind="seated" box={[-55,35,323,395]}/><Page box={[147,-30,239,90]} seed={9} lines={7}/></Layer>
 <Layer name="flask"><Drawing kind="flask" box={[395,-32,293,397]}/></Layer>
 <Layer name="geometry"><At box={[534,30,440,280]}><svg width="100%" height="100%" viewBox="0 0 440 280"><g transform="translate(65 171)"><Geometry/></g><g transform="translate(201 171)"><Geometry/></g><g transform="translate(358 171)"><Geometry kind={2}/></g><g transform="translate(210 43) scale(.9)"><Geometry/></g><g transform="translate(364 43) scale(.75)"><Geometry kind={2}/></g></svg></At></Layer>
 <Layer name="shield"><Drawing kind="shield" box={[1020,-165,327,496]}/></Layer>
 <Layer name="robe"><Page box={[1340,3,350,35]} seed={11} lines={2}/><Page box={[1515,96,285,57]} seed={13} lines={2}/><Page box={[1338,164,64,24]} seed={3} lines={1}/><Page box={[1584,221,183,67]} seed={21} lines={3}/><Drawing kind="robe" box={[1265,-89,428,679]}/></Layer>
 <Layer name="heads"><Drawing kind="heads" box={[298,562,449,583]}/><Page box={[512,730,199,302]} seed={15} opacity={.85}/></Layer>
 <Layer name="seal"><At box={[15,675,273,255]}><Seal kind={16} id="manuscript-snake"/></At><At box={[69,734,156,158]}><svg viewBox="-55 -55 110 110" width="100%" height="100%"><path d="M0 -48L45 32H-45ZM0 48L45 -32H-45Z" stroke="black" fill="none" strokeWidth="2"/><circle r="10" fill="black"/></svg></At></Layer>
 <Layer name="sphere"><Drawing kind="sphere" box={[1480,738,326,409]}/></Layer>
 <Layer name="rings"><Drawing kind="rings" box={[1151,473,264,200]}/><Drawing kind="triangle" box={[1330,461,147,163]}/><Drawing kind="hexagon" box={[1320,614,166,157]}/></Layer>
 <Layer name="winged"><Drawing kind="winged" box={[1052,630,221,276]}/></Layer>
 <Layer name="fountain"><Drawing kind="fountain" box={[1210,354,298,374]}/></Layer>
 <Layer name="middle"><Drawing kind="figure" box={[223,376,190,243]}/><Drawing kind="planet" box={[509,184,186,210]}/><Drawing kind="winged" box={[666,348,134,154]}/><Drawing kind="figure" box={[1480,386,137,210]}/><Drawing kind="planet" box={[785,752,175,307]}/><Drawing kind="planet" box={[960,648,130,165]}/><Page box={[799,795,170,203]} seed={2} opacity={.55}/><Page box={[988,219,278,205]} seed={3} lines={14}/><Page box={[671,358,129,112]} seed={3} opacity={.5}/><Page box={[1570,488,170,150]} seed={19} lines={14}/></Layer>
 <div className="alchemy-title" aria-label="ALCHEMY"><span style={{position:"absolute",left:727.5805,top:493.526,transform:"scale(1.0114957,0.9840759)",transformOrigin:"0 0"}}>A</span><span style={{position:"absolute",left:791.4649,top:493.526,transform:"scale(1.0237867,0.9840759)",transformOrigin:"0 0"}}>L</span><span style={{position:"absolute",left:847.8814,top:493.8218,transform:"scale(1.017432,0.9674482)",transformOrigin:"0 0"}}>C</span><span style={{position:"absolute",left:916.6503,top:493.526,transform:"scale(1.0149849,0.9840759)",transformOrigin:"0 0"}}>H</span><span style={{position:"absolute",left:984.8972,top:493.526,transform:"scale(0.9772637,0.9840759)",transformOrigin:"0 0"}}>E</span><span style={{position:"absolute",left:1044.4,top:493.526,transform:"scale(1.0869565,0.9840759)",transformOrigin:"0 0"}}>M</span><span style={{position:"absolute",left:1126.3563,top:493.526,transform:"scale(1.0642752,0.9840759)",transformOrigin:"0 0"}}>Y</span></div>
 <div className="rare-bridge">I</div><div className="manuscript-residue"><Manuscript lines={32} seed={9}/></div>
 </Timegroup>}
