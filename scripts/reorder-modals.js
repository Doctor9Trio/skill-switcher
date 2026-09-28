const fs = require('fs');

function reorderFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const scriptMarker = '<!-- Skill Switcher JavaScript (load order: data → state → services → ui) -->';
  const layaMarker = '<!-- Laya System 1 Decision Playground Modal -->';
  const endBodyMarker = '</body>';

  if (!content.includes(scriptMarker) || !content.includes(layaMarker)) {
    console.log(`Skipping ${filePath}: markers not found`);
    return;
  }

  const scriptIdx = content.indexOf(scriptMarker);
  const layaIdx = content.indexOf(layaMarker);
  const endBodyIdx = content.indexOf(endBodyMarker);

  if (layaIdx > scriptIdx && endBodyIdx > layaIdx) {
    const beforeScripts = content.substring(0, scriptIdx);
    const scriptsBlock = content.substring(scriptIdx, layaIdx).trim();
    const modalsBlock = content.substring(layaIdx, endBodyIdx).trim();
    const afterBody = content.substring(endBodyIdx);

    const newContent = `${beforeScripts}\n${modalsBlock}\n\n${scriptsBlock}\n\n${afterBody}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully reordered modals in ${filePath}`);
  } else {
    console.log(`Already in correct order or unrecognized structure in ${filePath}`);
  }
}

reorderFile('index.html');
if (fs.existsSync('skill-gui.html')) {
  reorderFile('skill-gui.html');
}
