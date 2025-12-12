# 3D Asset Pipeline

Use this folder to store legally-sourced, optimized assets (GLB/GLTF, KTX2 textures). Do **not** check in copyrighted assets.

## Recommended sources
- Sketchfab (filter: Downloadable, glTF/GLB; license-compliant)
- Poly Haven (CC0 HDRIs/textures)
- ambientCG (CC0 PBR sets)
- Mixamo (rigged characters; export as FBX/GLB)

## Download workflow (manual)
1) Pick an asset and verify license permits redistribution in your project.
2) Export as GLB/GLTF with baked animations if available.
3) Place raw downloads in `public/assets/3d/raw/` (gitignored if you add `.gitignore`).
4) Optimize/compress (see below) and place final GLB/KTX2 in `public/assets/3d/processed/`.

## Optimization checklist
- Mesh: remove unused nodes/materials; merge meshes where possible.
- Textures: resize to the minimum acceptable size; convert to KTX2/Basis.
- Materials: prefer Standard/Physical; avoid excessive shader complexity.
- Animation: trim clips; bake keyframes; remove constraints if not needed.

## Compression commands
- DRACO (geometry): `npx gltf-pipeline -i input.glb -o output-draco.glb -d`
- KTX2 (textures): `npx gltf-transform etc2 input.glb output-ktx2.glb`
- Basis via toktx: `toktx --target_type R --bcmp --2d --force_array --genmipmap output.ktx2 input.png`
- Full optimize (gltf-transform):
  ```bash
  npx gltf-transform optimize input.glb output-optimized.glb \
    --draco.mesh.compressionLevel 7 \
    --texture-compress webp \
    --texture-size 2048
  ```

## Folder convention
- `processed/`: ship-ready assets (GLB with DRACO + KTX2, low/high LODs)
- `raw/`: originals (optional, gitignored)
- `decoders/`: optional Draco/KTX2 decoder files if hosting locally

## Notes
- Keep a low-poly placeholder for every heavy asset (box/icosahedron) to allow LOD swaps.
- If you host assets on CDN (S3/Cloudflare), mirror the same structure and update URLs.
- Document source URL, license, and author for each asset in your PR/CHANGELOG.
