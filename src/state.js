import {W,H,MAX_ENERGY} from './core.js';
export const debug={energy:true,shotEnergy:true,blackCloud:true,target:true,hint:true,cloudLevel:false,ui:false,collision:false,trajectory:false,trajectoryDisplay:false,shake:true};
export const aim={x:W*.72,y:H*.45};export const weapon={energy:MAX_ENERGY,cooldown:0,charging:false,charge:0,shake:0};export const game={started:false,finished:false,score:0,rescued:0,assistTimer:0,assistFlash:0};
export const clouds=[],unicorns=[],backgroundClouds=[],arrows=[],particles=[],impacts=[],rainbows=[],rain=[];
export const weather={raining:false,timer:0,duration:1800,rainbow:null};
