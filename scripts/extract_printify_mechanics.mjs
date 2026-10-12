import fs from 'fs';
import path from 'path';

const bundles = [
  'scripts/printify_bundles/bundle_1.js',
  'scripts/printify_bundles/bundle_2.js'
];

function analyze() {
  console.log('=== REVERSE-ENGINEERING PRINTIFY STUDIO MECHANICS ===\n');

  for (const bPath of bundles) {
    if (!fs.existsSync(bPath)) continue;
    const content = fs.readFileSync(bPath, 'utf8');
    console.log(`Analyzing ${bPath} (${(content.length / 1024 / 1024).toFixed(2)} MB)...`);

    // 1. Search for Curved Text / Text Arc / textPath
    console.log('\n--- 1. CURVED TEXT & TYPOGRAPHY ---');
    const textPathMatches = content.match(/.{0,80}(textPath|arc|curvature|letterSpacing|charSpacing|fontSize|fontFamily).{0,80}/gi) || [];
    console.log(`Found ${textPathMatches.length} typography/arc references.`);
    // Sample a few relevant ones
    const relevantText = textPathMatches.filter(m => m.includes('arc') || m.includes('textPath') || m.includes('curvature') || m.includes('letterSpacing')).slice(0, 8);
    relevantText.forEach(m => console.log('Snippet:', m.trim().replace(/\s+/g, ' ')));

    // 2. Search for Displacement Map / Mockup Shaders / Blend Modes
    console.log('\n--- 2. MOCKUP SHADERS, BLENDING & DISPLACEMENT ---');
    const shaderMatches = content.match(/.{0,80}(feDisplacementMap|displacementMap|feBlend|mix-blend-mode|blendMode|displacementScale|textureCoord).{0,80}/gi) || [];
    console.log(`Found ${shaderMatches.length} shader/displacement matches.`);
    shaderMatches.slice(0, 8).forEach(m => console.log('Snippet:', m.trim().replace(/\s+/g, ' ')));

    // 3. Search for Templates & Clipart/Graphics Structures
    console.log('\n--- 3. TEMPLATES & GRAPHICS DATA MODELS ---');
    const templateMatches = content.match(/.{0,80}(template|templates|graphics|clipart|library|stickers).{0,80}/gi) || [];
    console.log(`Found ${templateMatches.length} template/graphics matches.`);
    const relevantTemplates = templateMatches.filter(m => m.includes('categories') || m.includes('layers') || m.includes('templateId')).slice(0, 6);
    relevantTemplates.forEach(m => console.log('Snippet:', m.trim().replace(/\s+/g, ' ')));

    // 4. Search for Multi-view & Variant syncing (front, back, etc.)
    console.log('\n--- 4. MULTI-VIEW & PRINT AREA ARCHITECTURE ---');
    const viewMatches = content.match(/.{0,80}(front|back|sleeve_left|sleeve_right|printArea|placeholders).{0,80}/gi) || [];
    console.log(`Found ${viewMatches.length} print area/view matches.`);
    const relevantViews = viewMatches.filter(m => m.includes('front') && m.includes('back')).slice(0, 6);
    relevantViews.forEach(m => console.log('Snippet:', m.trim().replace(/\s+/g, ' ')));
  }
}

analyze();
