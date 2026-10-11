export type Color='red'|'green'|'blue';
export const colors:Color[]=['red','green','blue'];
export type Train={id:number;color:Color;progress:number;route:number;locked:boolean};
export type Game={phase:'ready'|'playing'|'over';route:number;score:number;lives:number;combo:number;delivered:number;missed:number;trains:Train[];elapsed:number;spawnTime:number;nextId:number};
export const initial=():Game=>({phase:'ready',route:1,score:0,lives:3,combo:0,delivered:0,missed:0,trains:[],elapsed:0,spawnTime:0,nextId:1});
export const rate=(delivered:number)=>0.15+Math.min(.16,Math.floor(delivered/5)*.013);
export const interval=(delivered:number)=>Math.max(1.3,2.7-delivered*.06);
export function simulate(s:Game,dt:number):Game {
 if(s.phase!=='playing')return s;
 const n:Game={...s,elapsed:s.elapsed+dt,spawnTime:s.spawnTime+dt,trains:s.trains.map(t=>({...t}))};
 if(n.spawnTime>=interval(n.delivered)){n.spawnTime-=interval(n.delivered);n.trains.push({id:n.nextId++,color:colors[Math.floor(Math.random()*3)],progress:0,route:1,locked:false});}
 const remaining:Train[]=[];
 for(const train of n.trains){train.progress+=dt*rate(n.delivered);if(!train.locked&&train.progress>=.38){train.route=n.route;train.locked=true;}
 if(train.progress>=1){if(colors.indexOf(train.color)===train.route){n.combo++;n.delivered++;n.score+=100+Math.min(10,n.combo)*20;}else{n.lives--;n.combo=0;n.missed++;}}else remaining.push(train);}
 n.trains=remaining;if(n.lives<=0){n.lives=0;n.phase='over';}return n;
}
