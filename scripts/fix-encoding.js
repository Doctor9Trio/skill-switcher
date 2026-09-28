const fs = require('fs');
const path = require('path');

function fixFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

const htmlReplacements = [
  ['INR (???)', 'INR (₹)'],
  ['Live Agent: ???0.00', 'Live Agent: ₹0.00'],
  ['???0.00', '₹0.00'],
  ['(??? INR)', '(₹ INR)'],
  ['Rate: ???86.50', 'Rate: ₹86.50'],
  ['??? INR', '₹ INR'],
  ['??? Gemini 3.7 / 3.8 Flash', 'Gemini 3.7 / 3.8 Flash'],
  ['???? Gemini 1.5 / 2.5 Pro', 'Gemini 1.5 / 2.5 Pro'],
  ['???? Claude 3.5 Sonnet', 'Claude 3.5 Sonnet'],
  ['??? Claude 3.5 Haiku', 'Claude 3.5 Haiku'],
  ['???? GPT-4o', 'GPT-4o'],
  ['???? Incoming (Input) Tokens', 'Incoming (Input) Tokens'],
  ['???? Outgoing (Output) Tokens', 'Outgoing (Output) Tokens'],
  ['??? Cumulative Total', 'Cumulative Total'],
  ['???? Net Cost', 'Net Cost']
];

fixFile(path.join(__dirname, '..', 'index.html'), htmlReplacements);
fixFile(path.join(__dirname, '..', 'skill-gui.html'), htmlReplacements);

const telemetryReplacements = [
  ["heroInrEl.textContent = '???' + costInr", "heroInrEl.textContent = '₹' + costInr"],
  ["heroUsdEl.textContent = `??? $${costUsd.toFixed(4)} USD (Exchange Benchmark: ???86.50/USD)`;", "heroUsdEl.textContent = `≈ $${costUsd.toFixed(4)} USD (Exchange Benchmark: ₹86.50/USD)`;"],
  ["heroUsdEl.textContent = `??? ???${costInr.toFixed(2)} INR (Exchange Benchmark: ???86.50/USD)`;", "heroUsdEl.textContent = `≈ ₹${costInr.toFixed(2)} INR (Exchange Benchmark: ₹86.50/USD)`;"],
  ["if (statCostEl) statCostEl.textContent = '???' + costInr.toFixed(2);", "if (statCostEl) statCostEl.textContent = '₹' + costInr.toFixed(2);"],
  ["navLabel.textContent = `Live Agent: ???${costInr.toFixed(2)}`;", "navLabel.textContent = `Live Agent: ₹${costInr.toFixed(2)}`;"],
  ["sidebarCost.textContent = `???${costInr.toFixed(2)}`;", "sidebarCost.textContent = `₹${costInr.toFixed(2)}`;"],
  ["sidebarCost.title = `Estimated Session Cost: ???${costInr.toFixed(2)} INR ($${costUsd.toFixed(4)} USD). Click to inspect token telemetry.`;", "sidebarCost.title = `Estimated Session Cost: ₹${costInr.toFixed(2)} INR ($${costUsd.toFixed(4)} USD). Click to inspect token telemetry.`;"]
];

fixFile(path.join(__dirname, '..', 'js', 'services', 'telemetry.js'), telemetryReplacements);

const renderModalsReplacements = [
  ['0 active skills staged ??? try broader keywords', '0 active skills staged — try broader keywords'],
  ['showToast(`??? Staged ${activatedCount} matching skills in active workspace selection!`);', 'showToast(`Staged ${activatedCount} matching skills in active workspace selection!`);']
];

fixFile(path.join(__dirname, '..', 'js', 'ui', 'render-modals.js'), renderModalsReplacements);
console.log('All encoding issues fixed!');
