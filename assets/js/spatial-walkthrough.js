/**
 * DM with SAIFUL — 3D Architectural Walkthrough Engine
 * Continuous interior-to-panoramic drone flythrough across agency sectors.
 * Powered by Three.js (r128).
 */
(function() {
  'use strict';

  // Check WebGL availability and user preference
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.THREE || reduce()) {
    console.log('[SpatialEngine] Motion reduced or Three.js missing, fallback mode.');
    return;
  }

  const THREE = window.THREE;

  // Scene setup
  let scene, camera, renderer, container;
  let canvas, animId;
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Telemetry & Sectors
  const sectors = [
    { name: 'SECTOR 01 // MAIN ATRIUM', range: [0, 0.20], code: 'ATR-01' },
    { name: 'SECTOR 02 // EXHIBITION GALLERY', range: [0.20, 0.45], code: 'EXH-02' },
    { name: 'SECTOR 03 // PERFORMANCE MATRIX', range: [0.45, 0.68], code: 'MTX-03' },
    { name: 'SECTOR 04 // COMMAND ROTUNDA', range: [0.68, 0.86], code: 'CMD-04' },
    { name: 'SECTOR 05 // SKYLINE HORIZON APERTURE', range: [0.86, 1.0], code: 'SKY-05' }
  ];

  // Camera trajectory spline points (Flythrough inside the building to the window overview)
  const trajectory = [
    { p: 0.00, pos: new THREE.Vector3(0, 5, 80),     look: new THREE.Vector3(0, 5, -80) },
    { p: 0.12, pos: new THREE.Vector3(0, 6, -20),    look: new THREE.Vector3(0, 6, -180) },
    { p: 0.22, pos: new THREE.Vector3(-14, 7, -180), look: new THREE.Vector3(12, 6, -340) },
    { p: 0.35, pos: new THREE.Vector3(14, 8, -340),  look: new THREE.Vector3(-8, 7, -500) },
    { p: 0.48, pos: new THREE.Vector3(0, 16, -520),  look: new THREE.Vector3(0, 4, -720) },
    { p: 0.60, pos: new THREE.Vector3(0, 9, -720),   look: new THREE.Vector3(0, 8, -940) },
    { p: 0.72, pos: new THREE.Vector3(10, 11, -940), look: new THREE.Vector3(-10, 12, -1140) },
    { p: 0.84, pos: new THREE.Vector3(0, 9, -1160),  look: new THREE.Vector3(0, 10, -1420) },
    { p: 0.94, pos: new THREE.Vector3(0, 12, -1400), look: new THREE.Vector3(0, 14, -1800) },
    { p: 1.00, pos: new THREE.Vector3(0, 20, -1700), look: new THREE.Vector3(0, 25, -2400) }
  ];

  // Motion state
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let currentPos = new THREE.Vector3().copy(trajectory[0].pos);
  let currentLook = new THREE.Vector3().copy(trajectory[0].look);
  let hudSectorEl, hudCoordsEl;

  // Scene Objects
  let kineticRings = [];
  let architecturalFrames = [];
  let dataMonoliths = [];
  let neonGridFloor;
  let particlesMesh;
  let windowAperture;
  let skylineGroup;
  let lightConduits = [];

  function init() {
    // Canvas container
    container = document.createElement('div');
    container.id = 'spatial-viewport';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;overflow:hidden;';
    
    // WebGL Canvas
    canvas = document.createElement('canvas');
    canvas.id = 'spatial-canvas';
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    document.body.prepend(container);

    // Create Architectural HUD overlay
    createHUD();

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x041315);
    scene.fog = new THREE.FogExp2(0x041315, 0.0022);

    // Camera
    camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 3500);
    camera.position.copy(currentPos);
    camera.lookAt(currentLook);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (renderer.toneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }

    // Lights
    buildLighting();

    // Architectural Environments
    buildArchitecturalCorridor();
    buildMainAtrium();
    buildWorkGallery();
    buildPerformanceMatrix();
    buildCommandRotunda();
    buildSkylineAperture();
    buildAtmosphericDust();

    // Events
    bindEvents();

    // Start render loop
    render();
  }

  function createHUD() {
    const hud = document.createElement('div');
    hud.className = 'spatial-hud';
    hud.innerHTML = `
      <div class="hud-left">
        <span class="hud-badge"><i class="hud-dot"></i> 3D SPATIAL ENGINE</span>
        <span class="hud-sector" id="hud-sector-text">SECTOR 01 // MAIN ATRIUM</span>
      </div>
      <div class="hud-right">
        <span class="hud-coords" id="hud-coords-text">POS: [X: 0.0, Y: 5.0, Z: 80.0m]</span>
        <div class="hud-nav" id="hud-nav-pills">
          <button type="button" data-jump="0" class="on" title="Sector 1: Atrium">01</button>
          <button type="button" data-jump="0.25" title="Sector 2: Gallery">02</button>
          <button type="button" data-jump="0.52" title="Sector 3: Matrix">03</button>
          <button type="button" data-jump="0.75" title="Sector 4: Rotunda">04</button>
          <button type="button" data-jump="0.96" title="Sector 5: Skyline">05</button>
          <button type="button" id="hud-audio-btn" class="hud-audio-pill" title="Toggle audio feedback">FX: <span id="hud-audio-txt">OFF</span></button>
        </div>
      </div>
    `;
    document.body.appendChild(hud);
    hudSectorEl = document.getElementById('hud-sector-text');
    hudCoordsEl = document.getElementById('hud-coords-text');

    // Audio feedback toggle button
    const audioBtn = hud.querySelector('#hud-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.AudioFX) {
          const on = window.AudioFX.toggle();
          const txt = document.getElementById('hud-audio-txt');
          if (txt) txt.textContent = on ? 'ON' : 'OFF';
          audioBtn.classList.toggle('audio-active', on);
          if (on) window.AudioFX.click();
        }
      });
    }

    // Quick jump pills
    hud.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = parseFloat(btn.dataset.jump);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: p * maxScroll,
          behavior: 'smooth'
        });
      });
    });
  }

  function buildLighting() {
    // Ambient illumination
    const ambient = new THREE.AmbientLight(0x0e3236, 1.2);
    scene.add(ambient);

    // Key directional light representing the exterior architectural sunlight/moonlight
    const keyLight = new THREE.DirectionalLight(0xe6a137, 1.8);
    keyLight.position.set(40, 90, 50);
    scene.add(keyLight);

    // Cyan accent light
    const cyanLight = new THREE.DirectionalLight(0x13c2c2, 1.4);
    cyanLight.position.set(-50, 40, -400);
    scene.add(cyanLight);

    // Horizon skylight
    const horizonLight = new THREE.PointLight(0xe69138, 3.5, 900);
    horizonLight.position.set(0, 60, -2100);
    scene.add(horizonLight);
  }

  /**
   * Continuous Architectural Floor, Ceiling, and Portal Frames
   */
  function buildArchitecturalCorridor() {
    // 1. Sleek metallic grid floor spanning all chambers (z: 120 to -2400)
    const floorGeo = new THREE.PlaneGeometry(160, 2600, 32, 120);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x064e52,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    neonGridFloor = new THREE.Mesh(floorGeo, floorMat);
    neonGridFloor.rotation.x = -Math.PI / 2;
    neonGridFloor.position.set(0, -2, -1100);
    scene.add(neonGridFloor);

    // Reflective solid floor base
    const floorSolidGeo = new THREE.PlaneGeometry(180, 2600);
    const floorSolidMat = new THREE.MeshStandardMaterial({
      color: 0x020d0f,
      roughness: 0.15,
      metalness: 0.85
    });
    const solidFloor = new THREE.Mesh(floorSolidGeo, floorSolidMat);
    solidFloor.rotation.x = -Math.PI / 2;
    solidFloor.position.set(0, -2.2, -1100);
    scene.add(solidFloor);

    // 2. Ceiling Structural Grid
    const ceilingGeo = new THREE.PlaneGeometry(140, 2400, 24, 80);
    const ceilingMat = new THREE.MeshBasicMaterial({
      color: 0x073538,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 32, -1000);
    scene.add(ceilingMesh);

    // 3. Repeated Architectural Archway Gates (Portals through the corridor)
    const gateZPositions = [50, -50, -180, -320, -480, -660, -860, -1080, -1320, -1560];
    const frameGeo = new THREE.BoxGeometry(1, 26, 1);
    const crossGeo = new THREE.BoxGeometry(42, 1, 1);
    const gateMat = new THREE.MeshStandardMaterial({
      color: 0x0b2d30,
      metalness: 0.9,
      roughness: 0.2
    });
    const neonMatCyan = new THREE.MeshBasicMaterial({ color: 0x13c2c2 });
    const neonMatGold = new THREE.MeshBasicMaterial({ color: 0xe6a137 });

    gateZPositions.forEach((zPos, idx) => {
      const gateGroup = new THREE.Group();
      
      // Left pillar
      const leftPillar = new THREE.Mesh(frameGeo, gateMat);
      leftPillar.position.set(-20, 11, 0);
      gateGroup.add(leftPillar);

      // Right pillar
      const rightPillar = new THREE.Mesh(frameGeo, gateMat);
      rightPillar.position.set(20, 11, 0);
      gateGroup.add(rightPillar);

      // Top crossbeam
      const topBeam = new THREE.Mesh(crossGeo, gateMat);
      topBeam.position.set(0, 24, 0);
      gateGroup.add(topBeam);

      // Glowing Neon Accent Strips along the beam
      const neonBeam = new THREE.Mesh(new THREE.BoxGeometry(40, 0.25, 0.25), (idx % 2 === 0) ? neonMatCyan : neonMatGold);
      neonBeam.position.set(0, 23.4, 0);
      gateGroup.add(neonBeam);

      // Lateral guidance strip on floor
      const floorStripL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 140), neonMatCyan);
      floorStripL.position.set(-18, -1.9, 0);
      gateGroup.add(floorStripL);

      const floorStripR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 140), neonMatCyan);
      floorStripR.position.set(18, -1.9, 0);
      gateGroup.add(floorStripR);

      gateGroup.position.set(0, 0, zPos);
      scene.add(gateGroup);
      architecturalFrames.push(gateGroup);
    });
  }

  /**
   * Chamber 1: Main Atrium / Entrance (Hero)
   */
  function buildMainAtrium() {
    const atriumGroup = new THREE.Group();
    atriumGroup.position.set(0, 6, 0);

    // Glowing Concentric Orbital Rings (Agency Brand Core)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xe6a137, wireframe: true });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x13c2c2, wireframe: true });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(14, 0.35, 16, 60), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(18, 0.25, 16, 72), ringMat2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(23, 0.2, 16, 80), ringMat1);

    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;

    atriumGroup.add(ring1);
    atriumGroup.add(ring2);
    atriumGroup.add(ring3);

    // Central geometric crystal monolith
    const crystalGeo = new THREE.OctahedronGeometry(4.5, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x064e52,
      emissive: 0x0d7077,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: true
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    atriumGroup.add(crystal);

    // Floating orbital nodes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const nodeGeo = new THREE.SphereGeometry(0.45, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: (i % 2 === 0) ? 0xe6a137 : 0x13c2c2 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 18, Math.sin(angle) * 8, Math.sin(angle) * 12);
      atriumGroup.add(node);
    }

    scene.add(atriumGroup);
    kineticRings.push({ group: atriumGroup, r1: ring1, r2: ring2, r3: ring3, crystal: crystal });
  }

  /**
   * Chamber 2: Selected Work Exhibition Hall
   */
  function buildWorkGallery() {
    const galleryGroup = new THREE.Group();
    galleryGroup.position.set(0, 0, -280);

    // Floating 3D Monolith Exhibition Pedestals (Representing Anzara, Azran, Elor)
    const pedestalGeo = new THREE.BoxGeometry(6, 12, 2);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x09383c,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    });
    const frameEdgeMat = new THREE.MeshBasicMaterial({ color: 0x13c2c2, wireframe: true });

    const clientProjects = [
      { x: -16, y: 7, z: -30, rotY: 0.35, label: 'ANZARA' },
      { x: 16, y: 8, z: -80, rotY: -0.4, label: 'AZRAN' },
      { x: -15, y: 7, z: -140, rotY: 0.3, label: 'ELOR' }
    ];

    clientProjects.forEach((proj) => {
      const slab = new THREE.Mesh(pedestalGeo, glassMat);
      const edge = new THREE.Mesh(pedestalGeo, frameEdgeMat);
      edge.scale.set(1.02, 1.02, 1.02);

      const projGroup = new THREE.Group();
      projGroup.add(slab);
      projGroup.add(edge);

      // Glowing hologram banner ring above each pedestal
      const haloGeo = new THREE.TorusGeometry(3.8, 0.1, 8, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xe6a137 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 7.5;
      projGroup.add(halo);

      projGroup.position.set(proj.x, proj.y, proj.z);
      projGroup.rotation.y = proj.rotY;

      galleryGroup.add(projGroup);
    });

    scene.add(galleryGroup);
  }

  /**
   * Chamber 3: Performance Matrix & Growth Engine (Services)
   */
  function buildPerformanceMatrix() {
    const matrixGroup = new THREE.Group();
    matrixGroup.position.set(0, 0, -640);

    // 4 Massive illuminated isometric data monoliths (Paid Ads, SEO, Social, Content)
    const towers = [
      { name: 'Paid Ads', x: -18, z: -40, height: 28, color: 0xe6a137 },
      { name: 'SEO Engine', x: -7, z: -100, height: 38, color: 0x13c2c2 },
      { name: 'Social Reach', x: 8, z: -60, height: 32, color: 0x13c2c2 },
      { name: 'Content Matrix', x: 19, z: -110, height: 26, color: 0xe6a137 }
    ];

    towers.forEach(t => {
      const towerGeo = new THREE.BoxGeometry(7, t.height, 7);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x052023,
        roughness: 0.2,
        metalness: 0.8
      });
      const towerWire = new THREE.Mesh(towerGeo, new THREE.MeshBasicMaterial({
        color: t.color,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      }));

      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.add(towerWire);
      tower.position.set(t.x, t.height / 2 - 2, t.z);

      // Glowing top cap
      const capGeo = new THREE.BoxGeometry(7.2, 0.6, 7.2);
      const capMat = new THREE.MeshBasicMaterial({ color: t.color });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(t.x, t.height - 2, t.z);

      matrixGroup.add(tower);
      matrixGroup.add(cap);
      dataMonoliths.push({ mesh: tower, cap: cap, baseHeight: t.height, speed: Math.random() * 0.5 + 0.5 });
    });

    // Glowing laser conduits connecting the data towers
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 22, -40),
      new THREE.Vector3(-10, 26, -70),
      new THREE.Vector3(-7, 34, -100)
    ]);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 24, 0.22, 8, false);
    const tubeMesh1 = new THREE.Mesh(tubeGeo1, new THREE.MeshBasicMaterial({ color: 0xe6a137 }));
    matrixGroup.add(tubeMesh1);

    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-7, 34, -100),
      new THREE.Vector3(2, 28, -80),
      new THREE.Vector3(8, 28, -60),
      new THREE.Vector3(19, 22, -110)
    ]);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 32, 0.22, 8, false);
    const tubeMesh2 = new THREE.Mesh(tubeGeo2, new THREE.MeshBasicMaterial({ color: 0x13c2c2 }));
    matrixGroup.add(tubeMesh2);

    scene.add(matrixGroup);
  }

  /**
   * Chamber 4: Command Rotunda (Process & Methodology)
   */
  function buildCommandRotunda() {
    const rotundaGroup = new THREE.Group();
    rotundaGroup.position.set(0, 10, -1050);

    // Circular panoramic chamber with 4 orbital rings
    const rotundaGeo = new THREE.CylinderGeometry(36, 36, 32, 32, 4, true);
    const rotundaMat = new THREE.MeshBasicMaterial({
      color: 0x053034,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const rotundaMesh = new THREE.Mesh(rotundaGeo, rotundaMat);
    rotundaGroup.add(rotundaMesh);

    // 4 Process stages rotating in orbit: Discover, Plan, Launch, Improve
    const processRings = [
      { r: 12, rotX: 0.4, rotY: 0.2, color: 0x13c2c2 },
      { r: 17, rotX: -0.3, rotY: 0.5, color: 0xe6a137 },
      { r: 22, rotX: 0.6, rotY: -0.4, color: 0x13c2c2 },
      { r: 27, rotX: -0.5, rotY: -0.3, color: 0xe6a137 }
    ];

    processRings.forEach(pr => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(pr.r, 0.2, 12, 64),
        new THREE.MeshBasicMaterial({ color: pr.color, wireframe: true })
      );
      ring.rotation.x = pr.rotX;
      ring.rotation.y = pr.rotY;
      rotundaGroup.add(ring);
    });

    scene.add(rotundaGroup);
  }

  /**
   * Chamber 5: The Grand Panoramic Window & Cyber Skyline Vista (CTA)
   * The camera flies straight through this window into the open horizon!
   */
  function buildSkylineAperture() {
    skylineGroup = new THREE.Group();
    skylineGroup.position.set(0, 0, -1450);

    // The Massive Architectural Window Frame (Transition between interior and exterior)
    const windowFrameGeo = new THREE.BoxGeometry(60, 36, 3);
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x020f12,
      roughness: 0.2,
      metalness: 0.95
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(0, 16, 0);

    // Window Mullions (Architectural glass panes)
    const mullionGeoH = new THREE.BoxGeometry(58, 0.4, 3.2);
    const mullionGeoV = new THREE.BoxGeometry(0.4, 34, 3.2);
    const mullionMat = new THREE.MeshBasicMaterial({ color: 0x13c2c2 });

    const mullionH1 = new THREE.Mesh(mullionGeoH, mullionMat);
    mullionH1.position.set(0, 10, 0);
    const mullionH2 = new THREE.Mesh(mullionGeoH, mullionMat);
    mullionH2.position.set(0, 22, 0);

    const mullionV1 = new THREE.Mesh(mullionGeoV, mullionMat);
    mullionV1.position.set(-18, 16, 0);
    const mullionV2 = new THREE.Mesh(mullionGeoV, mullionMat);
    mullionV2.position.set(18, 16, 0);

    skylineGroup.add(windowFrame);
    skylineGroup.add(mullionH1);
    skylineGroup.add(mullionH2);
    skylineGroup.add(mullionV1);
    skylineGroup.add(mullionV2);

    // EXTERIOR VISTA: Massive 3D Cyber Skyline Skyscrapers visible through & past the window!
    const cityGroup = new THREE.Group();
    cityGroup.position.set(0, -10, -250);

    const buildingCount = 55;
    const bColors = [0x051d20, 0x072b30, 0x031417, 0x093a40];

    for (let i = 0; i < buildingCount; i++) {
      const bWidth = 8 + Math.random() * 14;
      const bHeight = 35 + Math.random() * 85;
      const bDepth = 8 + Math.random() * 14;
      
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const bMat = new THREE.MeshStandardMaterial({
        color: bColors[i % bColors.length],
        roughness: 0.2,
        metalness: 0.8
      });
      const building = new THREE.Mesh(bGeo, bMat);

      // Window grid neon edges
      const wireMat = new THREE.MeshBasicMaterial({
        color: (i % 3 === 0) ? 0xe6a137 : 0x13c2c2,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wire = new THREE.Mesh(bGeo, wireMat);
      building.add(wire);

      // Position buildings scattered across the panoramic skyline horizon
      const spreadX = (Math.random() - 0.5) * 320;
      const spreadZ = -Math.random() * 450;
      building.position.set(spreadX, bHeight / 2, spreadZ);

      // Rooftop beacon lights
      if (Math.random() > 0.4) {
        const beaconGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: (Math.random() > 0.5) ? 0xe6a137 : 0xff3366 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(spreadX, bHeight + 0.6, spreadZ);
        cityGroup.add(beacon);
      }

      cityGroup.add(building);
    }

    // Glowing Sunset Horizon Sun
    const sunGeo = new THREE.SphereGeometry(50, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xe69138,
      transparent: true,
      opacity: 0.75
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 35, -750);
    cityGroup.add(sun);

    // Glowing horizon water / ground grid
    const horizonGrid = new THREE.GridHelper(600, 40, 0xe6a137, 0x064e52);
    horizonGrid.position.set(0, 0, -400);
    cityGroup.add(horizonGrid);

    skylineGroup.add(cityGroup);
    scene.add(skylineGroup);
  }

  /**
   * Ambient Floating Volumetric Dust / Cyber Motes
   */
  function buildAtmosphericDust() {
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x13c2c2);
    const c2 = new THREE.Color(0xe6a137);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = 100 - Math.random() * 2000;

      const chosenColor = (Math.random() > 0.4) ? c1 : c2;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
  }

  /**
   * Bind Scroll & Mouse Events
   */
  function bindEvents() {
    const updateScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    window.addEventListener('mousemove', (e) => {
      mouse.tx = (e.clientX / width - 0.5) * 2;
      mouse.ty = (e.clientY / height - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Spline Interpolator for Continuous Flythrough
   */
  function interpolateTrajectory(p) {
    let lower = trajectory[0];
    let upper = trajectory[trajectory.length - 1];

    for (let i = 0; i < trajectory.length - 1; i++) {
      if (p >= trajectory[i].p && p <= trajectory[i + 1].p) {
        lower = trajectory[i];
        upper = trajectory[i + 1];
        break;
      }
    }

    const range = upper.p - lower.p;
    const factor = range > 0 ? (p - lower.p) / range : 0;
    // Smooth cosine ease
    const smoothFactor = 0.5 - 0.5 * Math.cos(factor * Math.PI);

    const pos = new THREE.Vector3().lerpVectors(lower.pos, upper.pos, smoothFactor);
    const look = new THREE.Vector3().lerpVectors(lower.look, upper.look, smoothFactor);

    return { pos, look };
  }

  /**
   * Update Telemetry HUD
   */
  function updateTelemetry(p, pos) {
    let activeSec = sectors[0];
    for (let i = 0; i < sectors.length; i++) {
      if (p >= sectors[i].range[0] && p <= sectors[i].range[1]) {
        activeSec = sectors[i];
        break;
      }
    }

    if (hudSectorEl && hudSectorEl.textContent !== activeSec.name) {
      hudSectorEl.textContent = activeSec.name;
    }

    if (hudCoordsEl) {
      hudCoordsEl.textContent = `POS: [X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)}m] // ${activeSec.code}`;
    }

    // Update active nav button
    const pills = document.querySelectorAll('#hud-nav-pills button');
    pills.forEach((pill, idx) => {
      const jumpP = parseFloat(pill.dataset.jump);
      const isCur = Math.abs(p - jumpP) < 0.12;
      pill.classList.toggle('on', isCur);
    });
  }

  /**
   * Main Render Loop (60 FPS)
   */
  let time = 0;
  function render() {
    animId = requestAnimationFrame(render);
    time += 0.015;

    // Smooth scroll interpolation (Drone inertia)
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.055;

    // Smooth mouse tilt (Drone head tracking)
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Calculate 3D camera trajectory for current scroll
    const targetPath = interpolateTrajectory(scrollProgress);
    
    // Position with mouse parallax
    const targetCamX = targetPath.pos.x + mouse.x * 3.5;
    const targetCamY = targetPath.pos.y - mouse.y * 2.2;
    const targetCamZ = targetPath.pos.z;

    camera.position.x += (targetCamX - camera.position.x) * 0.08;
    camera.position.y += (targetCamY - camera.position.y) * 0.08;
    camera.position.z += (targetCamZ - camera.position.z) * 0.08;

    // Look target with subtle mouse lead
    const targetLookX = targetPath.look.x + mouse.x * 6;
    const targetLookY = targetPath.look.y - mouse.y * 4;
    const targetLookZ = targetPath.look.z;

    currentLook.x += (targetLookX - currentLook.x) * 0.08;
    currentLook.y += (targetLookY - currentLook.y) * 0.08;
    currentLook.z += (targetLookZ - currentLook.z) * 0.08;

    camera.lookAt(currentLook);

    // Subtle bank / drone roll on turns
    camera.rotation.z = -mouse.x * 0.025;

    // Animate Kinetic Atrium Rings
    kineticRings.forEach(k => {
      k.r1.rotation.x += 0.008;
      k.r1.rotation.y += 0.005;
      k.r2.rotation.y -= 0.007;
      k.r2.rotation.z += 0.004;
      k.r3.rotation.z += 0.005;
      k.crystal.rotation.y += 0.012;
      k.crystal.rotation.x += 0.006;
    });

    // Animate Data Monoliths (Services pulsing)
    dataMonoliths.forEach((dm, i) => {
      const pulse = Math.sin(time * dm.speed + i) * 1.5;
      dm.cap.position.y = (dm.baseHeight - 2) + pulse;
    });

    // Animate atmospheric dust
    if (particlesMesh) {
      particlesMesh.rotation.y = time * 0.02;
    }

    // Animate Neon grid pulsation
    if (neonGridFloor) {
      neonGridFloor.material.opacity = 0.22 + Math.sin(time * 1.5) * 0.06;
    }

    // Telemetry updates
    updateTelemetry(scrollProgress, camera.position);

    // Render WebGL frame
    renderer.render(scene, camera);
  }

  // Self-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
