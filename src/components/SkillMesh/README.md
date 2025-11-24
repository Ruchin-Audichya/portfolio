```tsx
// Example usage in a Skills section component:

import { SkillMeshProvider } from "@/components/SkillMesh/SkillMeshContext";
import { SkillMesh } from "@/components/SkillMesh/SkillMesh";
import { SkillList } from "@/components/SkillMesh/SkillList";
import { Canvas } from "@react-three/fiber";

export function SkillsSection() {
  return (
    <SkillMeshProvider>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 3D Visualization */}
        <div className="h-[600px] rounded-xl border border-white/10 bg-black/20 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <SkillMesh />
          </Canvas>
        </div>
        
        {/* 2D Searchable List */}
        <SkillList />
      </div>
    </SkillMeshProvider>
  );
}
```

# Patch 3: Integration Guide

## Files Created
1. `SkillMeshContext.tsx` - Shared state provider
2. `SkillList.tsx` - 2D searchable skill list  
3. Updated `SkillMesh.tsx` - Connected to context

## How to Use

Wrap both the 3D `SkillMesh` and 2D `SkillList` in the `SkillMeshProvider`:

```tsx
<SkillMeshProvider>
  <Canvas><SkillMesh /></Canvas>
  <SkillList />
</SkillMeshProvider>
```

## Features
- **Bidirectional Sync**: Click 3D → highlights 2D badge, click 2D → camera focuses 3D node
- **Search Filtering**: Type in search → dims non-matching nodes in 3D
- **Keyboard Navigation**: Tab through badges, Enter to select
- **Auto-scroll**: Selecting in 3D scrolls the 2D list to that skill
