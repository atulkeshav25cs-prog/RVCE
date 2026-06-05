const fs = require('fs');
const path = require('path');

const citizenDir = path.join(__dirname, 'public', 'images', 'auth', 'citizen');
const authorityDir = path.join(__dirname, 'public', 'images', 'auth', 'authority');

fs.mkdirSync(citizenDir, { recursive: true });
fs.mkdirSync(authorityDir, { recursive: true });

// A 1x1 pixel dark blue PNG base64 (to fit the navy theme)
const darkBluePngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(darkBluePngBase64, 'base64');

const citizenImages = [
  'rescue-team.jpg',
  'flood-response.jpg',
  'medical-emergency.jpg',
  'fire-ops.jpg',
  'search-rescue.jpg',
  'disaster-recovery.jpg'
];

const authorityImages = [
  'command-center.jpg',
  'operations-room.jpg',
  'crisis-management.jpg',
  'dispatch-center.jpg',
  'monitoring-system.jpg',
  'control-room.jpg'
];

for (const img of citizenImages) {
  fs.writeFileSync(path.join(citizenDir, img), buffer);
}

for (const img of authorityImages) {
  fs.writeFileSync(path.join(authorityDir, img), buffer);
}

console.log("Placeholder images created successfully.");
