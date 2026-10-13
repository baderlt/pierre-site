import { Component, Suspense, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { MathUtils, PCFSoftShadowMap, Vector3 } from 'three';
import { createStoneResources, dimensionsInMeters } from './stone.js';

function Stone({ asset, settings, meshRef }) {
  const { gl, invalidate } = useThree();
  // Material sliders mutate existing materials; only dimensions replace geometry.
  const resource = useMemo(() => createStoneResources(asset, settings, Math.min(8, gl.capabilities.getMaxAnisotropy())), [asset, gl, settings.width, settings.height, settings.thickness]);
  useLayoutEffect(() => () => resource.dispose(), [resource]);
  useLayoutEffect(() => {
    resource.materials.forEach(material => {
      material.roughness = settings.roughness;
      material.bumpScale = settings.bump * 0.003;
      const clearcoat = settings.finish === 'polished' ? 0.32 : settings.finish === 'honed' ? 0.04 : 0;
      if (Boolean(material.clearcoat) !== Boolean(clearcoat)) material.needsUpdate = true;
      material.clearcoat = clearcoat;
      material.envMapIntensity = settings.finish === 'polished' ? 0.9 : 0.6;
    });
    invalidate();
  }, [resource, settings.roughness, settings.bump, settings.finish, invalidate]);
  useLayoutEffect(() => {
    resource.materials.forEach((material, face) => {
      const [width, height, depth] = resource.dimensions;
      const repeat = face < 2 ? [depth / width, 1] : face < 4 ? [1, depth / height] : [1, 1];
      for (const texture of [material.map, material.bumpMap]) {
        texture.repeat.set(repeat[0] * settings.scale, repeat[1] * settings.scale);
        texture.rotation = MathUtils.degToRad(settings.rotation);
      }
    });
    invalidate();
  }, [resource, settings.scale, settings.rotation, invalidate]);
  return <mesh ref={meshRef} name="TIME STONE product — approximate hidden surfaces" geometry={resource.geometry} material={resource.materials} position={[0, resource.dimensions[1] / 2 + 0.008, 0]} castShadow receiveShadow dispose={null} />;
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

class WebGLErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() {
    if (this.state.failed) return <div className="viewer-fallback"><strong>3D preview is unavailable</strong><p>Enable hardware acceleration or try a WebGL-capable browser.</p><button className="button secondary" onClick={() => window.location.reload()}>Reload viewer</button></div>;
    return this.props.children;
  }
}

const StoneViewer = forwardRef(function StoneViewer({ asset, settings, autoRotate, onReady, onFailure }, ref) {
  const meshRef = useRef();
  const controlsRef = useRef();
  const cameraApi = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const [contextLost, setContextLost] = useState(false);
  const dimensions = dimensionsInMeters(settings);

  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;
    function lost(event) { event.preventDefault(); setContextLost(true); onFailure(); }
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [asset, onFailure]);

  useImperativeHandle(ref, () => ({
    resetCamera() { cameraApi.current?.reset(); },
    zoom(factor) { cameraApi.current?.zoom(factor); },
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
      product.position.set(0, dimensions[1] / 2, 0);
      product.userData = { dimensionsCm: { width: settings.width, height: settings.height, thickness: settings.thickness }, finish: settings.finish, note: 'Side and rear surfaces are approximated from one photograph. Bump shading is preview-only; glTF does not support bump maps.' };
      const buffer = await new GLTFExporter().parseAsync(product, { binary: true, maxTextureSize: 2048 });
      return new Blob([buffer], { type: 'model/gltf-binary' });
    },
  }), [settings, contextLost, dimensions]);

  if (contextLost) return <div className="viewer-fallback"><strong>The graphics context was interrupted.</strong><p>Reload to restore the 3D studio. Your photograph stays local.</p><button className="button secondary" onClick={() => window.location.reload()}>Reload viewer</button></div>;
  return <WebGLErrorBoundary onFailure={onFailure}>
    <Canvas shadows dpr={[1, 1.5]} frameloop={autoRotate ? 'always' : 'demand'} camera={{ position: [3, 2, 6], fov: 36 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }} onCreated={state => {
      rendererRef.current = state.gl;
      sceneRef.current = state;
      state.gl.shadowMap.type = PCFSoftShadowMap;
      state.gl.toneMappingExposure = 1;
      onReady();
    }} fallback={<span>Interactive stone model. Drag to orbit and scroll or pinch to zoom. A WebGL-capable browser is required.</span>}>
      <color attach="background" args={['#eaeae3']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#fff5e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-bias={-0.0003} shadow-normalBias={0.015} />
      <directionalLight position={[-4, 3, 1]} intensity={0.6} color="#e4edff" />
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={3} position={[-3, 4, 2]} scale={[5, 5, 1]} rotation={[0, Math.PI / 4, 0]} />
          <Lightformer intensity={2} position={[3, 2, 4]} scale={[2, 5, 1]} rotation={[0, -Math.PI / 4, 0]} />
          <Lightformer intensity={1.5} position={[0, 5, -3]} scale={[5, 2, 1]} rotation={[Math.PI / 2, 0, 0]} />
        </Environment>
        {asset && <Stone asset={asset} settings={settings} meshRef={meshRef} />}
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={24} blur={2} far={12} resolution={1024} frames={1} color="#383b2c" />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <OrbitControls ref={controlsRef} makeDefault enablePan={false} enableDamping dampingFactor={0.08} autoRotate={autoRotate} autoRotateSpeed={0.65} minPolarAngle={0.08} maxPolarAngle={Math.PI * 0.91} />
      <CameraRig settings={settings} controlsRef={controlsRef} cameraApi={cameraApi} />
    </Canvas>
  </WebGLErrorBoundary>;
});

export default StoneViewer;
