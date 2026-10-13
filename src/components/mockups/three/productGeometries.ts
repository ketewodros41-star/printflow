import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export type Product3DType =
  | 'tshirt'
  | 'longsleeve'
  | 'tank'
  | 'sweatshirt'
  | 'hoodie'
  | 'hoodie-zip'
  | 'mug'
  | 'tote'
  | 'polo'
  | 'jacket'
  | 'cap'
  | 'hat'
  | 'blanket'
  | 'pillow'

export interface ModelBuildResult {
  group: THREE.Group
  mainMesh: THREE.Mesh
  materials: THREE.Material[]
}

let cachedHoodieGeometry: THREE.BufferGeometry | null = null
let hoodieLoadingPromise: Promise<THREE.BufferGeometry> | null = null

export function isHoodieModelLoaded(): boolean {
  return cachedHoodieGeometry !== null
}

export function getCachedHoodieGeometry(): THREE.BufferGeometry | null {
  return cachedHoodieGeometry
}

export function preloadHoodieModel(): Promise<THREE.BufferGeometry> {
  if (cachedHoodieGeometry) {
    return Promise.resolve(cachedHoodieGeometry)
  }
  if (hoodieLoadingPromise) {
    return hoodieLoadingPromise
  }
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not available for GLTFLoader'))
  }

  hoodieLoadingPromise = new Promise<THREE.BufferGeometry>((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/hoodie.glb',
      (gltf) => {
        let geom: THREE.BufferGeometry | null = null
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !geom) {
            geom = (child as THREE.Mesh).geometry
          }
        })
        if (geom) {
          cachedHoodieGeometry = geom
          resolve(geom)
        } else {
          reject(new Error('No geometry found in /models/hoodie.glb'))
        }
      },
      undefined,
      (err) => {
        console.warn('Failed to load /models/hoodie.glb, using parametric fallback:', err)
        reject(err)
      }
    )
  })

  return hoodieLoadingPromise
}

/**
 * Clamps secondary trim geometry UV coordinates to clean garment fabric area (U=0.25, V=0.35).
 * Sleeves, hood, cuffs, and trim inherit authentic garment fabric color and texture
 * without bleeding user chest/back artwork.
 */
export function clampGeometryUvsToBlankArea(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const uvAttr = geo.attributes.uv
  if (uvAttr) {
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setXY(i, 0.25, 0.35)
    }
    uvAttr.needsUpdate = true
  } else {
    const posAttr = geo.attributes.position
    if (posAttr) {
      const uvs = new Float32Array(posAttr.count * 2)
      for (let i = 0; i < posAttr.count; i++) {
        uvs[i * 2] = 0.25
        uvs[i * 2 + 1] = 0.35
      }
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    }
  }
  return geo
}

/**
 * Creates procedural fabric normal map (high-definition 32/1 ring-spun jersey knit & twill weave).
 */
export function createFabricNormalTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any)
  }
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(size, size)
  const d = imgData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Interlocking jersey knit loops with vertical wales and horizontal courses
      const wale = Math.sin((x / 2.8) * Math.PI)
      const course = Math.sin((y / 2.8) * Math.PI)
      const microTwill = Math.sin(((x + y * 1.1) / 3.2) * Math.PI) * 0.25

      const nx = Math.floor(128 + wale * 16 + microTwill * 8)
      const ny = Math.floor(128 + course * 16 + microTwill * 8)
      const nz = 250

      const idx = (y * size + x) * 4
      d[idx] = Math.max(0, Math.min(255, nx))
      d[idx + 1] = Math.max(0, Math.min(255, ny))
      d[idx + 2] = nz
      d[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(28, 28)
  return texture
}

/**
 * Builds sculpted anatomical Torso buffer geometry with sloping shoulders,
 * 3D contoured curved neckline dipping in front, and natural organic cloth drape folds.
 */
function createSculptedTorsoGeometry(productType: Product3DType): THREE.BufferGeometry {
  const rings = 72
  const segments = 96
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const isTank = productType === 'tank'
  const isSweat = productType === 'sweatshirt'
  const isHooded = productType === 'hoodie' || productType === 'hoodie-zip'

  for (let r = 0; r <= rings; r++) {
    const vFrac = r / rings // 0 = bottom hem, 1 = collar/neckline
    const baseY = -0.86 + vFrac * 1.50

    let rx = 0.60
    let rz = 0.22
    let zCenter = 0.0

    if (vFrac < 0.12) {
      // Bottom hem / ribbed waistband
      rx = isSweat || isHooded ? 0.55 : 0.585
      rz = isSweat || isHooded ? 0.21 : 0.225
    } else if (vFrac < 0.38) {
      // Transition from hem to waist
      const t = (vFrac - 0.12) / 0.26
      rx = (isSweat || isHooded ? 0.55 : 0.585) + t * (isSweat || isHooded ? 0.045 : 0.015)
      rz = 0.22 + t * 0.010
    } else if (vFrac < 0.72) {
      // Pectoral chest expansion
      const c = (vFrac - 0.38) / 0.34
      const sinC = Math.sin(c * Math.PI)
      rx = 0.60 + sinC * (isHooded ? 0.045 : 0.035)
      rz = 0.23 + sinC * 0.025
      zCenter = sinC * 0.018
    } else if (vFrac < 0.90) {
      // Upper chest to natural sloping shoulder line
      const s = (vFrac - 0.72) / 0.18
      rx = 0.635 + s * (isTank ? 0.04 : 0.095)
      rz = 0.245 - s * 0.025
      zCenter = 0.018 - s * 0.018
    } else {
      // Neck aperture transition
      const n = (vFrac - 0.90) / 0.10
      rx = (isTank ? 0.675 : 0.73) - n * (isTank ? 0.36 : 0.44)
      rz = 0.22 - n * (isTank ? 0.05 : 0.07)
    }

    for (let s = 0; s <= segments; s++) {
      const uFrac = s / segments
      const theta = uFrac * Math.PI * 2
      const cosT = Math.cos(theta)
      const sinT = Math.sin(theta)

      // Anatomical 3D neck drop: front dips down, back rises
      let neckDropY = 0
      if (vFrac >= 0.80) {
        const neckBlend = (vFrac - 0.80) / 0.20
        const dropFactor = cosT > 0 ? -0.10 * cosT : 0.04 * (-cosT)
        neckDropY = dropFactor * Math.pow(neckBlend, 1.8)
      }

      // Organic fabric drape ripples
      const isSide = Math.abs(sinT) > 0.35
      const sideFold =
        isSide && vFrac > 0.12 && vFrac < 0.82
          ? Math.sin(theta * 2) * Math.sin(vFrac * Math.PI * 4) * 0.007
          : 0

      const isChest = cosT > 0.25 && vFrac > 0.35 && vFrac < 0.75
      const chestFold =
        isChest
          ? Math.sin((uFrac * 6 + vFrac * 3) * Math.PI) * 0.003
          : 0

      // Kangaroo pocket relief for fallback hoodie
      const isPocketZone = isHooded && vFrac >= 0.14 && vFrac <= 0.38 && cosT > 0.35
      const pocketRelief = isPocketZone ? 0.008 * Math.sin(((vFrac - 0.14) / 0.24) * Math.PI) : 0

      const hemWelt = vFrac <= 0.06 ? Math.sin(theta * 36) * 0.0015 : 0

      const effRx = rx + sideFold + chestFold + hemWelt
      const effRz = rz + sideFold + chestFold + hemWelt

      const x = cosT * effRx
      const y = baseY + neckDropY
      const z = zCenter + sinT * effRz + (cosT > 0 ? pocketRelief : 0)

      positions.push(x, y, z)

      // Dual-Side Conformal UV:
      // Front (z >= zCenter, sinT >= 0): Center chest at U = 0.25
      // Back (z < zCenter, sinT < 0): Center back at U = 0.75
      const isFront = z >= zCenter
      const normX = Math.max(-1, Math.min(1, x / rx))

      let u: number
      if (isFront) {
        // Front: x in [-rx, rx] maps continuously to U in [0.06, 0.44]
        u = 0.25 + normX * 0.190
      } else {
        // Back: x in [-rx, rx] maps continuously to U in [0.56, 0.94]
        u = 0.75 - normX * 0.190
      }
      const v = 0.14 + vFrac * 0.72

      uvs.push(u, v)
    }
  }

  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = r * (segments + 1) + s
      const b = (r + 1) * (segments + 1) + s
      const c = (r + 1) * (segments + 1) + (s + 1)
      const d = r * (segments + 1) + (s + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/**
 * Creates smooth lofted curved sleeve geometry along a 3D Catmull-Rom spline curve.
 * Drapes naturally alongside the torso with sealed shoulder transition.
 */
function createLoftedCurvedSleeve(
  curve: THREE.CatmullRomCurve3,
  radii: number[],
  lengthSegments: number = 32,
  radialSegments: number = 24
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const frames = curve.computeFrenetFrames(lengthSegments, false)

  for (let i = 0; i <= lengthSegments; i++) {
    const u = i / lengthSegments
    const p = curve.getPointAt(u)
    const normal = frames.normals[i]
    const binormal = frames.binormals[i]

    const rIdx = u * (radii.length - 1)
    const low = Math.floor(rIdx)
    const high = Math.min(radii.length - 1, Math.ceil(rIdx))
    const frac = rIdx - low
    const radius = radii[low] * (1 - frac) + radii[high] * frac

    // Organic wrinkle at flex points
    const wrinkle = u > 0.4 && u < 0.65 ? Math.sin((u - 0.4) * Math.PI * 4) * 0.005 : 0

    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments
      const theta = v * Math.PI * 2
      const sin = Math.sin(theta)
      const cos = Math.cos(theta)

      const effR = radius + wrinkle * Math.max(0, -cos)

      // Elliptical flattening in Z for realistic arm shape
      const zFlatten = 0.88
      const x = p.x + effR * (cos * normal.x + sin * binormal.x)
      const y = p.y + effR * (cos * normal.y + sin * binormal.y)
      const z = p.z + effR * (cos * normal.z + sin * binormal.z) * zFlatten

      positions.push(x, y, z)
      uvs.push(0.25, 0.35)
    }
  }

  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = (i + 1) * (radialSegments + 1) + j
      const c = (i + 1) * (radialSegments + 1) + (j + 1)
      const d = i * (radialSegments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // End cap inside arm opening
  const endP = curve.getPointAt(1.0)
  const endIdx = positions.length / 3
  positions.push(endP.x, endP.y, endP.z)
  uvs.push(0.25, 0.35)
  const lastRing = lengthSegments * (radialSegments + 1)
  for (let j = 0; j < radialSegments; j++) {
    indices.push(lastRing + j, endIdx, lastRing + j + 1)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/**
 * Creates natural sculpted sleeves (short, long, or sleeveless armholes).
 */
function createRealisticSleeves(
  type: 'none' | 'short' | 'long',
  material: THREE.Material
): THREE.Mesh[] {
  if (type === 'none') {
    // Muscle tank: Smooth contoured armhole ribbed borders
    const leftArmhole = new THREE.Mesh(
      clampGeometryUvsToBlankArea(new THREE.TorusGeometry(0.24, 0.022, 16, 36)),
      material
    )
    leftArmhole.rotation.y = Math.PI / 2
    leftArmhole.position.set(-0.68, 0.42, 0)

    const rightArmhole = leftArmhole.clone()
    rightArmhole.position.x = 0.68
    return [leftArmhole, rightArmhole]
  }

  const meshes: THREE.Mesh[] = []

  if (type === 'short') {
    // Short sleeve: Drapes naturally downward at ~38 degrees with realistic bicep curve
    const buildSleeveMesh = (isLeft: boolean) => {
      const sign = isLeft ? -1 : 1
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 0.64, 0.47, 0.01), // Shoulder seam
        new THREE.Vector3(sign * 0.72, 0.32, 0.02), // Upper bicep
        new THREE.Vector3(sign * 0.76, 0.14, 0.02), // Mid bicep opening
      ])
      const radii = [0.180, 0.165, 0.155]
      const geo = createLoftedCurvedSleeve(curve, radii, 28, 24)
      clampGeometryUvsToBlankArea(geo)
      const mesh = new THREE.Mesh(geo, material)

      // Clean sleeve hem cuff
      const cuffCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 0.74, 0.16, 0.02),
        new THREE.Vector3(sign * 0.76, 0.12, 0.02),
      ])
      const cuffGeo = clampGeometryUvsToBlankArea(
        new THREE.TubeGeometry(cuffCurve, 8, 0.156, 24, false)
      )
      const cuffMesh = new THREE.Mesh(cuffGeo, material)

      return [mesh, cuffMesh]
    }

    meshes.push(...buildSleeveMesh(true), ...buildSleeveMesh(false))
  } else {
    // Long sleeve / Sweatshirt: Drapes naturally down alongside torso with elbow bend
    const buildLongSleeveMesh = (isLeft: boolean) => {
      const sign = isLeft ? -1 : 1
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 0.64, 0.47, 0.01), // Shoulder
        new THREE.Vector3(sign * 0.72, 0.26, 0.02), // Upper arm
        new THREE.Vector3(sign * 0.74, 0.02, 0.03), // Elbow bend
        new THREE.Vector3(sign * 0.72, -0.28, 0.03), // Forearm
        new THREE.Vector3(sign * 0.67, -0.56, 0.02), // Wrist
      ])
      const radii = [0.180, 0.165, 0.150, 0.135, 0.120]
      const geo = createLoftedCurvedSleeve(curve, radii, 36, 24)
      clampGeometryUvsToBlankArea(geo)
      const mesh = new THREE.Mesh(geo, material)

      // Ribbed wrist cuff
      const cuffGeo = clampGeometryUvsToBlankArea(
        new THREE.CylinderGeometry(0.120, 0.112, 0.14, 24, 4)
      )
      const cuff = new THREE.Mesh(cuffGeo, material)
      cuff.position.set(sign * 0.66, -0.63, 0.02)
      cuff.rotation.z = sign * (Math.PI / 18)

      return [mesh, cuff]
    }

    meshes.push(...buildLongSleeveMesh(true), ...buildLongSleeveMesh(false))
  }

  return meshes
}

/**
 * Creates 3D crewneck collar ribbon following the sloping neckline ellipse.
 */
function createRealisticNeckRibbon(material: THREE.Material): THREE.Mesh {
  const collarCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0.52, 0.17), // Front center dip
      new THREE.Vector3(0.16, 0.57, 0.08), // Front right
      new THREE.Vector3(0.22, 0.63, -0.04), // Right side
      new THREE.Vector3(0.15, 0.66, -0.14), // Back right
      new THREE.Vector3(0, 0.67, -0.16), // Back center rise
      new THREE.Vector3(-0.15, 0.66, -0.14), // Back left
      new THREE.Vector3(-0.22, 0.63, -0.04), // Left side
      new THREE.Vector3(-0.16, 0.57, 0.08), // Front left
    ],
    true
  )

  const collarGeo = clampGeometryUvsToBlankArea(
    new THREE.TubeGeometry(collarCurve, 48, 0.022, 16, true)
  )
  return new THREE.Mesh(collarGeo, material)
}

/**
 * Creates 3D contoured draped hood cowl with drawstrings and metal aglets.
 */
function createHoodMesh(
  material: THREE.Material,
  metalMaterial: THREE.Material,
  hasDrawstrings: boolean
): THREE.Group {
  const group = new THREE.Group()

  const cowlShape = new THREE.SphereGeometry(0.32, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.72)
  cowlShape.scale(1.15, 1.35, 0.85)
  const hoodMesh = new THREE.Mesh(clampGeometryUvsToBlankArea(cowlShape), material)
  hoodMesh.position.set(0, 0.62, -0.22)
  hoodMesh.rotation.x = 0.45
  group.add(hoodMesh)

  const hoodRim = new THREE.Mesh(
    clampGeometryUvsToBlankArea(new THREE.TorusGeometry(0.30, 0.024, 16, 36)),
    material
  )
  hoodRim.position.set(0, 0.72, -0.06)
  hoodRim.rotation.x = 0.42
  group.add(hoodRim)

  if (hasDrawstrings) {
    const cordMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.85,
    })

    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.09, 0.66, 0.22),
      new THREE.Vector3(-0.11, 0.48, 0.25),
      new THREE.Vector3(-0.10, 0.32, 0.26),
    ])
    const leftCord = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve, 20, 0.010, 8, false),
      cordMaterial
    )
    group.add(leftCord)

    const leftAglet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.055, 12),
      metalMaterial
    )
    leftAglet.position.set(-0.10, 0.29, 0.26)
    group.add(leftAglet)

    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.09, 0.66, 0.22),
      new THREE.Vector3(0.11, 0.48, 0.25),
      new THREE.Vector3(0.10, 0.32, 0.26),
    ])
    const rightCord = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve, 20, 0.010, 8, false),
      cordMaterial
    )
    group.add(rightCord)

    const rightAglet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.055, 12),
      metalMaterial
    )
    rightAglet.position.set(0.10, 0.29, 0.26)
    group.add(rightAglet)
  }

  return group
}

/**
 * Creates metallic center zipper accurately contoured to the front surface of the 3D model.
 */
function createZipperMesh(metalMaterial: THREE.Material, surfaceZ: number = 0.405): THREE.Group {
  const group = new THREE.Group()

  // Vertical zipper track strip running from neck collar down to bottom hem
  const trackGeo = new THREE.BoxGeometry(0.020, 1.15, 0.014)
  const trackMesh = new THREE.Mesh(trackGeo, metalMaterial)
  trackMesh.position.set(0, -0.16, surfaceZ)
  group.add(trackMesh)

  // Metal zipper slider
  const sliderGeo = new THREE.BoxGeometry(0.038, 0.055, 0.022)
  const sliderMesh = new THREE.Mesh(sliderGeo, metalMaterial)
  sliderMesh.position.set(0, 0.22, surfaceZ + 0.012)
  group.add(sliderMesh)

  // Metal zipper pull tab
  const pullTabGeo = new THREE.BoxGeometry(0.020, 0.075, 0.008)
  const pullTabMesh = new THREE.Mesh(pullTabGeo, metalMaterial)
  pullTabMesh.position.set(0, 0.16, surfaceZ + 0.022)
  pullTabMesh.rotation.x = 0.22
  group.add(pullTabMesh)

  return group
}

/**
 * Creates Polo folded collar with front 2-button placket.
 */
function createPoloCollarMesh(material: THREE.Material): THREE.Group {
  const group = new THREE.Group()

  const collarBand = new THREE.Mesh(
    clampGeometryUvsToBlankArea(new THREE.TorusGeometry(0.25, 0.032, 16, 36, Math.PI * 1.85)),
    material
  )
  collarBand.rotation.x = Math.PI / 2 + 0.14
  collarBand.rotation.z = Math.PI * 0.075
  collarBand.position.set(0, 0.69, 0.02)
  group.add(collarBand)

  const placketGeo = clampGeometryUvsToBlankArea(new THREE.BoxGeometry(0.075, 0.30, 0.012))
  const placketMesh = new THREE.Mesh(placketGeo, material)
  placketMesh.position.set(0, 0.52, 0.255)
  group.add(placketMesh)

  const buttonMat = new THREE.MeshPhysicalMaterial({
    color: 0xfafafa,
    roughness: 0.25,
    clearcoat: 0.9,
  })
  const buttonGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.006, 16)
  buttonGeo.rotateX(Math.PI / 2)

  const btn1 = new THREE.Mesh(buttonGeo, buttonMat)
  btn1.position.set(0, 0.58, 0.265)
  group.add(btn1)

  const btn2 = new THREE.Mesh(buttonGeo, buttonMat)
  btn2.position.set(0, 0.47, 0.265)
  group.add(btn2)

  return group
}

/**
 * Creates Ceramic Mug with porcelain clearcoat glaze, bottom foot bevel, and ergonomic C-handle.
 */
function createCeramicMug(dynamicTexture: THREE.CanvasTexture): ModelBuildResult {
  const group = new THREE.Group()

  const ceramicMaterial = new THREE.MeshPhysicalMaterial({
    map: dynamicTexture,
    roughness: 0.04,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 0.98,
    side: THREE.DoubleSide,
  })

  // Outer Mug Cylinder
  const outerGeo = new THREE.CylinderGeometry(0.72, 0.69, 1.55, 64, 32, true)
  outerGeo.rotateY(-Math.PI / 2)
  const mainMesh = new THREE.Mesh(outerGeo, ceramicMaterial)
  group.add(mainMesh)

  // Mug Bottom with beveled foot
  const bottomGeo = new THREE.CircleGeometry(0.69, 64)
  bottomGeo.rotateX(Math.PI / 2)
  const bottomMesh = new THREE.Mesh(bottomGeo, ceramicMaterial)
  bottomMesh.position.y = -0.775
  group.add(bottomMesh)

  // Inner Hollow Interior
  const innerGeo = new THREE.CylinderGeometry(0.65, 0.62, 1.50, 48, 16, true)
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.04,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    side: THREE.BackSide,
  })
  const innerMesh = new THREE.Mesh(innerGeo, innerMat)
  innerMesh.position.y = 0.02
  group.add(innerMesh)

  // Rounded lip rim
  const rimGeo = clampGeometryUvsToBlankArea(new THREE.TorusGeometry(0.685, 0.035, 16, 64))
  rimGeo.rotateX(Math.PI / 2)
  const rimMesh = new THREE.Mesh(rimGeo, ceramicMaterial)
  rimMesh.position.y = 0.775
  group.add(rimMesh)

  // C-shaped Handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, 0.45, 0),
    new THREE.Vector3(1.16, 0.32, 0),
    new THREE.Vector3(1.20, -0.08, 0),
    new THREE.Vector3(1.08, -0.38, 0),
    new THREE.Vector3(0.68, -0.45, 0),
  ])
  const handleGeo = clampGeometryUvsToBlankArea(
    new THREE.TubeGeometry(handleCurve, 40, 0.085, 16, false)
  )
  const handleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.04,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  })
  const handleMesh = new THREE.Mesh(handleGeo, handleMat)
  group.add(handleMesh)

  return {
    group,
    mainMesh,
    materials: [ceramicMaterial, innerMat, handleMat],
  }
}

/**
 * Creates Canvas Tote Bag with natural side gussets, soft bottom fold, and ribbon webbing straps.
 */
function createToteBag(
  dynamicTexture: THREE.CanvasTexture,
  fabricNormal: THREE.CanvasTexture
): ModelBuildResult {
  const group = new THREE.Group()

  const canvasMaterial = new THREE.MeshPhysicalMaterial({
    map: dynamicTexture,
    normalMap: fabricNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.95,
    metalness: 0.0,
    sheen: 0.20,
    sheenRoughness: 0.80,
    sheenColor: new THREE.Color(0x999999),
    side: THREE.DoubleSide,
  })

  const bagGeo = new THREE.BoxGeometry(1.28, 1.48, 0.32, 32, 32, 8)
  const pos = bagGeo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i)
    const py = pos.getY(i)
    const pz = pos.getZ(i)

    const billow =
      Math.cos((px / 0.64) * Math.PI * 0.5) * Math.sin(((py + 0.74) / 1.48) * Math.PI) * 0.024
    const signZ = pz >= 0 ? 1 : -1
    pos.setZ(i, pz + signZ * billow)
  }
  pos.needsUpdate = true
  bagGeo.computeVertexNormals()

  const uvs = bagGeo.attributes.uv
  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i)
    const v = uvs.getY(i)
    uvs.setXY(i, 0.06 + u * 0.38, 0.18 + v * 0.64)
  }
  uvs.needsUpdate = true

  const mainMesh = new THREE.Mesh(bagGeo, canvasMaterial)
  mainMesh.position.y = -0.15
  group.add(mainMesh)

  const strapMat = canvasMaterial.clone()

  const frontStrapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.58, 0.17),
    new THREE.Vector3(-0.30, 1.15, 0.19),
    new THREE.Vector3(0.00, 1.38, 0.21),
    new THREE.Vector3(0.30, 1.15, 0.19),
    new THREE.Vector3(0.35, 0.58, 0.17),
  ])
  const frontStrapGeo = clampGeometryUvsToBlankArea(
    new THREE.TubeGeometry(frontStrapCurve, 36, 0.030, 8, false)
  )
  const frontStrap = new THREE.Mesh(frontStrapGeo, strapMat)
  group.add(frontStrap)

  const backStrapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.58, -0.17),
    new THREE.Vector3(-0.30, 1.15, -0.19),
    new THREE.Vector3(0.00, 1.38, -0.21),
    new THREE.Vector3(0.30, 1.15, -0.19),
    new THREE.Vector3(0.35, 0.58, -0.17),
  ])
  const backStrapGeo = clampGeometryUvsToBlankArea(
    new THREE.TubeGeometry(backStrapCurve, 36, 0.030, 8, false)
  )
  const backStrap = new THREE.Mesh(backStrapGeo, strapMat)
  group.add(backStrap)

  return {
    group,
    mainMesh,
    materials: [canvasMaterial, strapMat],
  }
}

/**
 * Creates Baseball Cap / Dad Hat with 6-panel dome crown, curved front visor brim, and top button.
 */
function createBaseballCap(
  dynamicTexture: THREE.CanvasTexture,
  fabricNormal: THREE.CanvasTexture
): ModelBuildResult {
  const group = new THREE.Group()

  const capMaterial = new THREE.MeshPhysicalMaterial({
    map: dynamicTexture,
    normalMap: fabricNormal,
    normalScale: new THREE.Vector2(0.28, 0.28),
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.25,
    sheenRoughness: 0.70,
    sheenColor: new THREE.Color(0x999999),
    side: THREE.DoubleSide,
  })

  // 1. Crown: 6-panel hemisphere dome
  const crownGeo = new THREE.SphereGeometry(0.82, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55)
  crownGeo.scale(1.0, 0.95, 1.10)
  const uvs = crownGeo.attributes.uv
  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i)
    const v = uvs.getY(i)
    uvs.setXY(i, 0.10 + u * 0.30, 0.30 + v * 0.40)
  }
  uvs.needsUpdate = true

  const mainMesh = new THREE.Mesh(crownGeo, capMaterial)
  mainMesh.position.set(0, 0.15, 0)
  group.add(mainMesh)

  // 2. Visor / Brim: Curved forward shelf extending outward
  const visorCurve = new THREE.Shape()
  visorCurve.moveTo(-0.65, 0)
  visorCurve.quadraticCurveTo(0, 0.12, 0.65, 0)
  visorCurve.quadraticCurveTo(0.72, 0.72, 0, 0.85)
  visorCurve.quadraticCurveTo(-0.72, 0.72, -0.65, 0)
  visorCurve.closePath()

  const visorGeo = clampGeometryUvsToBlankArea(
    new THREE.ExtrudeGeometry(visorCurve, {
      depth: 0.024,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    })
  )
  const vPos = visorGeo.attributes.position
  for (let i = 0; i < vPos.count; i++) {
    const vx = vPos.getX(i)
    const archY = -Math.pow(vx / 0.70, 2) * 0.10
    vPos.setY(i, vPos.getY(i) + archY)
  }
  vPos.needsUpdate = true
  visorGeo.computeVertexNormals()

  const visorMesh = new THREE.Mesh(visorGeo, capMaterial)
  visorMesh.rotation.x = -Math.PI / 2 + 0.18
  visorMesh.position.set(0, 0.08, 0.72)
  group.add(visorMesh)

  // 3. Squatchee top button
  const buttonGeo = clampGeometryUvsToBlankArea(new THREE.SphereGeometry(0.045, 16, 12))
  buttonGeo.scale(1.2, 0.6, 1.2)
  const buttonMesh = new THREE.Mesh(buttonGeo, capMaterial)
  buttonMesh.position.set(0, 0.90, 0)
  group.add(buttonMesh)

  group.position.y = -0.30

  return {
    group,
    mainMesh,
    materials: [capMaterial],
  }
}

/**
 * Creates Plush Blanket with soft draped ripples.
 */
function createPlushBlanket(
  dynamicTexture: THREE.CanvasTexture,
  fabricNormal: THREE.CanvasTexture
): ModelBuildResult {
  const group = new THREE.Group()

  const fleeceMaterial = new THREE.MeshPhysicalMaterial({
    map: dynamicTexture,
    normalMap: fabricNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.94,
    metalness: 0.0,
    sheen: 0.40,
    sheenRoughness: 0.80,
    sheenColor: new THREE.Color(0x999999),
    side: THREE.DoubleSide,
  })

  const blanketGeo = new THREE.PlaneGeometry(1.80, 2.10, 48, 48)
  const pos = blanketGeo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i)
    const py = pos.getY(i)
    const ripple =
      Math.sin(px * 3.5) * Math.cos(py * 2.8) * 0.035 + Math.sin((px + py) * 4.0) * 0.018
    pos.setZ(i, ripple)
  }
  pos.needsUpdate = true
  blanketGeo.computeVertexNormals()

  const uvs = blanketGeo.attributes.uv
  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i)
    const v = uvs.getY(i)
    uvs.setXY(i, 0.05 + u * 0.40, 0.10 + v * 0.80)
  }
  uvs.needsUpdate = true

  const mainMesh = new THREE.Mesh(blanketGeo, fleeceMaterial)
  group.add(mainMesh)

  return {
    group,
    mainMesh,
    materials: [fleeceMaterial],
  }
}

/**
 * Builds the complete 3D product mesh hierarchy for any supported product.
 */
export function buildProduct3DModel(
  type: Product3DType,
  dynamicTexture: THREE.CanvasTexture,
  fabricNormal: THREE.CanvasTexture
): ModelBuildResult {
  // Handle ceramic mug
  if (type === 'mug') {
    return createCeramicMug(dynamicTexture)
  }

  // Handle canvas tote bag
  if (type === 'tote') {
    return createToteBag(dynamicTexture, fabricNormal)
  }

  // Handle baseball cap / dad hat
  if (type === 'cap' || type === 'hat') {
    return createBaseballCap(dynamicTexture, fabricNormal)
  }

  // Handle plush blanket
  if (type === 'blanket' || type === 'pillow') {
    return createPlushBlanket(dynamicTexture, fabricNormal)
  }

  // Fabric garments (tshirt, longsleeve, tank, sweatshirt, hoodie, hoodie-zip, polo, jacket)
  const group = new THREE.Group()

  const fabricMaterial = new THREE.MeshPhysicalMaterial({
    map: dynamicTexture,
    normalMap: fabricNormal,
    normalScale: new THREE.Vector2(0.20, 0.20),
    roughness: 0.94, // Authentic matte organic cotton / fleece / jersey
    metalness: 0.0,
    sheen: 0.28,
    sheenRoughness: 0.75,
    sheenColor: new THREE.Color(0x888888),
    side: THREE.DoubleSide,
  })

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.95,
    roughness: 0.20,
  })

  const isHooded = type === 'hoodie' || type === 'hoodie-zip'

  // If hoodie and high-fidelity 3D mesh is available, use photorealistic model directly
  if (isHooded && cachedHoodieGeometry) {
    const mainMesh = new THREE.Mesh(cachedHoodieGeometry, fabricMaterial)
    group.add(mainMesh)

    // Metal zipper for full-zip hoodie, accurately positioned on front surface
    if (type === 'hoodie-zip') {
      const zipper = createZipperMesh(metalMaterial, 0.405)
      group.add(zipper)
    }

    return {
      group,
      mainMesh,
      materials: [fabricMaterial, metalMaterial],
    }
  }

  // 1. Sculpted Anatomical Torso
  const torsoGeo = createSculptedTorsoGeometry(type)
  const mainMesh = new THREE.Mesh(torsoGeo, fabricMaterial)
  group.add(mainMesh)

  // 2. Collar / Neckline Ribbing
  if (!isHooded && type !== 'polo') {
    const collarRib = createRealisticNeckRibbon(fabricMaterial)
    group.add(collarRib)
  }

  // 3. Sleeves
  let sleeveType: 'none' | 'short' | 'long' = 'short'
  if (type === 'tank') {
    sleeveType = 'none'
  } else if (
    type === 'longsleeve' ||
    type === 'sweatshirt' ||
    type === 'hoodie' ||
    type === 'hoodie-zip' ||
    type === 'jacket'
  ) {
    sleeveType = 'long'
  }

  const sleeveMeshes = createRealisticSleeves(sleeveType, fabricMaterial)
  sleeveMeshes.forEach((m) => group.add(m))

  // 4. Hood & Drawstrings (for fallback hooded mesh)
  if (isHooded) {
    const hoodGroup = createHoodMesh(fabricMaterial, metalMaterial, true)
    group.add(hoodGroup)
  }

  // 5. Zipper (if full-zip hoodie or jacket)
  if (type === 'hoodie-zip' || type === 'jacket') {
    const zipper = createZipperMesh(metalMaterial, 0.255)
    group.add(zipper)
  }

  // 6. Polo collar (if polo)
  if (type === 'polo') {
    const poloCollar = createPoloCollarMesh(fabricMaterial)
    group.add(poloCollar)
  }

  return {
    group,
    mainMesh,
    materials: [fabricMaterial, metalMaterial],
  }
}
