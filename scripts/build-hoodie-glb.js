const fs = require('fs');
global.document = {
  createElementNS: () => ({ setAttribute: () => {}, addEventListener: () => {} }),
  createElement: () => ({ setAttribute: () => {}, addEventListener: () => {} })
};
global.window = {};

class MockFileReader {
  async readAsArrayBuffer(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    this.result = arrayBuffer;
    if (this.onloadend) this.onloadend();
  }
}
global.FileReader = MockFileReader;

const { FBXLoader } = require('three/examples/jsm/loaders/FBXLoader.js');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');

console.log('Loading reference FBX model from C:/Users/Davea/Downloads/hoodie/source/Hoodie.fbx...');
const buf = fs.readFileSync('C:/Users/Davea/Downloads/hoodie/source/Hoodie.fbx');
const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new FBXLoader();
const fbxObj = loader.parse(arrayBuf, '');

let mesh;
fbxObj.traverse(c => {
  if (c.isMesh) mesh = c;
});

if (!mesh) {
  console.error('No mesh found in FBX!');
  process.exit(1);
}

const geom = mesh.geometry.clone();

// 1. Center geometry at origin (0, 0, 0)
geom.center();
geom.computeBoundingBox();

// 2. Scale to match standard viewer height (1.6 units)
const targetHeight = 1.6;
const currentHeight = geom.boundingBox.max.y - geom.boundingBox.min.y;
const scale = targetHeight / currentHeight;
geom.scale(scale, scale, scale);
geom.computeBoundingBox();

console.log('Processed Bounding Box:');
console.log('  X:', geom.boundingBox.min.x.toFixed(3), 'to', geom.boundingBox.max.x.toFixed(3));
console.log('  Y:', geom.boundingBox.min.y.toFixed(3), 'to', geom.boundingBox.max.y.toFixed(3));
console.log('  Z:', geom.boundingBox.min.z.toFixed(3), 'to', geom.boundingBox.max.z.toFixed(3));

// 3. Compute Conformal Dual-Side UV Mapping
const pos = geom.attributes.position;
const uvs = new Float32Array(pos.count * 2);

for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const z = pos.getZ(i);

  const isFront = z >= -0.02; // subtle bias forward to include side seams
  const isHood = y > 0.32;
  const isSleeve = Math.abs(x) > 0.46;

  let u = 0.25;
  let v = 0.65;

  if (isHood) {
    // Hood: map to clean fabric region (Canvas Y: 1330..1550 -> V: 0.24..0.35)
    // Front half of hood uses U around 0.25, back of hood uses U around 0.75
    const hoodBaseU = isFront ? 0.25 : 0.75;
    const hoodNormX = Math.max(-1, Math.min(1, x / 0.38));
    u = hoodBaseU + (isFront ? hoodNormX : -hoodNormX) * 0.12;
    v = 0.24 + Math.max(0, Math.min(1, (y - 0.32) / 0.48)) * 0.11;
  } else if (isSleeve) {
    // Sleeves: map to clean fabric margins
    const sleeveNormY = Math.max(0, Math.min(1, (y + 0.75) / 1.05));
    if (isFront) {
      if (x < -0.46) {
        // Left sleeve (front): Canvas X: 40..100 -> U: 0.02..0.05
        const ext = Math.min(1, (Math.abs(x) - 0.46) / 0.75);
        u = 0.05 - ext * 0.03;
      } else {
        // Right sleeve (front): Canvas X: 924..984 -> U: 0.45..0.48
        const ext = Math.min(1, (x - 0.46) / 0.75);
        u = 0.45 + ext * 0.03;
      }
      v = 0.18 + sleeveNormY * 0.22;
    } else {
      if (x < -0.46) {
        // Left sleeve (back): Canvas X: 1064..1124 -> U: 0.52..0.55
        const ext = Math.min(1, (Math.abs(x) - 0.46) / 0.75);
        u = 0.55 - ext * 0.03;
      } else {
        // Right sleeve (back): Canvas X: 1948..2008 -> U: 0.95..0.98
        const ext = Math.min(1, (x - 0.46) / 0.75);
        u = 0.95 + ext * 0.03;
      }
      v = 0.18 + sleeveNormY * 0.22;
    }
  } else {
    // Torso (Front & Back):
    // Standard 500x500 print zone sits comfortably on upper chest / back
    const normX = Math.max(-1, Math.min(1, x / 0.46));
    const normY = (y - 0.08) * 0.54;

    if (isFront) {
      // Front Torso: Center chest at U = 0.25, V = 0.6484
      u = 0.25 + normX * 0.185;
      v = 0.6484 + normY;
    } else {
      // Back Torso: Center back at U = 0.75, V = 0.6484
      u = 0.75 - normX * 0.185;
      v = 0.6484 + normY;
    }
  }

  uvs[i * 2] = u;
  uvs[i * 2 + 1] = v;
}

geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
geom.computeVertexNormals();

const cleanMesh = new THREE.Mesh(
  geom,
  new THREE.MeshStandardMaterial({ name: 'hoodie_fabric_material' })
);

fs.mkdirSync('public/models', { recursive: true });

const exporter = new GLTFExporter();
exporter.parse(
  cleanMesh,
  (gltf) => {
    if (gltf instanceof ArrayBuffer) {
      fs.writeFileSync('public/models/hoodie.glb', Buffer.from(gltf));
      console.log('SUCCESS! Wrote public/models/hoodie.glb, size bytes:', fs.statSync('public/models/hoodie.glb').size);
    }
  },
  (err) => {
    console.error('GLTFExporter error:', err);
  },
  { binary: true }
);
