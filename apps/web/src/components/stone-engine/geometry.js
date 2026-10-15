import { BufferAttribute, ExtrudeGeometry, Shape, Source, Vector2 } from 'three';
import { createStoneResources } from './stone.js';
import { outline, validParameters } from '../../lib/geometry.ts';

/** Extends the preserved engine; broad surfaces are front/back, edges are perimeter faces. */
export function createProductResources(assets, settings, anisotropy = 4) {
 const main=assets.top,resource=createStoneResources(main,settings,anisotropy);
 const sources=new Map();
 for(let face=0;face<6;face++){
  const asset=face===4?assets.top:face===5?assets.bottom:assets.side;
  if(!sources.has(asset))sources.set(asset,{color:new Source(asset.color),bump:new Source(asset.bump)});
  const source=sources.get(asset),material=resource.materials[face];material.map.source=source.color;material.bumpMap.source=source.bump;
  material.name=face===4?'Top surface':face===5?'Bottom surface':'Stone edge';
 }
 const selection=settings.geometry;
 if(selection?.source==='procedural'&&!['slab','block','tile'].includes(selection.shape)){
  if(!validParameters(selection.shape,selection.parameters)){resource.dispose();throw Error('Invalid procedural geometry');}
  const points=outline(selection.shape,selection.parameters).map(([x,y])=>[x/100,y/100]);
  const x=points.map(p=>p[0]),y=points.map(p=>p[1]),minX=Math.min(...x),minY=Math.min(...y),maxX=Math.max(...x),maxY=Math.max(...y);
  const referenceWidth=(settings.referenceWidth||settings.width)/100,referenceHeight=(settings.referenceHeight||settings.height)/100;
  const shape=new Shape(points.map(p=>new Vector2(...p)));
  const geometry=new ExtrudeGeometry(shape,{depth:settings.thickness/100,bevelEnabled:false,steps:1,curveSegments:64});
  const positions=geometry.attributes.position,normals=geometry.attributes.normal,uv=geometry.attributes.uv;
  const perimeter=[0];for(let i=1;i<=points.length;i++)perimeter[i]=perimeter[i-1]+Math.hypot(points[i%points.length][0]-points[i-1][0],points[i%points.length][1]-points[i-1][1]);
  const faces={4:[],5:[],0:[]};geometry.clearGroups();
  for(let i=0;i<positions.count;i+=3){const normal=normals.getZ(i),material=normal>.5?4:normal<-.5?5:0;faces[material].push(i,i+1,i+2);
   const vertices=[i,i+1,i+2],nearest=vertices.map(j=>points.reduce((best,p,k)=>Math.hypot(p[0]-positions.getX(j),p[1]-positions.getY(j))<Math.hypot(points[best][0]-positions.getX(j),points[best][1]-positions.getY(j))?k:best,0));
   const radii=vertices.map(j=>Math.hypot(positions.getX(j),positions.getY(j)));
   if(material===0&&['circle','sector','annular'].includes(selection.shape)&&Math.min(...radii)>.00001&&Math.max(...radii)-Math.min(...radii)<.00001){vertices.forEach((j,k)=>{const x=positions.getX(j),y=positions.getY(j),sign=normals.getX(j)*x+normals.getY(j)*y<0?-1:1;normals.setXYZ(j,sign*x/radii[k],sign*y/radii[k],0);});}
   vertices.forEach((j,k)=>{if(material===0){let u=perimeter[nearest[k]];if(nearest.includes(points.length-1)&&nearest[k]===0)u=perimeter.at(-1);uv.setXY(j,u/referenceWidth,positions.getZ(j)/referenceHeight);}else uv.setXY(j,(positions.getX(j)-minX)/referenceWidth,(positions.getY(j)-minY)/referenceHeight);});
  }
  const order=[...faces[4],...faces[5],...faces[0]];
  for(const [name,attribute]of Object.entries(geometry.attributes)){const data=new attribute.array.constructor(attribute.array.length);order.forEach((vertex,i)=>{for(let k=0;k<attribute.itemSize;k++)data[i*attribute.itemSize+k]=attribute.array[vertex*attribute.itemSize+k];});geometry.setAttribute(name,new BufferAttribute(data,attribute.itemSize));}
  let start=0;for(const material of[4,5,0]){geometry.addGroup(start,faces[material].length,material);start+=faces[material].length;}
  geometry.translate(-(minX+maxX)/2,-(minY+maxY)/2,-settings.thickness/200);geometry.userData.physicalUVs=true;
  resource.geometry.dispose();resource.geometry=geometry;resource.dispose=()=>{geometry.dispose();resource.materials.forEach(m=>{m.map.dispose();m.bumpMap.dispose();m.dispose();});};
 }
 return resource;
}
