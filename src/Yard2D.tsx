import {useId} from 'react';
import type {Game,Train} from './engine';
const depotColors=['#fa7072','#53cf87','#61aff4'];
const endY=[122,274,426];
function point(t:Train,route:number){let x:number,y:number,angle:number;
 if(t.position<.44){const p=t.position/.44;x=203-32*p;y=532-270*p;angle=-.1;}
 else{const p=Math.min(1,(t.position-.44)/.56);const r=t.destination??route;x=171+167*p;y=262+(endY[r]-262)*(p*p*(3-2*p));angle=Math.atan2((endY[r]-262)*6*p*(1-p),167);}
 return {x,y,angle};}
export default function Yard2D({game,onSwitch}:{game:Game;onSwitch:()=>void}){
 const id=useId().replace(/:/g,'');
 return <div className="toy-stage"><svg viewBox="0 0 400 580" className="toy-scene" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustrated railway junction with three colored stations, animated trains and an interactive switch">
 <defs>
 <linearGradient id={id+'grass'} x2="0" y2="1"><stop stopColor="#c5ec8b"/><stop offset="1" stopColor="#79c66f"/></linearGradient>
 <linearGradient id={id+'water'} x2=".9" y2="1"><stop stopColor="#b7f4ff"/><stop offset="1" stopColor="#4eb6eb"/></linearGradient>
 <filter id={id+'shadow'} x="-30%" y="-60%" width="170%" height="220%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#385d46" floodOpacity=".27"/></filter>
 <pattern id={id+'ties'} width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="none"/><path d="M0 7 H16" stroke="#79543c" strokeWidth="5"/></pattern>
 </defs>
 <rect width="400" height="580" fill={'url(#'+id+'grass)'}/>
 <path d="M0 360 Q100 312 125 397 T175 580 H0Z" fill={'url(#'+id+'water)'} stroke="#e4e1aa" strokeWidth="12"/>
 <path d="M-40 130 Q45 110 93 145 T164 134" stroke="#e0ecad" strokeWidth="33" fill="none" opacity=".7"/>
 <path d="M260 568 Q300 500 422 516" stroke="#e6eba2" strokeWidth="32" fill="none"/>
 {Array.from({length:26},(_,i)=><g key={i} transform={`translate(${(i*97+21)%405} ${(i*137+42)%574})`}><path d="M-3 0 L0-5 L3 0 M0-3 V4" stroke={i%2?'#f6ed99':'#ffffff'} strokeWidth="2" opacity=".8"/></g>)}
 {[[32,75,.85],[85,26,.75],[22,259,.78],[52,309,.65],[95,365,.9],[343,22,.8],[379,339,.78],[362,498,1],[302,545,.7]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`} filter={'url(#'+id+'shadow)'}><ellipse cx="2" cy="27" rx="20" ry="7" fill="#3c6d49" opacity=".25"/><rect x="-5" y="8" width="10" height="21" rx="3" fill="#92643a"/><circle cy="-5" r="22" fill={i%2?'#288f59':'#439c56'} /><circle cx="-9" cy="-13" r="14" fill="#5fba67"/><circle cx="10" cy="-17" r="12" fill="#72c875"/></g>)}
 <g className="track-layer" filter={'url(#'+id+'shadow)'}>
 {['M203 568 Q199 385 171 262','M171 262 Q223 256 340 122','M171 262 Q244 272 340 274','M171 262 Q235 302 340 426'].map((d,i)=><g key={i}><path d={d} stroke="#80563b" strokeWidth="24" fill="none" strokeLinecap="round"/><path d={d} stroke="#cb9f65" strokeWidth="18" fill="none" strokeDasharray="6 9"/><path d={d} stroke="#4c6472" strokeWidth="11" fill="none"/><path d={d} stroke="#e1e8eb" strokeWidth="7" fill="none"/><path d={d} stroke="#607987" strokeWidth="2" strokeDasharray="4 6" fill="none"/></g>)}
 </g>
 <g opacity=".72">{[0,1,2].map((i)=><path key={i} d={['M171 262 Q223 256 340 122','M171 262 Q244 272 340 274','M171 262 Q235 302 340 426'][i]} fill="none" stroke={depotColors[i]} strokeWidth={game.route===i?6:0} strokeDasharray="10 12" className="route-dash"/>)}</g>
 {endY.map((y,i)=><g key={i} transform={`translate(343 ${y})`} filter={'url(#'+id+'shadow)'}><ellipse cy="29" rx="51" ry="16" fill="#477f4d" opacity=".23"/><rect x="-35" y="-14" width="70" height="54" rx="7" fill="#edcc97" stroke="#a9794d" strokeWidth="3"/><path d="M-43 -15 L0 -45 L43 -15 Z" fill={depotColors[i]} stroke="#fff0c9" strokeWidth="5" strokeLinejoin="round"/><rect x="-18" y="9" width="36" height="31" rx="10" fill="#475862"/><rect x="-26" y="-7" width="52" height="18" rx="7" fill={depotColors[i]}/><text y="6" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="900">{['RED','GREEN','BLUE'][i]}</text></g>)}
 <g transform="translate(171 262)" className={game.phase==='playing'?'switch-idle':''}><circle r="28" fill="#fff2b4" stroke="#a46f39" strokeWidth="5"/><circle r="18" fill="#f5b642" stroke="#fff2c6" strokeWidth="3"/><path d={['M-6 8 L5 -10 L20 -20','M-10 0 L18 0','M-7 -8 L8 8 L19 20'][game.route]} fill="none" stroke="#594930" strokeWidth="6" strokeLinecap="round"/><circle cx="0" cy="0" r="5" fill="#fff4cf"/></g>
 {game.trains.map(t=>{const p=point(t,game.route);const c=({red:'#f46f6b',green:'#3acb84',blue:'#53a4ed'} as Record<string,string>)[t.color];return <g key={t.id} transform={`translate(${p.x} ${p.y}) rotate(${p.angle*180/Math.PI})`} filter={'url(#'+id+'shadow)'}><ellipse cx="0" cy="10" rx="22" ry="10" fill="#254c4d" opacity=".25"/><rect x="-22" y="-18" width="44" height="34" rx="11" fill={c} stroke="#ffefca" strokeWidth="4"/><rect x="-14" y="-12" width="17" height="13" rx="4" fill="#d1f5ff"/><rect x="6" y="-9" width="9" height="10" rx="3" fill="#c1ebff"/><rect x="-20" y="12" width="9" height="6" rx="3" fill="#394a59"/><rect x="11" y="12" width="9" height="6" rx="3" fill="#394a59"/><circle cx="18" cy="0" r="5" fill="#fff6bd"/></g>})}
 <g transform="translate(42 545)"><rect x="-28" y="-17" width="88" height="34" rx="13" fill="#2d5748" opacity=".8"/><text x="16" y="5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800">RAIL YARD</text></g>
 </svg>
 <button className="big-switch" onClick={onSwitch} disabled={game.phase!=='playing'} aria-label="Switch railway route"><span>↻</span> SWITCH TRACK</button>
 <div className="mini-hint">Match every train to its color station</div></div>;
}
