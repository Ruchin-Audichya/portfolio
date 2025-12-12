#!/usr/bin/env bash
# Placeholder helper to document how to fetch assets legally.
# Do not run blindly; fill in with real, license-compliant URLs.

set -euo pipefail

# Example: fetch a CC0 HDRI from Poly Haven
# curl -L "https://example.com/hdris/sky_4k.hdr" -o public/assets/3d/processed/sky_4k.hdr

# Example: fetch a downloadable GLB from Sketchfab after verifying license
# curl -L "https://example.com/models/model.glb" -o public/assets/3d/processed/model.glb

# Note: Place decoders if self-hosting
# mkdir -p public/assets/3d/decoders
# curl -L "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js" -o public/assets/3d/decoders/draco_decoder.js
# curl -L "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js" -o public/assets/3d/decoders/draco_wasm_wrapper.js
# curl -L "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm" -o public/assets/3d/decoders/draco_decoder.wasm

# Reminder: Keep raw downloads out of git; only optimized/cleared assets belong in `processed/`.
