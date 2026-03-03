import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const state={
  fitGap:0.25,
  modelStep:0.25,
  drawer:{
    innerWidth:100,
    innerDepth:120,
    innerHeight:40,
    wallThickness:2,
    bottomThickness:2
  },
  dividers:{vertical:[],horizontal:[]}
};

const canvas2D=document.getElementById("editor2d");
canvas2D.width=canvas2D.clientWidth;
canvas2D.height=canvas2D.clientHeight;
const ctx=canvas2D.getContext("2d");

function snap(v){
  const s=state.modelStep;
  return Math.round(v/s)*s;
}

function redraw2D(){
  ctx.clearRect(0,0,canvas2D.width,canvas2D.height);

  const scale=2;
  const w=state.drawer.innerWidth*scale;
  const d=state.drawer.innerDepth*scale;
  const cx=canvas2D.width/2;
  const cy=canvas2D.height/2;

  ctx.strokeStyle="white";
  ctx.strokeRect(cx-w/2,cy-d/2,w,d);

  state.dividers.vertical.forEach(x=>{
    ctx.beginPath();
    ctx.moveTo(cx-w/2+x*scale,cy-d/2);
    ctx.lineTo(cx-w/2+x*scale,cy+d/2);
    ctx.stroke();
  });

  state.dividers.horizontal.forEach(y=>{
    ctx.beginPath();
    ctx.moveTo(cx-w/2,cy-d/2+y*scale);
    ctx.lineTo(cx+w/2,cy-d/2+y*scale);
    ctx.stroke();
  });
}

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,1,0.1,1000);
camera.position.set(150,150,150);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(view3d.clientWidth,view3d.clientHeight);
view3d.appendChild(renderer.domElement);

camera.aspect=view3d.clientWidth/view3d.clientHeight;
camera.updateProjectionMatrix();

const controls=new OrbitControls(camera,renderer.domElement);
scene.add(new THREE.AmbientLight(0xffffff,0.8));

let meshes=[];

function clearScene(){
  meshes.forEach(m=>{
    scene.remove(m);
    m.geometry.dispose();
    m.material.dispose();
  });
  meshes=[];
}

function rebuild3D(){
  clearScene();

  const {innerWidth,innerDepth,innerHeight,wallThickness,bottomThickness}=state.drawer;

  const outerW=innerWidth+wallThickness*2;
  const outerD=innerDepth+wallThickness*2;
  const outerH=innerHeight+bottomThickness;

  const geo=new THREE.BoxGeometry(outerW,outerH,outerD);
  const mat=new THREE.MeshStandardMaterial({color:0x888888});
  const box=new THREE.Mesh(geo,mat);
  scene.add(box);
  meshes.push(box);
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();

redraw2D();
rebuild3D();
