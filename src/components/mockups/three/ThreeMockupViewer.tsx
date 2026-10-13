'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  Camera,
  Compass,
  RefreshCw,
  Hand,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Move,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  buildProduct3DModel,
  Product3DType,
  preloadHoodieModel,
  isHoodieModelLoaded,
  getCachedHoodieGeometry,
} from './productGeometries'
import { useDynamicTexture, ArtworkLayer } from './useDynamicTexture'

export type CameraPreset = 'front' | 'perspective' | 'side' | 'back' | 'top'

export interface ThreeMockupViewerProps {
  productType: string
  productId?: string
  productColor: string
  productName?: string
  isHeather?: boolean
  layers: ArtworkLayer[]
  printBox: { left: number; top: number; w: number; h: number }
  availableColors?: { name: string; hex: string; isHeather?: boolean }[]
  onSelectColor?: (hex: string) => void
  className?: string
}

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; position: [number, number, number]; target: [number, number, number] }
> = {
  front: {
    label: 'Front',
    position: [0, 0.05, 3.4],
    target: [0, 0, 0],
  },
  perspective: {
    label: 'Perspective (3/4)',
    position: [2.1, 0.35, 2.5],
    target: [0, 0, 0],
  },
  side: {
    label: 'Side',
    position: [3.4, 0.05, 0],
    target: [0, 0, 0],
  },
  back: {
    label: 'Back',
    position: [0, 0.05, -3.4],
    target: [0, 0, 0],
  },
  top: {
    label: 'Top-Down',
    position: [0, 3.2, 0.8],
    target: [0, 0, 0],
  },
}

export function ThreeMockupViewer({
  productType,
  productColor,
  productName = 'Product',
  isHeather,
  layers,
  printBox,
  availableColors,
  onSelectColor,
  className,
}: ThreeMockupViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const currentModelGroup = useRef<THREE.Group | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const isInteractingRef = useRef<boolean>(false)
  const dampingGraceFramesRef = useRef<number>(0)
  const lastCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const lastTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3())

  // Navigation mode: 'orbit' = rotate 360, 'pan' = move around
  const [navMode, setNavMode] = useState<'orbit' | 'pan'>('orbit')

  // Spherical camera transition state
  const cameraTransitionRef = useRef<{
    active: boolean
    startTime: number
    duration: number
    startRadius: number
    startPhi: number
    startTheta: number
    endRadius: number
    endPhi: number
    endTheta: number
    targetLookAt: THREE.Vector3
  }>({
    active: false,
    startTime: 0,
    duration: 420,
    startRadius: 3.4,
    startPhi: Math.PI / 2,
    startTheta: 0,
    endRadius: 3.4,
    endPhi: Math.PI / 2,
    endTheta: 0,
    targetLookAt: new THREE.Vector3(),
  })

  // Turntable rotation state
  const [isAutoRotate, setIsAutoRotate] = useState(false)
  const autoRotateRef = useRef(false)
  const [activePreset, setActivePreset] = useState<CameraPreset>('perspective')
  const [isSnapshotting, setIsSnapshotting] = useState(false)

  const renderFrameRef = useRef<() => void>(() => {})

  // Core render frame
  const renderFrame = useCallback(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!renderer || !scene || !camera || !controls) return

    // 1. Camera transition interpolation using spherical coordinates
    const trans = cameraTransitionRef.current
    if (trans.active) {
      const now = performance.now()
      const elapsed = now - trans.startTime
      const t = Math.min(1, elapsed / trans.duration)
      const ease = 1 - Math.pow(1 - t, 3)

      const curRadius = THREE.MathUtils.lerp(trans.startRadius, trans.endRadius, ease)
      const curPhi = THREE.MathUtils.lerp(trans.startPhi, trans.endPhi, ease)
      const curTheta = THREE.MathUtils.lerp(trans.startTheta, trans.endTheta, ease)

      camera.position.setFromSphericalCoords(curRadius, curPhi, curTheta)
      controls.target.copy(trans.targetLookAt)
      camera.lookAt(trans.targetLookAt)

      if (t >= 1) {
        camera.position.setFromSphericalCoords(trans.endRadius, trans.endPhi, trans.endTheta)
        trans.active = false
      }
    }

    // 2. Turntable rotation
    if (autoRotateRef.current) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 2.0
    } else {
      controls.autoRotate = false
    }

    // 3. OrbitControls update called EXACTLY ONCE per frame
    controls.update()

    // 4. Draw WebGL frame
    renderer.render(scene, camera)
  }, [])

  renderFrameRef.current = renderFrame

  // Continuous animation loop manager with physics damping inertia support
  const startAnimationLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    const tick = () => {
      animFrameRef.current = null
      renderFrameRef.current()

      const camera = cameraRef.current
      const controls = controlsRef.current
      let isStillMoving = false

      if (camera && controls) {
        const posDelta = camera.position.distanceToSquared(lastCamPosRef.current)
        const targetDelta = controls.target.distanceToSquared(lastTargetPosRef.current)
        lastCamPosRef.current.copy(camera.position)
        lastTargetPosRef.current.copy(controls.target)
        isStillMoving = posDelta > 1e-6 || targetDelta > 1e-6
      }

      if (dampingGraceFramesRef.current > 0) {
        dampingGraceFramesRef.current--
      }

      const trans = cameraTransitionRef.current
      const shouldContinue =
        trans.active ||
        autoRotateRef.current ||
        isInteractingRef.current ||
        dampingGraceFramesRef.current > 0 ||
        isStillMoving

      if (shouldContinue) {
        animFrameRef.current = requestAnimationFrame(tick)
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)
  }, [])

  // Immediate frame render + loop wake-up
  const markDirty = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    startAnimationLoop()
  }, [startAnimationLoop])

  // Hook into 2048x2048 dynamic offscreen texture baker
  const { dynamicTexture, fabricNormal } = useDynamicTexture({
    productColor,
    productType,
    layers,
    printBox,
    isHeather,
    onDirty: markDirty,
  })

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // 1. Scene
    const scene = new THREE.Scene()
    scene.background = null
    sceneRef.current = scene

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 25)
    const initPreset = CAMERA_PRESETS.perspective
    camera.position.set(...initPreset.position)
    cameraRef.current = camera
    lastCamPosRef.current.copy(camera.position)

    // 3. WebGL Renderer with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // 4. OrbitControls: fluid, damped inertia for responsive 360° inspection and pan
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.rotateSpeed = 0.92
    controls.enableZoom = true
    controls.zoomSpeed = 1.1
    controls.minDistance = 0.6
    controls.maxDistance = 5.5
    controls.enablePan = true
    controls.screenSpacePanning = true
    controls.panSpeed = 0.85
    controls.minPolarAngle = 0.05
    controls.maxPolarAngle = Math.PI - 0.05
    controls.target.set(0, 0, 0)
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    }
    controlsRef.current = controls
    lastTargetPosRef.current.copy(controls.target)

    controls.addEventListener('start', () => {
      isInteractingRef.current = true
      startAnimationLoop()
    })
    controls.addEventListener('end', () => {
      isInteractingRef.current = false
      // Buffer damping grace frames so momentum smoothly coasts to a stop
      dampingGraceFramesRef.current = 45
      startAnimationLoop()
    })
    controls.addEventListener('change', () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    })

    // 5. Studio 4-point softbox lighting rig calibrated for matte organic cotton & clearcoat
    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.30)
    keyLight.position.set(2.8, 3.4, 2.6)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 0.85)
    fillLight.position.set(-2.8, 2.2, 2.0)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55)
    rimLight.position.set(0, 4.0, -2.8)
    scene.add(rimLight)

    const bounceLight = new THREE.DirectionalLight(0xf5f3ee, 0.35)
    bounceLight.position.set(0, -3.0, 2.0)
    scene.add(bounceLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x5a5750, 0.95)
    scene.add(hemiLight)

    // 6. Ground contact shadow plane
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 512
    shadowCanvas.height = 512
    const sctx = shadowCanvas.getContext('2d')!
    const grad = sctx.createRadialGradient(256, 256, 12, 256, 256, 240)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.28)')
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.14)')
    grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.03)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    sctx.fillStyle = grad
    sctx.fillRect(0, 0, 512, 512)

    const shadowTex = new THREE.CanvasTexture(shadowCanvas)
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    })
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat)
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -1.02
    scene.add(shadowPlane)

    // 7. Responsive resize listener
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect
        if (w > 0 && h > 0) {
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
          renderer.render(scene, camera)
        }
      }
    })
    resizeObserver.observe(container)

    renderer.render(scene, camera)

    return () => {
      resizeObserver.disconnect()
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      controls.dispose()
      renderer.dispose()
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [startAnimationLoop])

  // Sync navigation mode (Orbit vs Pan) to OrbitControls
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (navMode === 'orbit') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }
    } else {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }
    }
  }, [navMode])

  // Rebuild 3D Model when productType, texture, or normal map changes
  useEffect(() => {
    if (!sceneRef.current || !dynamicTexture || !fabricNormal) return

    let isDisposed = false
    const normType = (productType || 'tshirt') as Product3DType

    const setupModel = () => {
      if (isDisposed || !sceneRef.current) return

      // Remove existing model
      if (currentModelGroup.current) {
        sceneRef.current.remove(currentModelGroup.current)
        currentModelGroup.current.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (mesh.isMesh && mesh.geometry) {
            mesh.geometry.dispose()
          }
        })
        currentModelGroup.current = null
      }

      // Build new 3D model
      const result = buildProduct3DModel(normType, dynamicTexture, fabricNormal)

      result.group.scale.set(0.92, 0.92, 0.92)
      result.group.position.y = 0.05
      currentModelGroup.current = result.group
      sceneRef.current.add(result.group)

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      markDirty()
    }

    if ((normType === 'hoodie' || normType === 'hoodie-zip') && !isHoodieModelLoaded()) {
      preloadHoodieModel()
        .then(() => {
          setupModel()
        })
        .catch(() => {
          setupModel()
        })
    } else {
      setupModel()
    }

    return () => {
      isDisposed = true
    }
  }, [productType, dynamicTexture, fabricNormal, markDirty])

  // Camera preset switcher with smooth spherical lerp
  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset)
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    const config = CAMERA_PRESETS[preset]
    const startSpherical = new THREE.Spherical().setFromVector3(camera.position)
    const targetPos = new THREE.Vector3(...config.position)
    const endSpherical = new THREE.Spherical().setFromVector3(targetPos)

    // Shortest angular path for theta
    let diffTheta = endSpherical.theta - startSpherical.theta
    while (diffTheta > Math.PI) diffTheta -= Math.PI * 2
    while (diffTheta < -Math.PI) diffTheta += Math.PI * 2

    cameraTransitionRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 420,
      startRadius: startSpherical.radius,
      startPhi: startSpherical.phi,
      startTheta: startSpherical.theta,
      endRadius: endSpherical.radius,
      endPhi: endSpherical.phi,
      endTheta: startSpherical.theta + diffTheta,
      targetLookAt: new THREE.Vector3(...config.target),
    }

    startAnimationLoop()
  }

  // Interactive Nudge Rotation (D-pad)
  const handleRotateNudge = (deltaAzimuth: number, deltaPolar: number) => {
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const spherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(controls.target)
    )
    spherical.theta += deltaAzimuth
    spherical.phi = Math.max(0.08, Math.min(Math.PI - 0.08, spherical.phi + deltaPolar))
    camera.position.setFromSpherical(spherical).add(controls.target)
    camera.lookAt(controls.target)
    controls.update()
    dampingGraceFramesRef.current = 20
    markDirty()
  }

  // Interactive Zoom Nudge
  const handleZoomNudge = (factor: number) => {
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const offset = camera.position.clone().sub(controls.target)
    offset.multiplyScalar(factor)
    const newDist = offset.length()
    if (newDist >= controls.minDistance && newDist <= controls.maxDistance) {
      camera.position.copy(controls.target).add(offset)
      controls.update()
      dampingGraceFramesRef.current = 20
      markDirty()
    }
  }

  // Turntable 360 toggle
  const toggleAutoRotate = () => {
    const next = !isAutoRotate
    setIsAutoRotate(next)
    autoRotateRef.current = next
    startAnimationLoop()
  }

  // 4K PNG snapshot exporter
  const handleDownloadSnapshot = () => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!renderer || !scene || !camera) return

    setIsSnapshotting(true)
    renderer.render(scene, camera)
    const dataUrl = renderer.domElement.toDataURL('image/png', 1.0)

    const a = document.createElement('a')
    a.href = dataUrl
    const safeName = (productName || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    a.download = `${safeName}-3d-studio.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => setIsSnapshotting(false), 500)
  }

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none',
        'bg-radial from-[#FFFFFF] via-[#FAF9F6] to-[#EDE9E1]',
        className
      )}>
      {/* Top Studio Indicator */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-[#E5E2DC] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-[#1A1A12] uppercase tracking-wider">
            3D WebGL Studio
          </span>
          <span className="text-[10px] text-[#8C8880] font-medium">· Real-Time Cloth & PBR</span>
        </div>
      </div>

      {/* Floating Viewport Navigation Toolbar (Mode Switcher + D-Pad + Zoom) */}
      <div className="absolute top-4 right-6 z-10 flex flex-col items-end gap-2">
        {/* Navigation Mode Pill (Rotate vs Pan) */}
        <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E5E2DC] shadow-sm">
          <button
            onClick={() => setNavMode('orbit')}
            title="360° Rotate Mode: Drag to orbit around the 3D model"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
              navMode === 'orbit'
                ? 'bg-[#1A1A12] text-white shadow-2xs'
                : 'text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9]'
            )}>
            <RotateCw size={12} />
            <span>Rotate</span>
          </button>
          <button
            onClick={() => setNavMode('pan')}
            title="Move Mode: Drag with left-click to move/pan the model"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
              navMode === 'pan'
                ? 'bg-[#1A1A12] text-white shadow-2xs'
                : 'text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9]'
            )}>
            <Hand size={12} />
            <span>Move</span>
          </button>
        </div>

        {/* Compact Directional D-Pad & Zoom Controls */}
        <div className="flex flex-col items-center bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#E5E2DC] shadow-sm gap-1">
          {/* Tilt Up */}
          <button
            onClick={() => handleRotateNudge(0, -0.22)}
            title="Tilt Up"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
            <ChevronUp size={16} />
          </button>

          {/* Left / Reset / Right row */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleRotateNudge(-0.35, 0)}
              title="Rotate Left"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleSelectPreset('perspective')}
              title="Reset View (Perspective)"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
              <RotateCcw size={12} />
            </button>
            <button
              onClick={() => handleRotateNudge(0.35, 0)}
              title="Rotate Right"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Tilt Down */}
          <button
            onClick={() => handleRotateNudge(0, 0.22)}
            title="Tilt Down"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
            <ChevronDown size={16} />
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-[#E5E2DC] my-0.5" />

          {/* Zoom In & Out */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoomNudge(0.85)}
              title="Zoom In"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoomNudge(1.18)}
              title="Zoom Out"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE9] transition-all">
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Center 3D WebGL Viewport */}
      <div
        ref={containerRef}
        className={cn(
          'w-full flex-1 min-h-[460px] flex items-center justify-center relative',
          navMode === 'orbit' ? 'cursor-grab active:cursor-grabbing' : 'cursor-move'
        )}
      />

      {/* Floating Viewport Bottom Controls Bar */}
      <div className="w-full flex flex-col items-center gap-3 pb-5 px-6 z-10 shrink-0">
        <div className="flex items-center justify-between w-full max-w-[840px] bg-white/95 backdrop-blur-md border border-[#E5E2DC] shadow-md rounded-2xl p-2 gap-3">
          {/* 1. Camera Angle Presets */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#EBE8E3]">
            <Compass size={14} className="text-[#8C8880] ml-1.5 mr-0.5 shrink-0" />
            {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((presetKey) => {
              const isActive = activePreset === presetKey
              return (
                <button
                  key={presetKey}
                  onClick={() => handleSelectPreset(presetKey)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-[#1A1A12] text-white shadow-2xs'
                      : 'text-[#6E6B65] hover:text-[#1A1A12] hover:bg-white'
                  )}>
                  {CAMERA_PRESETS[presetKey].label}
                </button>
              )
            })}
          </div>

          {/* 2. Turntable 360 Toggle */}
          <button
            onClick={toggleAutoRotate}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0',
              isAutoRotate
                ? 'bg-[#575C46] text-white border-[#575C46] shadow-2xs'
                : 'bg-white text-[#1A1A12] border-[#E5E2DC] hover:border-[#9A9A8E]'
            )}
            title="Auto-rotate 360° turntable">
            <RefreshCw size={13} className={cn(isAutoRotate && 'animate-spin')} />
            <span>360° Turn</span>
          </button>

          {/* 3. Snapshot PNG Export */}
          <button
            onClick={handleDownloadSnapshot}
            disabled={isSnapshotting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#1A1A12] text-white hover:bg-[#33332D] shadow-xs shrink-0">
            <Camera size={13} />
            <span>Download 3D Snapshot</span>
          </button>
        </div>

        {/* Quick Swatch Bar & Navigation Hints */}
        <div className="flex items-center justify-between w-full max-w-[840px] px-2 text-[11px] text-[#8C8880]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#5C5A55]">Garment:</span>
            {availableColors && availableColors.length > 0 && (
              <div className="flex items-center gap-1">
                {availableColors.slice(0, 8).map((c) => {
                  const isCur = productColor.toUpperCase() === c.hex.toUpperCase()
                  return (
                    <button
                      key={c.hex}
                      onClick={() => onSelectColor && onSelectColor(c.hex)}
                      title={c.name}
                      className={cn(
                        'w-4 h-4 rounded-full border transition-all',
                        isCur
                          ? 'border-[#1A1A12] ring-2 ring-[#1A1A12] scale-110'
                          : 'border-[#D5D2CA] hover:scale-110'
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Drag to rotate</span>
            <span>·</span>
            <span>Scroll to zoom</span>
            <span>·</span>
            <span>Right-click or switch mode to move</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreeMockupViewer
