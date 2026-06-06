const fs = require('fs');
let content = fs.readFileSync('src/data/coursesData.ts', 'utf8');
content = content.replace(/duration:\s*'([^']+)'\s*\}/g, "duration: '$1', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' }");
fs.writeFileSync('src/data/coursesData.ts', content);
