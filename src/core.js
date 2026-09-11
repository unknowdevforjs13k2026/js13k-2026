export const canvas=document.getElementById('game');export const ctx=canvas.getContext('2d');export let W=innerWidth;export let H=innerHeight;export let DPR=Math.min(2,devicePixelRatio||1);export const TOTAL=13;
export const MAX_ENERGY=100,ENERGY_REGEN=9,ENERGY_DRAIN=14,SHOT_ENERGY_COST=18,MAX_CHARGE=3000,COOLDOWN=1100,ARROW_SPEED=850,ARROW_LIFE=5000;
export function clamp(v,a,b){return Math.max(a,Math.min(b,v))}export function rnd(a,b){return a+Math.random()*(b-a)}export function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by)}
export function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(2,devicePixelRatio||1);canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0)}
