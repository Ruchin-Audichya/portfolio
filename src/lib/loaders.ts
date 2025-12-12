import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader, DRACOLoader, KTX2Loader } from "three-stdlib";
import { Mesh, MeshStandardMaterial, BoxGeometry, SphereGeometry, Group } from "three";

export type LoaderOptions = {
  dracoPath?: string | null;
  ktx2Path?: string | null;
  reuseMaterials?: boolean;
};

/**
 * Cached GLTF loader with optional DRACO + KTX2 support.
 * Pass dracoPath/ktx2Path as `null` to disable those decoders.
 */
export function useGLTFCached(url: string, options: LoaderOptions = {}) {
  const { gl } = useThree();

  return useLoader(
    GLTFLoader,
    url,
    (loader) => {
      const gltfLoader = loader as GLTFLoader;

      if (options.dracoPath !== null) {
        const draco = new DRACOLoader();
        draco.setDecoderPath(options.dracoPath ?? "/assets/3d/decoders/");
        gltfLoader.setDRACOLoader(draco);
      }

      if (options.ktx2Path !== null) {
        const ktx2 = new KTX2Loader();
        ktx2.setTranscoderPath(options.ktx2Path ?? "/assets/3d/decoders/");
        ktx2.detectSupport(gl);
        gltfLoader.setKTX2Loader(ktx2);
      }
    }
  );
}

/** Preload a list of GLBs ahead of time. */
/** Lightweight placeholder mesh for LOD fallbacks while heavy GLBs stream in. */
export function createPlaceholder(kind: "box" | "sphere" = "box", scale = 1): Group {
  const material = new MeshStandardMaterial({ color: "#9ca3af", roughness: 0.9, metalness: 0 });
  const mesh = new Mesh(
    kind === "box" ? new BoxGeometry(scale, scale, scale) : new SphereGeometry(scale * 0.6, 12, 12),
    material
  );
  const group = new Group();
  group.add(mesh);
  return group;
}
