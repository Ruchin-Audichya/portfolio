"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { profile } from "@/data/profile";

/* ═══════════════════════════════════════════════════════════════════
   GLSL SHADERS
   ═══════════════════════════════════════════════════════════════════ */

// ── Perlin noise (Classic 3D) ──────────────────────────────────────
const perlinChunk = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.0);
  Pi0=mod(Pi0,289.0);Pi1=mod(Pi1,289.0);
  vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.0);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0/7.0;vec4 gy0=fract(floor(gx0)/7.0)-0.5;gx0=fract(gx0);
  vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.0));
  gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1/7.0;vec4 gy1=fract(floor(gx1)/7.0)-0.5;gx1=fract(gx1);
  vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.0));
  gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  return mix(n_yz.x,n_yz.y,fade_xyz.x)*2.2;
}`;

// ── 1. Noise pre-bake shaders ──────────────────────────────────────
const noiseVert = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

const noiseFrag = /* glsl */ `
${perlinChunk}
varying vec2 vUv;
void main(){
  vec3 p=vec3(vUv,0.0);
  gl_FragColor=vec4(
    cnoise(p* 5.0)*0.5+0.5,
    cnoise(p*10.0)*0.5+0.5,
    cnoise(p*20.0)*0.5+0.5,
    cnoise(p*40.0)*0.5+0.5
  );
}`;

// ── 2. Accretion disk shaders ──────────────────────────────────────
const diskVert = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

const diskFrag = /* glsl */ `
uniform sampler2D uNoise;
uniform sampler2D uGradient;
uniform float uTime;
varying vec2 vUv;

void main(){
  vec2 uv=vUv;
  vec4 n=vec4(
    texture2D(uNoise,uv-uTime*0.10).r,
    texture2D(uNoise,uv-uTime*0.08).g,
    texture2D(uNoise,uv-uTime*0.06).b,
    texture2D(uNoise,uv-uTime*0.04).a
  );
  float noiseLen=length(n);

  // falloffs
  float outer=smoothstep(0.0,0.4,uv.y);          // [0.4→0]→[1→0]
  float inner=1.0-smoothstep(0.95,1.0,uv.y);     // [0.95→1]→[0→1] inverted
  float falloff=min(outer,inner);

  float y=uv.y+noiseLen*0.4;
  y*=falloff;

  vec4 grad=texture2D(uGradient,vec2(0.5,clamp(y,0.0,1.0)));
  grad.a=y;
  gl_FragColor=grad;
}`;

// ── 3. Stars shaders ───────────────────────────────────────────────
const starVert = /* glsl */ `
attribute float size;
attribute vec3 customColor;
varying vec3 vColor;
void main(){
  vColor=customColor;
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  gl_PointSize=size*(300.0/-mv.z);
  gl_Position=projectionMatrix*mv;
}`;

const starFrag = /* glsl */ `
varying vec3 vColor;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=length(c);
  float alpha=0.02/d*(1.0-d*2.0);
  if(alpha<0.01) discard;
  gl_FragColor=vec4(vColor,alpha);
}`;

// ── 4. Distortion-hole shader (billboard facing camera) ────────────
const holeVert = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

const holeFrag = /* glsl */ `
varying vec2 vUv;
void main(){
  float d=distance(vUv,vec2(0.5));
  float s=1.0-smoothstep(0.2,0.5,d);
  gl_FragColor=vec4(vec3(s),1.0);
}`;

// ── 5. Distortion-disc shader (horizontal plane) ───────────────────
const discFrag = /* glsl */ `
varying vec2 vUv;
void main(){
  float d=distance(vUv,vec2(0.5));
  float s=1.0-smoothstep(0.2/3.0,0.5/3.0,d);
  gl_FragColor=vec4(vec3(s),1.0);
}`;

// ── 6. Post-processing composite shader ────────────────────────────
const postVert = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

const postFrag = /* glsl */ `
uniform sampler2D uScene;
uniform sampler2D uDistortion;
uniform vec2 uConvergence;
uniform float uTime;
uniform bool uDither;
varying vec2 vUv;

float random2d(vec2 co){return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);}

float bayerDither(vec2 pos){
  int x=int(mod(pos.x,4.0));
  int y=int(mod(pos.y,4.0));
  int i=x+y*4;
  float v=0.0;
  if(i==0)v=0.0;else if(i==1)v=8.0;else if(i==2)v=2.0;else if(i==3)v=10.0;
  else if(i==4)v=12.0;else if(i==5)v=4.0;else if(i==6)v=14.0;else if(i==7)v=6.0;
  else if(i==8)v=3.0;else if(i==9)v=11.0;else if(i==10)v=1.0;else if(i==11)v=9.0;
  else if(i==12)v=15.0;else if(i==13)v=7.0;else if(i==14)v=13.0;else if(i==15)v=5.0;
  return v/16.0;
}

void main(){
  // sample distortion
  float dist=texture2D(uDistortion,vUv).r;
  vec2 dir=uConvergence-vUv;
  vec2 uvD=vUv+dir*dist*0.3;

  // vignette strength
  float vd=distance(vUv,vec2(0.5));
  float vig=smoothstep(0.3,0.7,vd);

  // chromatic aberration
  float caStr=0.02*vig;
  float r=texture2D(uScene,uvD+vec2(cos( 0.0),sin( 0.0))*caStr).r;
  float g=texture2D(uScene,uvD+vec2(cos( 2.1),sin( 2.1))*caStr).g;
  float b=texture2D(uScene,uvD+vec2(cos(-2.1),sin(-2.1))*caStr).b;
  vec3 col=vec3(r,g,b);

  // film grain
  float gray=dot(col,vec3(0.299,0.587,0.114));
  col+=(random2d(vUv+uTime)-0.5)*gray*0.5;

  // vignette darken
  col*=1.0-vig*0.6;

  if(uDither){
    float lum=dot(col,vec3(0.299,0.587,0.114));
    lum=1.0-lum;
    float th=bayerDither(gl_FragCoord.xy);
    float bw=step(th,lum);
    col=vec3(1.0-bw);
  }

  gl_FragColor=vec4(col,1.0);
}`;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface BlackHoleSceneProps {
  scrollProgress?: number;
}

export default function BlackHoleScene({ scrollProgress = 0 }: BlackHoleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ditherEnabled, setDitherEnabled] = useState(false);
  const ditherRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  // Keep ref in sync
  useEffect(() => {
    ditherRef.current = ditherEnabled;
  }, [ditherEnabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ── renderer ──────────────────────────────────────────────── */
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    /* ── camera ─────────────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 500);
    camera.position.set(0, 3, 10);
    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);

    /* ── orbit controls ─────────────────────────────────────────── */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.zoomSpeed = 0.4;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // WebGL wrapping/filter constants (typed as any to work around outdated @types/three)
    const _RepeatWrapping: any = 1000;
    const _ClampToEdge: any = 1001;
    const _LinearFilter: any = 1006;
    const mkRT = (w: number, h: number, float = false) =>
      new THREE.WebGLRenderTarget(w, h, {
        type: float ? THREE.FloatType : THREE.UnsignedByteType,
        wrapS: float ? _RepeatWrapping : _ClampToEdge,
        wrapT: float ? _RepeatWrapping : _ClampToEdge,
        minFilter: _LinearFilter,
        magFilter: _LinearFilter,
      });

    const noiseRT = mkRT(256, 256, true);
    let defaultRT = mkRT(W(), H());
    let distortionRT = mkRT(W(), H());

    /* ═══════════════════════════════════════════════════════════════
       NOISE PRE-BAKE
       ═══════════════════════════════════════════════════════════════ */
    const noiseScene = new THREE.Scene();
    const noiseCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const noiseQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: noiseVert,
        fragmentShader: noiseFrag,
      })
    );
    noiseScene.add(noiseQuad);
    renderer.setRenderTarget(noiseRT);
    renderer.clear();
    renderer.render(noiseScene, noiseCam);
    renderer.setRenderTarget(null);

    /* ═══════════════════════════════════════════════════════════════
       GRADIENT TEXTURE (canvas)
       ═══════════════════════════════════════════════════════════════ */
    const gradCanvas = document.createElement("canvas");
    gradCanvas.width = 1;
    gradCanvas.height = 128;
    const gctx = gradCanvas.getContext("2d")!;
    const grd = gctx.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0.0, "#fffbf9");
    grd.addColorStop(0.1, "#ffbc68");
    grd.addColorStop(0.2, "#ff5600");
    grd.addColorStop(0.4, "#ff0053");
    grd.addColorStop(0.8, "#cc00ff");
    gctx.fillStyle = grd;
    gctx.fillRect(0, 0, 1, 128);
    const gradTex = new THREE.CanvasTexture(gradCanvas);

    /* ═══════════════════════════════════════════════════════════════
       MAIN SCENE
       ═══════════════════════════════════════════════════════════════ */
    const mainScene = new THREE.Scene();
    mainScene.add(cameraGroup);

    // ── accretion disk ──
    const diskGeo = new THREE.CylinderGeometry(1.5, 6, 0, 64, 8, true);
    const diskMat = new THREE.ShaderMaterial({
      vertexShader: diskVert,
      fragmentShader: diskFrag,
      uniforms: {
        uNoise: { value: noiseRT.texture },
        uGradient: { value: gradTex },
        uTime: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    mainScene.add(disk);

    // ── stars ──
    const STAR_COUNT = isMobile ? 5000 : 10000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starColors = new Float32Array(STAR_COUNT * 3);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      // uniform sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 400;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      starSizes[i] = 0.5 + Math.random() * 30;
      tmpColor.setHSL(Math.random(), 1.0, 0.8 + Math.random() * 0.2);
      starColors[i * 3] = tmpColor.r;
      starColors[i * 3 + 1] = tmpColor.g;
      starColors[i * 3 + 2] = tmpColor.b;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute("customColor", new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      transparent: true,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    mainScene.add(stars);

    /* ═══════════════════════════════════════════════════════════════
       DISTORTION SCENE
       ═══════════════════════════════════════════════════════════════ */
    const distScene = new THREE.Scene();

    // hole quad — billboards each frame
    const holeMat = new THREE.ShaderMaterial({
      vertexShader: holeVert,
      fragmentShader: holeFrag,
      transparent: true,
    });
    const holeMesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), holeMat);
    distScene.add(holeMesh);

    // disc quad — horizontal
    const discMat = new THREE.ShaderMaterial({
      vertexShader: holeVert,
      fragmentShader: discFrag,
      transparent: true,
    });
    const discMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), discMat);
    discMesh.rotation.x = -Math.PI / 2;
    distScene.add(discMesh);

    /* ═══════════════════════════════════════════════════════════════
       POST-PROCESSING SCENE
       ═══════════════════════════════════════════════════════════════ */
    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      vertexShader: postVert,
      fragmentShader: postFrag,
      uniforms: {
        uScene: { value: defaultRT.texture },
        uDistortion: { value: distortionRT.texture },
        uConvergence: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uDither: { value: false },
      },
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
    postScene.add(postQuad);

    /* ═══════════════════════════════════════════════════════════════
       ANIMATION
       ═══════════════════════════════════════════════════════════════ */
    const clock = new THREE.Clock();
    let animId = 0;
    const clearMain = new THREE.Color(0x130e16);
    const clearDist = new THREE.Color(0x000000);

    // project origin to screen for convergence
    const origin = new THREE.Vector3(0, 0, 0);
    const projVec = new THREE.Vector3();

    setLoaded(true);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      controls.update();

      // slow camera roll
      camera.rotateZ(0.002);

      // subtle drift
      cameraGroup.position.x = Math.sin(Math.sin(t * 0.3) * 0.5) * 0.1;
      cameraGroup.position.y = Math.sin(Math.sin(t * 0.4) * 0.7) * 0.1;
      cameraGroup.position.z = Math.sin(Math.sin(t * 0.2) * 0.6) * 0.1;

      // billboard the hole quad
      holeMesh.lookAt(camera.position);

      // uniforms
      diskMat.uniforms.uTime.value = t;
      postMat.uniforms.uTime.value = t;
      postMat.uniforms.uDither.value = ditherRef.current;

      // convergence point
      projVec.copy(origin).project(camera);
      postMat.uniforms.uConvergence.value.set(
        (projVec.x + 1) * 0.5,
        (projVec.y + 1) * 0.5
      );

      // 1. render main to screen (for direct viewing while post-proc composites)
      renderer.setRenderTarget(null);
      renderer.setClearColor(clearMain, 1);
      renderer.clear();
      renderer.render(mainScene, camera);

      // also render distortion to screen overlaid (transparent blend)
      renderer.render(distScene, camera);

      // 2. render main scene → rt
      renderer.setRenderTarget(defaultRT);
      renderer.setClearColor(clearMain, 1);
      renderer.clear();
      renderer.render(mainScene, camera);

      // 3. render distortion scene → rt
      renderer.setRenderTarget(distortionRT);
      renderer.setClearColor(clearDist, 1);
      renderer.clear();
      renderer.render(distScene, camera);

      // 4. post-processing → screen
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(postScene, postCam);
    };

    animate();

    /* ── resize ──────────────────────────────────────────────────── */
    const onResize = () => {
      const w = W();
      const h = H();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      defaultRT.setSize(w, h);
      distortionRT.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── cleanup ─────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      noiseRT.dispose();
      defaultRT.dispose();
      distortionRT.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ═══════════════════════════════════════════════════════════════
     RENDER — HTML OVERLAY
     ═══════════════════════════════════════════════════════════════ */
  const firstName = profile.name.split(" ")[0];
  const lastName = profile.name.split(" ")[1];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* ── Main text overlay ── */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-[2000ms] ${loaded ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Subtle radial fade behind text for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)",
          }}
        />

        {/* Name */}
        <div className="relative text-center mb-4">
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-display font-bold tracking-[-0.04em] text-white/95 leading-none"
            style={{
              textShadow:
                "0 0 80px rgba(255,86,0,0.3), 0 0 160px rgba(204,0,255,0.15)",
              animationDelay: "0.2s",
            }}
          >
            {firstName?.toUpperCase()}
          </h1>
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-display font-bold tracking-[-0.04em] leading-none mt-1 md:mt-2"
            style={{
              background: "linear-gradient(135deg, #fffbf9 0%, #ffbc68 40%, #ff5600 70%, #cc00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 40px rgba(255,86,0,0.25))",
            }}
          >
            {lastName?.toUpperCase()}
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="relative text-sm sm:text-base md:text-lg text-white/70 font-body tracking-[0.2em] uppercase mb-8"
          style={{
            textShadow: "0 0 20px rgba(255,188,104,0.2)",
          }}
        >
          {profile.role}
        </p>

        {/* Badges */}
        <div className="relative flex flex-wrap justify-center gap-2 md:gap-3 max-w-xl px-4">
          {profile.badges.map((badge, i) => (
            <span
              key={badge}
              className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-mono uppercase tracking-wider rounded-full border backdrop-blur-md"
              style={{
                borderColor: "rgba(255,188,104,0.25)",
                background: "rgba(19,14,22,0.6)",
                color: "rgba(255,251,249,0.8)",
                textShadow: "0 0 8px rgba(255,86,0,0.3)",
                animationDelay: `${0.5 + i * 0.1}s`,
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll CTA ── */}
      <div
        className={`absolute inset-x-0 bottom-8 z-20 flex justify-center pointer-events-none transition-opacity duration-[2000ms] ${loaded ? "opacity-100" : "opacity-0"
          }`}
        style={{ transitionDelay: "1s" }}
      >
        <a
          href="#about"
          className="pointer-events-auto group flex items-center gap-2 rounded-full px-6 py-3 font-bold uppercase tracking-wider shadow-lg transition-all duration-300 text-sm"
          style={{
            background: "rgba(255,251,249,0.95)",
            color: "#0a0a0f",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background =
              "linear-gradient(135deg, #ff5600, #cc00ff)";
            (e.target as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background =
              "rgba(255,251,249,0.95)";
            (e.target as HTMLElement).style.color = "#0a0a0f";
          }}
        >
          <span>View Portfolio</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>

      {/* ── Dither toggle ── */}
      <div
        className="absolute bottom-8 right-4 z-30"
      >
        <label
          className="flex items-center gap-2 rounded-full px-4 py-2 cursor-pointer select-none text-xs font-mono uppercase tracking-wider"
          style={{
            background: "rgba(19,14,22,0.7)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,251,249,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <input
            type="checkbox"
            checked={ditherEnabled}
            onChange={(e) => setDitherEnabled(e.target.checked)}
            className="accent-orange-500 w-3 h-3"
          />
          Dither
        </label>
      </div>

      {/* ── Bottom name badge ── */}
      <div className="absolute left-4 bottom-20 z-10 pointer-events-none">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] shadow-lg backdrop-blur"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "rgba(255,251,249,0.9)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>{profile.name}</span>
          <span className="hidden sm:inline" style={{ color: "rgba(255,251,249,0.5)" }}>
            {profile.role}
          </span>
        </div>
      </div>
    </div>
  );
}
