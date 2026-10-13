import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { StoneConfiguration } from '@/lib/product';
import type { PreparedImage } from './images';
export type ViewerApi = { resetCamera(): void; zoom(factor: number): void; rotate(angle: number): void; inspectEdge(): void; screenshot(): Promise<Blob>; exportGLB(): Promise<Blob> };
declare const StoneViewer: ForwardRefExoticComponent<{ asset: PreparedImage; settings: StoneConfiguration & { roughness: number; bump: number;metalness?:number;preset?:string }; visible: boolean; onReady(): void; onFailure(): void } & RefAttributes<ViewerApi>>;
export default StoneViewer;
