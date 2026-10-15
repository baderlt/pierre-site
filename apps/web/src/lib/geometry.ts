export const shapeFields = {
  slab:['width','height','thickness'], block:['width','height','thickness'], tile:['width','height','thickness'],
  square:['side','thickness'], circle:['diameter','thickness'], hexagon:['diameter','thickness'], triangle:['width','height','thickness'],
  trapezoid:['width','top_width','height','thickness'], sector:['radius','angle','thickness'], annular:['inner_radius','outer_radius','angle','thickness'], polygon:['vertices','thickness']
} as const;
export type Shape = keyof typeof shapeFields;
export type Parameters = Record<string,number | number[][]>;
export type Limit = {min:number;max:number;default:number;step:number};
export type GeometrySelection = {version:2;revision:number;source:'procedural'|'glb';shape:Shape|'model';parameters:Parameters};
export type ViewerConfiguration = Omit<GeometrySelection,'version'> & {customizable:boolean;limits:Record<string,Limit>;materials:Partial<Record<'top'|'bottom'|'side',string>>;edge_finish:'same'|'rough'|'original';model:{url:string;sha256:string;bytes:number;validated:true;mime:'model/gltf-binary';dimensions_cm:{width:number;height:number;thickness:number}}|null};
export function outline(shape:Shape,p:Parameters):number[][] {
 const n=(key:string)=>p[key] as number;
 if(['slab','block','tile','square'].includes(shape)){const w=n('side')??n('width'),h=n('side')??n('height');return [[0,0],[w,0],[w,h],[0,h]];}
 if(shape==='triangle')return [[0,0],[n('width'),0],[n('width')/2,n('height')]];
 if(shape==='trapezoid')return [[0,0],[n('width'),0],[(n('width')+n('top_width'))/2,n('height')],[(n('width')-n('top_width'))/2,n('height')]];
 if(shape==='polygon')return p.vertices as number[][];
 const count=shape==='hexagon'?6:64,angle=n('angle')===undefined?Math.PI*2:n('angle')*Math.PI/180,r=n('outer_radius')??n('radius')??n('diameter')/2,points:number[][]=[];
 const angles:number[]=[];for(let i=0;i<=(['hexagon','circle'].includes(shape)?count-1:count);i++)angles.push(angle*i/count);
 if(['sector','annular'].includes(shape))for(const a of[Math.PI/2,Math.PI,Math.PI*1.5])if(a<angle&&!angles.some(v=>Math.abs(v-a)<.000000001))angles.push(a);
 angles.sort((a,b)=>a-b);for(const a of angles)points.push([r*Math.cos(a),r*Math.sin(a)]);
 if(shape==='sector')points.push([0,0]);
 if(shape==='annular')for(const a of [...angles].reverse())points.push([n('inner_radius')*Math.cos(a),n('inner_radius')*Math.sin(a)]);
 return points;
}
export function geometryDimensions(shape:Shape,p:Parameters){const points=outline(shape,p),x=points.map(v=>v[0]),y=points.map(v=>v[1]);return {width:Math.ceil((Math.max(...x)-Math.min(...x))*100-.000001)/100,height:Math.ceil((Math.max(...y)-Math.min(...y))*100-.000001)/100,thickness:p.thickness as number};}
export function validParameters(shape:Shape,p:Parameters,limits:Record<string,Limit>={},fixed?:Parameters):boolean {
 const keys:readonly string[]=shapeFields[shape];if(!keys||!p||Object.keys(p).length!==keys.length||Object.keys(p).some(k=>!keys.includes(k)))return false;
 for(const key of keys){const v=p[key];if(key==='vertices'){if(!validPolygon(v)||fixed&&JSON.stringify(v)!==JSON.stringify(fixed.vertices))return false;continue;}
  const max=key==='angle'?359:key.includes('radius')?250:500;if(typeof v!=='number'||!Number.isFinite(v)||v<.5||v>max||Math.abs(v*100-Math.round(v*100))>.00001)return false;
  const l=limits[key];if(l){if(v<l.min-.00001||v>l.max+.00001||Math.abs((v-l.default)/l.step-Math.round((v-l.default)/l.step))>.00001)return false;}else if(fixed&&Math.abs(v-(fixed[key] as number))>.00001)return false;
 }
 if(shape==='annular'&&(p.outer_radius as number)-(p.inner_radius as number)<.5)return false;
 const d=geometryDimensions(shape,p);return [d.width,d.height,d.thickness].every(v=>Number.isFinite(v)&&v>=.5&&v<=500);
}
function validPolygon(value:unknown):value is number[][] {
 if(!Array.isArray(value)||value.length<3||value.length>32||value.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>250)))return false;
 const p=value as number[][],cross=(a:number[],b:number[],c:number[])=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);let area=0;
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];if(Math.hypot(b[0]-a[0],b[1]-a[1])<.01||Math.abs(cross(p[(i+p.length-1)%p.length],a,b))<.000001)return false;area+=a[0]*b[1]-b[0]*a[1];
  for(let j=i+1;j<p.length;j++){if(j===i+1||i===0&&j===p.length-1)continue;const c=p[j],d=p[(j+1)%p.length];if(cross(a,b,c)*cross(a,b,d)<=.00000001&&cross(c,d,a)*cross(c,d,b)<=.00000001&&Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))+.000001&&Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))+.000001)return false;}
 }return Math.abs(area)>=.5;
}
export function selectionFor(viewer:ViewerConfiguration):GeometrySelection{return {version:2,revision:viewer.revision,source:viewer.source,shape:viewer.shape,parameters:viewer.parameters};}
export function validSelection(s:GeometrySelection,v:ViewerConfiguration){return !!s&&!!s.parameters&&typeof s.parameters==='object'&&!Array.isArray(s.parameters)&&s.version===2&&s.revision===v.revision&&s.source===v.source&&s.shape===v.shape&&(s.source==='glb'?Object.keys(s.parameters).length===0:validParameters(s.shape as Shape,s.parameters,v.customizable?v.limits:{},v.parameters));}
export const geometryCopy={
 fr:{shape:'Géométrie',fixed:'Dimensions fixes approuvées pour cet aperçu.',model:'Modèle GLB validé — matériaux et proportions d’origine. Dimensions du modèle, à confirmer pour la fabrication.',parameters:'Dimensions du modèle',slab:'Dalle rectangulaire',block:'Bloc',tile:'Carreau',square:'Dalle carrée',circle:'Disque circulaire',hexagon:'Dalle hexagonale',triangle:'Dalle triangulaire',trapezoid:'Dalle trapézoïdale',sector:'Secteur circulaire',annular:'Secteur annulaire',polygon:'Polygone',width:'Largeur',height:'Hauteur',thickness:'Épaisseur',side:'Côté',diameter:'Diamètre',top_width:'Largeur supérieure',radius:'Rayon',inner_radius:'Rayon intérieur',outer_radius:'Rayon extérieur',angle:'Angle'},
 en:{shape:'Geometry',fixed:'Approved fixed dimensions for this preview.',model:'Validated GLB model — original materials and proportions. Model bounds require manufacturing confirmation.',parameters:'Model dimensions',slab:'Rectangular slab',block:'Block',tile:'Tile',square:'Square slab',circle:'Circular disc',hexagon:'Hexagonal slab',triangle:'Triangular slab',trapezoid:'Trapezoidal slab',sector:'Circular sector',annular:'Annular sector',polygon:'Polygon',width:'Width',height:'Height',thickness:'Thickness',side:'Side',diameter:'Diameter',top_width:'Top width',radius:'Radius',inner_radius:'Inner radius',outer_radius:'Outer radius',angle:'Angle'},
 ar:{shape:'الشكل الهندسي',fixed:'أبعاد ثابتة معتمدة لهذا العرض.',model:'نموذج GLB متحقق منه بخاماته ونسبه الأصلية. أبعاد النموذج تتطلب تأكيد التصنيع.',parameters:'أبعاد النموذج',slab:'لوح مستطيل',block:'كتلة',tile:'بلاطة',square:'لوح مربع',circle:'قرص دائري',hexagon:'لوح سداسي',triangle:'لوح مثلث',trapezoid:'لوح شبه منحرف',sector:'قطاع دائري',annular:'قطاع حلقي',polygon:'مضلع',width:'العرض',height:'الارتفاع',thickness:'السماكة',side:'الضلع',diameter:'القطر',top_width:'العرض العلوي',radius:'نصف القطر',inner_radius:'نصف القطر الداخلي',outer_radius:'نصف القطر الخارجي',angle:'الزاوية'}
};
