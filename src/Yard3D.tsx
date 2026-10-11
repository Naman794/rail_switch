import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import type {Game, TrainColor} from './engine';

const colors={red:0xe84b48,green:0x1bba64,blue:0x348dec};
const mat=(color:number,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.03});
const wood=mat(0x96623a),rail=mat(0x9caeb9,.38),grass=mat(0x83c75a),water=mat(0x40aedb,.18);
const points=[new THREE.Vector3(0,.25,5.2),new THREE.Vector3(0,.25,.4),
 new THREE.Vector3(-4,.25,-3.5),new THREE.Vector3(0,.25,-4.3),new THREE.Vector3(4,.25,-3.5)];
const entry=new THREE.CatmullRomCurve3([points[0],new THREE.Vector3(-.2,.25,2.7),points[1]]);
const branches=[new THREE.CatmullRomCurve3([points[1],new THREE.Vector3(-2,.25,-1),points[2]]),
new THREE.CatmullRomCurve3([points[1],new THREE.Vector3(0,.25,-2),points[3]]),
new THREE.CatmullRomCurve3([points[1],new THREE.Vector3(2,.25,-1),points[4]])];
function mesh(g:THREE.BufferGeometry,m:THREE.Material,p:THREE.Vector3,parent:THREE.Group|THREE.Scene){
 const a=new THREE.Mesh(g,m);a.position.copy(p);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;
}
function box(w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Group|THREE.Scene){
 return mesh(new THREE.BoxGeometry(w,h,d),m,new THREE.Vector3(x,y,z),parent);
}
function track(scene:THREE.Scene,curve:THREE.CatmullRomCurve3){
 const a=curve.getSpacedPoints(52);
 for(let i=0;i<a.length-1;i++){
  if(i%2===0){const p=a[i];const tangent=curve.getTangent(i/52);const sleeper=box(.81,.09,.2,wood,p.x,.22,p.z,scene);sleeper.rotation.y=Math.atan2(tangent.x,tangent.z);}
 }
 for(const side of [-.25,.25]){
  const path=curve.getSpacedPoints(80).map((p,i)=>{
   const t=curve.getTangent(i/80);return new THREE.Vector3(p.x+t.z*side,.38,p.z-t.x*side);
  });
  const railPath=new THREE.CatmullRomCurve3(path);
  const metal=mesh(new THREE.TubeGeometry(railPath,95,.035,5,false),rail,new THREE.Vector3(),scene);metal.castShadow=false;
 }
}
function tree(scene:THREE.Scene,x:number,z:number,s:number,variant=0){
 const bark=mat(0x765436),leaves=mat(variant?0x32864c:0x26924b);
 mesh(new THREE.CylinderGeometry(.09*s,.12*s,.9*s,6),bark,new THREE.Vector3(x,.48*s,z),scene);
 const crown=mesh(new THREE.ConeGeometry(.58*s,1.55*s,8),leaves,new THREE.Vector3(x,1.45*s,z),scene);
 crown.castShadow=true;
 const crown2=mesh(new THREE.ConeGeometry(.43*s,1.1*s,8),leaves,new THREE.Vector3(x,2*s,z),scene);
 crown2.castShadow=true;
}
function depot(scene:THREE.Scene,x:number,z:number,c:TrainColor){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 box(1.9,1.4,1.7,mat(0xf6d49b),0,.78,-.38,g);
 const roof=mesh(new THREE.ConeGeometry(1.6,.72,4),mat(colors[c]),new THREE.Vector3(0,1.8,-.38),g);
 roof.rotation.y=Math.PI/4;roof.scale.z=.83;
 box(.94,1.15,.13,mat(0x263c46),0,.65,.51,g);
 box(.98,.17,.18,mat(colors[c]),0,1.34,.57,g);
 const label=document.createElement('canvas');label.width=256;label.height=72;const ctx=label.getContext('2d')!;
 ctx.fillStyle='#fff5de';ctx.font='bold 43px system-ui';ctx.textAlign='center';ctx.fillText(c.toUpperCase(),128,49);
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(label),transparent:true}));
 sprite.position.set(0,1.35,.73);sprite.scale.set(1.4,.4,1);g.add(sprite);
}
function locomotive(color:TrainColor){
 const g=new THREE.Group(),c=mat(colors[color]),black=mat(0x202a34),gold=mat(0xfed66b,.25);
 box(.62,.52,1.13,c,0,.4,0,g);box(.57,.62,.45,c,0,.74,-.34,g);
 box(.6,.35,.54,black,0,.5,.4,g);
 mesh(new THREE.CylinderGeometry(.22,.26,.36,10),black,new THREE.Vector3(0,.82,.29),g);
 box(.7,.11,.68,gold,0,1.01,-.34,g);
 for(const side of [-1,1])for(const z of [-.38,.38]){
  const w=mesh(new THREE.CylinderGeometry(.16,.16,.11,12),black,new THREE.Vector3(side*.35,.2,z),g);
  w.rotation.z=Math.PI/2;
 }
 const lamp=mesh(new THREE.SphereGeometry(.15,12,10),gold,new THREE.Vector3(0,.62,.6),g);
 const light=new THREE.PointLight(0xffdc85,.4,2);light.position.copy(lamp.position);g.add(light);
 return g;
}
function pathAt(position:number,dest:number|null,route:number){
 if(position<.44){const f=position/.44;return {p:entry.getPoint(f),t:entry.getTangent(f)};}
 const branch=branches[dest??route],f=Math.min(1,(position-.44)/.56);
 return {p:branch.getPoint(f),t:branch.getTangent(f)};
}
export default function Yard3D({game,onSwitch}:{game:Game;onSwitch:()=>void}){
 const mount=useRef<HTMLDivElement>(null),state=useRef(game),action=useRef(onSwitch);
 state.current=game;action.current=onSwitch;
 useEffect(()=>{
  const el=mount.current;if(!el)return;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x91dafa);
  scene.fog=new THREE.Fog(0x91dafa,18,36);
  const camera=new THREE.OrthographicCamera(-6.5,6.5,9,-9,.1,80);
  camera.position.set(9,16,16);camera.lookAt(0,0,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;
  el.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x537643,2.3));
  const sun=new THREE.DirectionalLight(0xfff0cf,3.1);sun.position.set(-5,13,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left=-11;sun.shadow.camera.right=11;sun.shadow.camera.top=11;sun.shadow.camera.bottom=-11;sun.shadow.bias=-.001;scene.add(sun);
  box(20,.45,22,grass,0,-.27,0,scene);
  box(6,.02,7,water,-6,.015,3.5,scene);
  const foam=mat(0x9deaff);for(let i=0;i<11;i++)box(.4,.025,.09,foam,-8+i*.53,.03,2.5+Math.sin(i)*.6,scene);
  const stone=mat(0xb5b5a2);
  for(let i=0;i<20;i++){
   const x=-8+(i*73%160)/10,z=-7+(i*37%140)/10;
   if(Math.abs(x)<4.5&&z<5&&z>-5)continue;
   box(.3+(i%3)*.16,.18,.28,stone,x,.13,z,scene);
  }
  const trees=[[-5,-4,1],[-6,-2,.9],[-5,1,.8],[-5,4,1.2],[-3,5,.8],[5,5,.9],[5,2,1.1],[5,-1,.85],[3,-6,1],[-3,-6,.8]];
  trees.forEach(([x,z,s],i)=>tree(scene,x,z,s,i%2));
  [entry,...branches].forEach(c=>track(scene,c));
  depot(scene,-4.3,-4.25,'red');depot(scene,0,-5,'green');depot(scene,4.3,-4.25,'blue');
  const switchBase=mesh(new THREE.CylinderGeometry(.49,.55,.2,18),mat(0x414953),new THREE.Vector3(0,.48,.4),scene);
  const handle=mesh(new THREE.CylinderGeometry(.11,.14,.7,10),mat(0xfac24b,.25),new THREE.Vector3(0,.92,.4),scene);
  mesh(new THREE.SphereGeometry(.19,14,10),mat(0xffd468,.24),new THREE.Vector3(0,1.32,.4),scene);
  const vehicles=new Map<number,THREE.Group>();
  let raf=0;const clock=new THREE.Clock();
  function draw(){
   raf=requestAnimationFrame(draw);const s=state.current;
   for(const t of s.trains){let obj=vehicles.get(t.id);if(!obj){obj=locomotive(t.color);scene.add(obj);vehicles.set(t.id,obj);}
    const {p,t:direction}=pathAt(t.position,t.destination,s.route);obj.position.copy(p);obj.rotation.y=Math.atan2(direction.x,direction.z);
   }
   for(const [id,obj] of vehicles){if(!s.trains.some(t=>t.id===id)){scene.remove(obj);vehicles.delete(id);}}
   handle.rotation.z=(s.route-1)*.32;
   const _=clock.getDelta();renderer.render(scene,camera);
  }
  function resize(){const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
   renderer.setSize(w,h,false);const aspect=w/h;
   const halfHeight=8.1;camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;
   camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(el);resize();draw();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();renderer.dispose();renderer.domElement.remove();
   scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();}});
  };
 },[]);
 return <div className="yard3d" ref={mount} onClick={()=>action.current()} aria-label="Tap the 3D railway to switch tracks" role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action.current()}}}><div className="yard3d-instruction">TAP TO SWITCH TRACK ↻</div></div>;
}
