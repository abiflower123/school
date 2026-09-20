import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
}

const files = walkSync(path.join(__dirname, 'src'));
let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Colors
  content = content.replace(/slate-/g, 'zinc-');
  
  // Wait, cyan might be too playful. Let's make primary buttons black, but keep some accent cyan or change to neutral.
  // We will keep cyan for now but make sure neutral structure is zinc.

  // Radii - single pass
  content = content.replace(/rounded-(2xl|3xl|xl)/g, (match, p1) => {
    if (p1 === '3xl') return 'rounded-2xl';
    if (p1 === '2xl') return 'rounded-xl';
    if (p1 === 'xl') return 'rounded-lg';
    return match;
  });
  
  // Icon stroke widths
  content = content.replace(/strokeWidth=\{1\.8\}/g, 'strokeWidth={1.5}');
  content = content.replace(/strokeWidth=\{2\}/g, 'strokeWidth={1.5}');
  
  // Shadows
  content = content.replace(/shadow-md/g, 'shadow-sm');

  // Background specific replacements for buttons
  content = content.replace(/bg-cyan-500/g, 'bg-zinc-900');
  content = content.replace(/hover:bg-cyan-600/g, 'hover:bg-zinc-800');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Updated ${changedFiles} files successfully.`);
