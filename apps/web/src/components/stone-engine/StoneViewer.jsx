import { Component, Suspense, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Box3, MathUtils, PCFSoftShadowMap, Vector3 } from 'three';
import { dimensionsInMeters } from './stone.js';
import { createProductResources } from './geometry.js';

function Stone({ asset, settings, meshRef, onReady }) {
  const { gl, invalidate } = useThree();
  const announced = useRef(false);
  // Material sliders mutate existing materials; only dimensions replace geometry.
  const resource = useMemo(() => {
    const result = createProductResources(asset, settings, Math.min(8, gl.capabilities.getMaxAnisotropy()));
    return result;
  }, [asset, gl, settings.width, settings.height, settings.thickness, settings.geometry?.shape, JSON.stringify(settings.geometry?.parameters)]);
  useLayoutEffect(() => () => resource.dispose(), [resource]);
  useLayoutEffect(() => {
    resource.materials.forEach((material,face) => {
      const roughEdge=face<4&&settings.edgeFinish==='rough';
      material.roughness = roughEdge?.92:settings.roughness;
      material.metalness = settings.metalness ?? 0;
      material.bumpScale = (roughEdge?.72:settings.bump) * 0.003;
      const clearcoat = roughEdge?0:settings.finish === 'polished' ? 0.32 : settings.finish === 'honed' ? 0.04 : 0;
      if (Boolean(material.clearcoat) !== Boolean(clearcoat)) material.needsUpdate = true;
      material.clearcoat = clearcoat;
      material.envMapIntensity = settings.finish === 'polished' ? 0.9 : 0.6;
    });
    invalidate();
  }, [resource, settings.roughness, settings.metalness, settings.bump, settings.finish, settings.edgeFinish, invalidate]);
  useLayoutEffect(() => {
    resource.materials.forEach((material, face) => {
      const [width, height, depth] = resource.dimensions;
      const rw=(settings.referenceWidth||settings.width)/100,rh=(settings.referenceHeight||settings.height)/100;
      const repeat = resource.geometry.userData.physicalUVs?[1,1]:face < 2 ? [depth / rw, height/rh] : face < 4 ? [width/rw, depth / rh] : [width/rw, height/rh];
      for (const texture of [material.map, material.bumpMap]) {
        texture.repeat.set(repeat[0] * settings.scale, repeat[1] * settings.scale);
        texture.rotation = MathUtils.degToRad(settings.rotation);
      }
    });
    invalidate();
  }, [resource, settings.scale, settings.rotation, invalidate]);
  return <mesh ref={meshRef} onAfterRender={() => { if (!announced.current) { announced.current = true; queueMicrotask(onReady); } }} name="TIME STONE product — approximate hidden surfaces" geometry={resource.geometry} material={resource.materials} position={[0, resource.dimensions[1] / 2 + 0.008, 0]} castShadow receiveShadow dispose={null} />;
}

function CameraRig({ settings, controlsRef, cameraApi }) {
  const { camera, size, invalidate } = useThree();
  const dimensions = dimensionsInMeters(settings);
  const [width, height, depth] = dimensions;
  useLayoutEffect(() => {
    const target = new Vector3(0, height / 2, 0);
    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * size.width / size.height);
    const radius = Math.sqrt(width * width + height * height + depth * depth) / 2;
    const distance = radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2) * 1.22;
    function reset() {
      camera.position.copy(target).add(new Vector3(0.48, 0.25, 1).normalize().multiplyScalar(distance));
      camera.near = Math.max(0.001, radius / 500);
      camera.far = Math.max(100, distance * 10);
      camera.updateProjectionMatrix();
      const controls = controlsRef.current;
      if (controls) {
        controls.target.copy(target);
        controls.minDistance = Math.max(radius * 0.7, 0.02);
        controls.maxDistance = distance * 3;
        controls.update();
      }
      invalidate();
    }
    cameraApi.current = {
      reset,
      rotate(angle) {
        const controls = controlsRef.current;
        if (!controls) return;
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new Vector3(0, 1, 0), angle);
        camera.position.copy(controls.target).add(offset);
        controls.update();
        invalidate();
      },
      inspectEdge() {
        const controls = controlsRef.current;
        if (!controls) return;
        camera.position.copy(controls.target).add(new Vector3(1, 0.08, 0.12).normalize().multiplyScalar(distance));
        controls.update();
        invalidate();
      },
      zoom(factor) {
        const controls = controlsRef.current;
        if (!controls) return;
        const offset = camera.position.clone().sub(controls.target);
        offset.setLength(MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance));
        camera.position.copy(controls.target).add(offset);
        controls.update();
        invalidate();
      },
    };
    reset();
    return () => { cameraApi.current = null; };
  }, [width, height, depth, size.width, size.height, camera, controlsRef, cameraApi, invalidate]);
  return null;
}

function CustomModel({model,meshRef,onReady}){
  const announced=useRef(false),{invalidate}=useThree();
  const position=useMemo(()=>{model.scene.updateMatrixWorld(true);const box=new Box3().setFromObject(model.scene),center=box.getCenter(new Vector3());return [-center.x,-box.min.y+.008,-center.z];},[model]);
  useLayoutEffect(()=>{invalidate();},[model,invalidate]);
  useFrame(()=>{if(!announced.current){announced.current=true;queueMicrotask(onReady);}});
  return <group ref={meshRef} position={position} dispose={null}><primitive object={model.scene} dispose={null}/></group>;
}

function DimensionProjection({meshRef,onMeasure,measuring}) {
  const {camera,size}=useThree();
  const last=useRef('');
  const box=useMemo(()=>new Box3(),[]);
  useFrame(()=>{
    if(!measuring||!onMeasure||!meshRef.current)return;
    meshRef.current.updateWorldMatrix(true,true);box.setFromObject(meshRef.current);
    if(box.isEmpty())return;
    const {min,max}=box;
    const project=(x,y,z)=>{const p=new Vector3(x,y,z).project(camera);return p.z>=-1&&p.z<=1?[(p.x+1)*size.width/2,(1-p.y)*size.height/2]:[NaN,NaN];};
    const front=camera.position.z>=(min.z+max.z)/2?max.z:min.z;
    const left=project(min.x,min.y,front)[0]<=project(max.x,min.y,front)[0]?min.x:max.x,right=left===min.x?max.x:min.x;
    const top=camera.position.y>=(min.y+max.y)/2?max.y:min.y;
    const frame={width:size.width,height:size.height,center:project((min.x+max.x)/2,(min.y+max.y)/2,(min.z+max.z)/2),dimensions:{width:(max.x-min.x)*100,height:(max.y-min.y)*100,thickness:(max.z-min.z)*100},edges:[
      {axis:'width',start:project(min.x,min.y,front),end:project(max.x,min.y,front)},
      {axis:'height',start:project(left,min.y,front),end:project(left,max.y,front)},
      {axis:'thickness',start:project(right,top,min.z),end:project(right,top,max.z)}
    ]};
    const signature=JSON.stringify(frame);
    if(signature!==last.current){last.current=signature;queueMicrotask(()=>onMeasure(frame));}
  });
  return null;
}

class WebGLErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function RenderBudget({ visible }) {
  const { gl, invalidate } = useThree();
  const frames = useRef(0);
  useEffect(() => { gl.domElement.dataset.paused = String(!visible); if (visible) invalidate(); }, [visible, invalidate, gl]);
  useFrame(() => {
    gl.domElement.dataset.renderCount = String(++frames.current);
    queueMicrotask(() => {
      gl.domElement.dataset.dpr = String(gl.getPixelRatio());
      gl.domElement.dataset.textures = String(gl.info.memory.textures);
      gl.domElement.dataset.geometries = String(gl.info.memory.geometries);
      gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    });
  });
  return null;
}

const StoneViewer = forwardRef(function StoneViewer({ asset, model, settings, visible, onReady, onFailure, onMeasure, measuring, onInteraction }, ref) {
  const meshRef = useRef();
  const controlsRef = useRef();
  const cameraApi = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cleanupContext = useRef();
  const [contextLost, setContextLost] = useState(false);
  const dimensions = dimensionsInMeters(settings);

  useEffect(() => () => cleanupContext.current?.(), []);

  useImperativeHandle(ref, () => ({
    resetCamera() { cameraApi.current?.reset(); },
    zoom(factor) { cameraApi.current?.zoom(factor); },
    rotate(angle) { cameraApi.current?.rotate(angle); },
    inspectEdge() { cameraApi.current?.inspectEdge(); },
    async screenshot() {
      const renderer = rendererRef.current;
      if (!renderer || contextLost || !meshRef.current) throw new Error('Wait for the 3D preview to load.');
      renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      const blob = await new Promise(resolve => renderer.domElement.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not capture the preview.');
      return blob;
    },
    async exportGLB() {
      if (!meshRef.current || contextLost) throw new Error('Wait for the 3D preview to load.');
      const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
      const product = meshRef.current.clone();
      if(!model)product.position.set(0, dimensions[1] / 2, 0);else product.position.y-=.008;
      product.userData = { dimensionsCm: { width: settings.width, height: settings.height, thickness: settings.thickness }, finish: settings.finish, geometry:settings.geometry, note: model?'Validated static GLB; original mesh/material assignments and UVs preserved. Model bounds are not manufacturing verification.':'Illustrative stone geometry; unphotographed surfaces are approximated. Bump shading is preview-only; glTF does not support bump maps.' };
      const buffer = await new GLTFExporter().parseAsync(product, { binary: true, maxTextureSize: 2048 });
      return new Blob([buffer], { type: 'model/gltf-binary' });
    },
  }), [settings, contextLost, dimensions]);

  if (contextLost) return null;
  return <WebGLErrorBoundary onFailure={onFailure}>
    <Canvas shadows dpr={[1, 1.5]} frameloop={visible ? 'demand' : 'never'} camera={{ position: [3, 2, 6], fov: 36 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'default' }} onCreated={state => {
      rendererRef.current = state.gl;
      sceneRef.current = state;
      const canvas = state.gl.domElement;
      function lost(event) { event.preventDefault(); setContextLost(true); onFailure(); }
      canvas.addEventListener('webglcontextlost', lost);
      cleanupContext.current = () => canvas.removeEventListener('webglcontextlost', lost);
      state.gl.shadowMap.type = PCFSoftShadowMap;
      state.gl.toneMappingExposure = 1;
    }}>
      <RenderBudget visible={visible} />
      <color attach="background" args={['#eaeae3']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 4]} intensity={settings.preset==='neutral'?1.8:2.2} color={settings.preset==='neutral'?'#ffffff':'#fff5e6'} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-bias={-0.0003} shadow-normalBias={0.015} />
      <directionalLight position={[-4, 3, 1]} intensity={0.6} color="#e4edff" />
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={3} position={[-3, 4, 2]} scale={[5, 5, 1]} rotation={[0, Math.PI / 4, 0]} />
          <Lightformer intensity={2} position={[3, 2, 4]} scale={[2, 5, 1]} rotation={[0, -Math.PI / 4, 0]} />
          <Lightformer intensity={1.5} position={[0, 5, -3]} scale={[5, 2, 1]} rotation={[Math.PI / 2, 0, 0]} />
        </Environment>
        {model ? <CustomModel model={model} meshRef={meshRef} onReady={onReady}/> : asset && <Stone asset={asset} settings={settings} meshRef={meshRef} onReady={onReady} />}
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={24} blur={2} far={12} resolution={1024} frames={1} color="#383b2c" />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <OrbitControls ref={controlsRef} makeDefault enabled={visible} enablePan={false} enableDamping={false} minPolarAngle={0.08} maxPolarAngle={Math.PI * 0.91} onStart={()=>onInteraction?.(true)} onEnd={()=>onInteraction?.(false)} />
      <CameraRig settings={settings} controlsRef={controlsRef} cameraApi={cameraApi} />
      <DimensionProjection meshRef={meshRef} onMeasure={onMeasure} measuring={visible&&measuring}/>
    </Canvas>
  </WebGLErrorBoundary>;
});

export default StoneViewer;
