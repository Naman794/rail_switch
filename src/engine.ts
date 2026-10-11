export type TrainColor = 'red' | 'green' | 'blue';
export const palette:TrainColor[]=['red','green','blue'];
export type Train={id:number;color:TrainColor;position:number;destination:number|null};
export type Phase='home'|'playing'|'paused'|'complete'|'failed';
export type Game={phase:Phase;level:number;route:number;score:number;lives:number;delivered:number;goal:number;elapsed:number;nextSpawn:number;nextId:number;trains:Train[]};
export const goalFor=(level:number)=>4+Math.min(8,Math.floor((level-1)/2));
export const createGame=(level=1):Game=>({phase:'home',level,route:1,score:0,lives:3,delivered:0,goal:goalFor(level),elapsed:0,nextSpawn:1.3,nextId:1,trains:[]});
export const trainSpeed=(level:number)=>.19+Math.min(.12,(level-1)*.008);
export function advance(g:Game,dt:number,chooseColor:()=>number=Math.random):Game{
 if(g.phase!=='playing')return g;
 const n:Game={...g,trains:g.trains.map(t=>({...t})),elapsed:g.elapsed+dt,nextSpawn:g.nextSpawn-dt};
 const travel=trainSpeed(n.level)*dt;
 for(const t of n.trains){t.position+=travel;if(t.position>=.44&&t.destination===null)t.destination=n.route;}
 const alive:Train[]=[];
 for(const t of n.trains){if(t.position<1){alive.push(t);continue;}
  if(t.destination===palette.indexOf(t.color)){n.delivered++;n.score+=100;}else{n.lives--;}
 }
 n.trains=alive;
 if(n.lives<=0){n.phase='failed';n.lives=0;return n;}
 if(n.delivered>=n.goal){n.phase='complete';return n;}
 if(n.nextSpawn<=0&&n.trains.length<3){
  n.trains.push({id:n.nextId++,color:palette[Math.max(0,Math.min(2,Math.floor(chooseColor()*3)))],position:0,destination:null});
  n.nextSpawn=Math.max(2.1,3.3-n.level*.06);
 }
 return n;
}
