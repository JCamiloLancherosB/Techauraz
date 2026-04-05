/**
 * Purge unused food/fashion/cosmetic icons from icon-accordion.liquid
 * Keeps only tech-relevant icons for TechAuraz store
 * Run: node scripts/purge-icons.mjs
 */
import fs from 'fs';
import path from 'path';

const KEEP_ICONS = new Set([
  'box', 'chat_bubble', 'check_mark', 'clipboard', 'eye', 'fire',
  'heart', 'lightning_bolt', 'lock', 'map_pin', 'plane', 'price_tag',
  'question_mark', 'recycle', 'return', 'ruler', 'serving_dish',
  'star', 'stopwatch', 'truck'
]);

const filePath = path.resolve('snippets/icon-accordion.liquid');
const content = fs.readFileSync(filePath, 'utf-8');

// Backup
fs.writeFileSync(filePath + '.bak', content);
console.log(`Backup created: ${filePath}.bak`);
console.log(`Original size: ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);

const lines = content.split(/\r?\n/);
const newLines = [];
let skipUntilNextWhen = false;
let removedIcons = [];
let keptIcons = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const whenMatch = line.match(/\{%-?\s*when\s+'(\w+)'\s*-%?\}/);
  
  if (whenMatch) {
    const iconName = whenMatch[1];
    if (!KEEP_ICONS.has(iconName)) {
      skipUntilNextWhen = true;
      removedIcons.push(iconName);
      continue;
    } else {
      skipUntilNextWhen = false;
      keptIcons.push(iconName);
    }
  }
  
  if (skipUntilNextWhen) {
    // Check if we hit next when or endcase
    if (line.match(/\{%-?\s*endcase\s*-%?\}/)) {
      skipUntilNextWhen = false;
      newLines.push(line);
    }
    continue;
  }
  
  newLines.push(line);
}

const newContent = newLines.join('\n');
fs.writeFileSync(filePath, newContent);

console.log(`\nNew size: ${(Buffer.byteLength(newContent) / 1024).toFixed(1)} KB`);
console.log(`\nKept ${keptIcons.length} icons: ${keptIcons.join(', ')}`);
console.log(`Removed ${removedIcons.length} icons: ${removedIcons.join(', ')}`);
console.log(`\nSize reduction: ${((1 - Buffer.byteLength(newContent) / Buffer.byteLength(content)) * 100).toFixed(1)}%`);
