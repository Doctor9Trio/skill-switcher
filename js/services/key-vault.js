/* Skill Switcher — Key Vault & Credential Service */
/* Contains: getSkillCredentialInfo, renderSkillHeaderKeyBadge, openDirectSkillCredentialModal, */
/*           saveSkillCredentials, getCustomVaultKeys, getAllVaultKeys, openKeyVaultModal, */
/*           renderKeyVaultList, saveKeyVaultEntry, clearKeyVaultEntry, addCustomKeyFromVault, */
/*           saveSkillApiKey, clearSkillApiKey, updateModalApiKeySection */

function getSkillCredentialInfo(s) {
  // STRICT: Only skills explicitly configured in SKILL_CRED_MAP or with s.requiresApiKey qualify
  const custom = SKILL_CRED_MAP[s.id];
  if (!custom && !s.requiresApiKey) {
    return {
      isRequired: false,
      hasCredentials: false
    };
  }

  const def = custom || {};
  const keyVar = def.keyVar || s.apiKeyName || (s.id.toUpperCase().replace(/-/g, '_') + '_API_KEY');
  const passVar = def.passVar || (s.id.toUpperCase().replace(/-/g, '_') + '_PASSWORD');
  const isPasswordPrimary = Boolean(def.isPasswordPrimary);
  
  const savedKey = localStorage.getItem('apikey_' + keyVar) || localStorage.getItem('apikey_' + s.id) || '';
  const savedPass = localStorage.getItem('password_' + passVar) || localStorage.getItem('password_' + s.id) || '';
  const isConfigured = Boolean(savedKey.trim() || savedPass.trim());
  
  return {
    keyVar,
    passVar,
    keyLabel: def.keyLabel || `${s.name} API Key`,
    passLabel: def.passLabel || `${s.name} Password`,
    isPasswordPrimary,
    isRequired: true,
    hasCredentials: true,
    savedKey,
    savedPass,
    isConfigured
  };
}

function renderSkillHeaderKeyBadge(s) {
  const info = getSkillCredentialInfo(s);
  if (!info.hasCredentials) return '';
  
  const isPass = info.isPasswordPrimary;
  const label = isPass ? 'Password' : 'Key';
  const icon = isPass ? '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4Zm2 2h4V4a2 2 0 1 0-4 0v2Zm-2.25 1.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5Z"/></svg>' : '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>';
  
  if (info.isConfigured) {
    return `
      <button class="skill-key-badge saved" 
              onclick="event.stopPropagation(); openDirectSkillCredentialModal('${s.id}')" 
              title="Configured in localStorage - Click to view or edit ${isPass ? info.passVar : info.keyVar}">
        <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> ${label} Saved
      </button>
    `;
  } else {
    return `
      <button class="skill-key-badge needed ${isPass ? 'pass' : ''}" 
              onclick="event.stopPropagation(); openDirectSkillCredentialModal('${s.id}')" 
              title="Requires ${isPass ? info.passVar : info.keyVar} - Click to configure">
        ${icon} Requires ${label}
      </button>
    `;
  }
}

function getRepoCredentialInfo(r) {
  if (!r) return { hasCredentials: false };

  const credSkills = (r.subskills || []).filter(s => {
    const info = getSkillCredentialInfo(s);
    return info && info.hasCredentials;
  });

  if (!credSkills.length && !r.hasApiKey) {
    return { hasCredentials: false };
  }

  const items = [];
  const seenVars = new Set();
  let allConfigured = true;

  credSkills.forEach(s => {
    const info = getSkillCredentialInfo(s);
    const varName = info.isPasswordPrimary ? info.passVar : info.keyVar;
    if (!seenVars.has(varName)) {
      seenVars.add(varName);
      items.push({
        skillId: s.id,
        skillName: s.name,
        varName: varName,
        label: info.keyLabel,
        isPassword: info.isPasswordPrimary,
        isConfigured: info.isConfigured
      });
    }
    if (!info.isConfigured) {
      allConfigured = false;
    }
  });

  if (!items.length && r.hasApiKey) {
    const fallbackVar = r.apiKeyName || (r.name.split('/')[1] || r.id).toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_API_KEY';
    const saved = localStorage.getItem('apikey_' + fallbackVar) || '';
    const isConfigured = Boolean(saved && saved.trim());
    items.push({
      skillId: r.subskills && r.subskills[0] ? r.subskills[0].id : null,
      skillName: r.name,
      varName: fallbackVar,
      label: 'API Key',
      isPassword: false,
      isConfigured: isConfigured
    });
    allConfigured = isConfigured;
  }

  const primary = items[0] || {};
  const isPass = items.length > 0 && items.every(i => i.isPassword);
  
  return {
    hasCredentials: true,
    allConfigured,
    items,
    credSkills,
    primaryVar: primary.varName || '',
    primarySkillId: primary.skillId || (credSkills[0] ? credSkills[0].id : null),
    isPassword: isPass,
    varNames: items.map(i => i.varName).join(', ')
  };
}

function renderRepoHeaderKeyBadge(r) {
  const cred = getRepoCredentialInfo(r);
  if (!cred || !cred.hasCredentials) return '';

  const isPass = cred.isPassword;
  const label = isPass ? 'Password' : 'API Key';
  const targetSkillId = cred.primarySkillId;
  const clickAction = targetSkillId
    ? `openDirectSkillCredentialModal('${targetSkillId}')`
    : `openKeyVaultFor('${cred.primaryVar}')`;

  if (cred.allConfigured) {
    return `
      <button class="skill-key-badge saved repo-key-badge" 
              onclick="event.stopPropagation(); ${clickAction}" 
              title="Configured in localStorage (${cred.varNames}) - Click to view or edit">
        <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
        </svg>
        <span>${label} Saved</span>
      </button>
    `;
  } else {
    const icon = isPass
      ? `<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4Zm2 2h4V4a2 2 0 1 0-4 0v2Zm-2.25 1.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5Z"/></svg>`
      : `<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>`;

    return `
      <button class="skill-key-badge needed ${isPass ? 'pass' : ''} repo-key-badge" 
              onclick="event.stopPropagation(); ${clickAction}" 
              title="Requires ${cred.varNames} - Click to configure key">
        ${icon}
        <span>Needs ${label}</span>
      </button>
    `;
  }
}

function openDirectSkillCredentialModal(skillId) {
  const skill = ALL_SKILLS.find(s => s.id === skillId);
  if (!skill) return;
  activeSkillCredTarget = skill;
  
  const info = getSkillCredentialInfo(skill);
  document.getElementById('scm-title').textContent = `Credentials: ${skill.name}`;
  document.getElementById('scm-subtitle').textContent = `Target Repository: ${skill.repoName || skill.cat}`;
  
  document.getElementById('scm-key-var').textContent = info.keyVar;
  document.getElementById('scm-pass-var').textContent = info.passVar;
  
  const keyInput = document.getElementById('scm-key-input');
  const passInput = document.getElementById('scm-pass-input');
  keyInput.value = info.savedKey;
  passInput.value = info.savedPass;
  
  updateSkillCredModalStatuses(info);
  
  document.getElementById('skill-cred-modal-overlay').style.display = 'flex';
  setTimeout(() => {
    if (info.isPasswordPrimary && passInput) {
      passInput.focus();
    } else if (keyInput) {
      keyInput.focus();
    }
  }, 100);
}

function updateSkillCredModalStatuses(info) {
  const kStat = document.getElementById('scm-key-status');
  const pStat = document.getElementById('scm-pass-status');
  
  if (info.savedKey) {
    kStat.className = 'cred-state-pill state-saved';
    kStat.textContent = 'Saved in localStorage';
  } else {
    kStat.className = 'cred-state-pill state-need';
    kStat.textContent = 'Not Set';
  }
  
  if (info.savedPass) {
    pStat.className = 'cred-state-pill state-saved';
    pStat.textContent = 'Saved in localStorage';
  } else {
    pStat.className = 'cred-state-pill state-need';
    pStat.textContent = 'Not Set';
  }
}


function toggleInputVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M.143 2.31 1.8 3.766A8.528 8.528 0 0 0 .43 7.101a1.62 1.62 0 0 0 0 1.798c.45.678 1.367 1.932 2.637 3.023C4.33 13.008 6.019 14 8 14c1.47 0 2.753-.544 3.829-1.328l2.861 2.518a.75.75 0 1 0 .984-1.134L1.127 1.176A.75.75 0 0 0 .143 2.31Zm4.053 3.551 1.78 1.563a2.502 2.502 0 0 0 3.208 2.816l1.246 1.096A6.99 6.99 0 0 1 8 12.5c-1.557 0-2.98-1.08-4.127-2.062C2.756 9.476 1.991 8.448 1.679 8c.28-.403.92-1.302 1.884-2.139h.633ZM15.57 8.899c-.45.678-1.367 1.932-2.637 3.023a8.878 8.878 0 0 1-1.854 1.258l-1.09-1.09a7.37 7.37 0 0 0 1.444-.929C12.557 10.18 13.98 9.1 14.321 8c-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-.78 0-1.527.27-2.192.748L4.622 3.062A8.47 8.47 0 0 1 8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798Z"/></svg>';
  } else {
    input.type = 'password';
    if (btn) btn.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 8c.312.448 1.077 1.476 2.194 2.438C5.02 11.42 6.443 12.5 8 12.5c1.557 0 2.98-1.08 4.127-2.062 1.117-.962 1.882-1.99 2.194-2.438-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-1.557 0-2.98 1.08-4.127 2.062C2.756 6.524 1.991 7.552 1.679 8ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/></svg>';
  }
}

function closeSkillCredModal() {
  document.getElementById('skill-cred-modal-overlay').style.display = 'none';
  activeSkillCredTarget = null;
}

function saveSkillCredentials() {
  if (!activeSkillCredTarget) return;
  const info = getSkillCredentialInfo(activeSkillCredTarget);
  const keyVal = document.getElementById('scm-key-input').value.trim();
  const passVal = document.getElementById('scm-pass-input').value.trim();
  
  if (keyVal) {
    localStorage.setItem('apikey_' + info.keyVar, keyVal);
  } else {
    localStorage.removeItem('apikey_' + info.keyVar);
  }
  
  if (passVal) {
    localStorage.setItem('password_' + info.passVar, passVal);
  } else {
    localStorage.removeItem('password_' + info.passVar);
  }
  
  showToast(`Saved credentials for ${activeSkillCredTarget.name}!`);
  closeSkillCredModal();
  updateUI();
  updateKeyVaultNavBadge();
}

function clearSkillCredentials() {
  if (!activeSkillCredTarget) return;
  const info = getSkillCredentialInfo(activeSkillCredTarget);
  localStorage.removeItem('apikey_' + info.keyVar);
  localStorage.removeItem('apikey_' + activeSkillCredTarget.id);
  localStorage.removeItem('password_' + info.passVar);
  localStorage.removeItem('password_' + activeSkillCredTarget.id);
  
  document.getElementById('scm-key-input').value = '';
  document.getElementById('scm-pass-input').value = '';
  showToast(`Cleared credentials for ${activeSkillCredTarget.name}`);
  closeSkillCredModal();
  updateUI();
  updateKeyVaultNavBadge();
}

function isSkillCredConfigured(s) {
  const info = getSkillCredentialInfo(s);
  return info.isConfigured;
}

function getCardCredentialBadgeHtml(s) {
  const info = getSkillCredentialInfo(s);
  const isPass = info.isPasswordPrimary;
  const sym = isPass ? '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4Zm2 2h4V4a2 2 0 1 0-4 0v2Zm-2.25 1.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5Z"/></svg>' : '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>';
  const label = isPass ? 'Password' : 'API Key';
  const varName = isPass ? info.passVar : info.keyVar;
  
  if (info.isConfigured) {
    const preview = info.savedKey ? (info.savedKey.slice(0, 4) + '****') : (info.savedPass ? '********' : '');
    return `
      <div class="card-cred-badge saved" onclick="event.stopPropagation(); openDirectSkillCredentialModal('${s.id}')" title="Configured in localStorage - Click to edit or view">
        <span class="cred-sym">${sym}</span>
        <span class="cred-name">${label}: <strong>${varName}</strong></span>
        <span class="cred-state-pill state-saved"><svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Saved (${preview})</span>
      </div>
    `;
  } else if (info.isRequired) {
    return `
      <div class="card-cred-badge need" onclick="event.stopPropagation(); openDirectSkillCredentialModal('${s.id}')" title="Credentials required by this skill - Click to add">
        <span class="cred-sym">${sym}</span>
        <span class="cred-name">${label}: <strong>${varName}</strong></span>
        <span class="cred-state-pill state-need">+ Add ${isPass ? 'Pass' : 'Key'}</span>
      </div>
    `;
  } else {
    // Optional / Custom key available
    return `
      <div class="card-cred-badge" onclick="event.stopPropagation(); openDirectSkillCredentialModal('${s.id}')" title="Add custom API key or password to this skill">
        <span class="cred-sym">${sym}</span>
        <span class="cred-name" style="color:var(--fg-muted);">${label}: <strong>${varName}</strong></span>
        <span class="cred-state-pill state-need">+ Configure</span>
      </div>
    `;
  }
}


const KNOWN_API_KEYS = [
  {
    name: "APPLAMA_TOKEN",
    label: "Appllama / Figma Token",
    desc: "Appllama MCP mobile screen scaffolder & Figma Personal Access Token",
    placeholder: "appl_live_... or figd_...",
    skills: ["Appllama Mobile Flows", "Mobile Component Generator"]
  },
  {
    name: "COMPUTER_USE_KEY",
    label: "Anthropic Computer-Use Key",
    desc: "Anthropic API Key for autonomous desktop & OS level mouse/keyboard interaction",
    placeholder: "sk-ant-api03-...",
    skills: ["Agent Desktop Controller"]
  },
  {
    name: "HIGGSFIELD_API_KEY",
    label: "Higgsfield AI Key",
    desc: "Higgsfield API key to run automated Brandkit pipeline & photoshoot generation",
    placeholder: "hf_live_...",
    skills: ["Higgsfield Brandkit", "Higgsfield Websites", "Product Photoshoot"]
  },
  {
    name: "SEEDANCE_API_KEY",
    label: "SeeDance 2.0 Video Key",
    desc: "SeeDance 2.0 API token for automated cinematic video creation & camera loops",
    placeholder: "sd_token_...",
    skills: ["SeeDance 2.0 Video Engine"]
  },
  {
    name: "NEO4J_PASSWORD",
    label: "Neo4j Database Password",
    desc: "Neo4j instance connection password for knowledge graphs & entity maps",
    placeholder: "neo4j_password...",
    skills: ["Neo4JEV Graph Connector"]
  },
  {
    name: "EXCHANGE_API_KEY",
    label: "Exchange Read-Only Key",
    desc: "Read-only cryptocurrency exchange API key for risk simulation bounds",
    placeholder: "api_key_...",
    skills: ["JEV Trader"]
  },
  {
    name: "DEFI_RPC_KEY",
    label: "DeFi / Ethereum RPC Key",
    desc: "Infura / Alchemy / Ethereum RPC endpoint URL for swap tick feeds",
    placeholder: "https://eth-mainnet.g.alchemy.com/v2/...",
    skills: ["Prism Persona Engine"]
  },
  {
    name: "OPENAI_API_KEY",
    label: "OpenAI API Key",
    desc: "OpenAI API Key for GPT-4o, vision tools, and text embeddings",
    placeholder: "sk-proj-...",
    skills: ["MCP Tools & General Agents"]
  },
  {
    name: "ANTHROPIC_API_KEY",
    label: "Anthropic Claude Key",
    desc: "Claude API Key for frontier coding, reasoning, and planning agents",
    placeholder: "sk-ant-api03-...",
    skills: ["Claude Code & Autonomous Sessions"]
  }
];

function getCustomVaultKeys() {
  try {
    return JSON.parse(localStorage.getItem('custom_vault_keys') || '[]');
  } catch (e) {
    return [];
  }
}

function getAllVaultKeys() {
  const customNames = getCustomVaultKeys();
  const customObjects = customNames.map(name => ({
    name: name,
    label: name,
    desc: "Custom environment secret configured by user",
    placeholder: "Enter secret value...",
    skills: ["Custom Secret"],
    isCustom: true
  }));
  return [...KNOWN_API_KEYS, ...customObjects];
}

function isSkillKeyConfigured(skill) {
  if (!skill || !skill.requiresApiKey) return false;
  const key1 = localStorage.getItem('apikey_' + skill.id);
  const key2 = skill.apiKeyName ? localStorage.getItem('apikey_' + skill.apiKeyName) : null;
  return Boolean((key1 && key1.trim()) || (key2 && key2.trim()));
}

function getSavedApiKey(skill) {
  if (!skill) return '';
  return localStorage.getItem('apikey_' + skill.id) || (skill.apiKeyName ? localStorage.getItem('apikey_' + skill.apiKeyName) : '') || '';
}

function updateKeyVaultNavBadge() {
  const all = getAllVaultKeys();
  const configured = all.filter(k => {
    const val = localStorage.getItem('apikey_' + k.name);
    return Boolean(val && val.trim());
  }).length;
  
  const badge = document.getElementById('key-vault-nav-badge');
  if (badge) badge.textContent = configured;
  
  const modalCount = document.getElementById('keyvault-configured-count');
  if (modalCount) modalCount.textContent = `${configured} of ${all.length} configured`;
}

function openKeyVaultModal(focusKeyName = null) {
  const overlay = document.getElementById('keyvault-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  renderKeyVaultList('');
  updateKeyVaultNavBadge();
  
  if (focusKeyName) {
    setTimeout(() => {
      const input = document.getElementById('kv-input-' + focusKeyName);
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }
}

function closeKeyVaultModal() {
  const overlay = document.getElementById('keyvault-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function closeKeyVaultModalOnBackdrop(e) {
  if (e.target.id === 'keyvault-modal-overlay') closeKeyVaultModal();
}

function openKeyVaultFor(keyName) {
  openKeyVaultModal(keyName);
}

function renderKeyVaultList(filterQuery = '') {
  const list = document.getElementById('keyvault-list');
  if (!list) return;
  list.innerHTML = '';
  
  const q = filterQuery.toLowerCase().trim();
  let keys = getAllVaultKeys();
  if (q) {
    keys = keys.filter(k => 
      k.name.toLowerCase().includes(q) || 
      k.label.toLowerCase().includes(q) || 
      k.desc.toLowerCase().includes(q)
    );
  }
  
  if (!keys.length) {
    list.innerHTML = `
      <div style="padding:24px;text-align:center;color:var(--fg-muted);background:var(--bg-card);border:1px solid var(--border-default);border-radius:6px;font-size:12px;">
        No credentials matched "${filterQuery}". You can add it below as a custom environment secret.
      </div>
    `;
    return;
  }
  
  keys.forEach(k => {
    const val = localStorage.getItem('apikey_' + k.name) || '';
    const isSet = Boolean(val && val.trim());
    
    const card = document.createElement('div');
    card.className = 'keyvault-item';
    card.id = 'kv-card-' + k.name;
    
    card.innerHTML = `
      <div class="keyvault-item-head">
        <div class="keyvault-name">
          <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" style="color:${isSet ? 'var(--accent-blue)' : 'var(--fg-muted)'};"><path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"></path></svg>
          <span>${k.name}</span>
          ${k.isCustom ? `<span class="gh-pill" style="font-size:10px;">Custom</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="key-status-badge ${isSet ? 'configured' : ''}">${isSet ? 'Saved in localStorage' : 'Not Set'}</span>
          ${k.isCustom ? `<button class="btn-gh btn-gh-sm btn-gh-ghost" onclick="deleteCustomVaultKey('${k.name}')" title="Delete custom secret" style="color:var(--fg-muted);padding:1px 5px;"><svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg></button>` : ''}
        </div>
      </div>
      <div class="keyvault-desc">${k.desc}</div>
      <div class="keyvault-input-row">
        <input type="password" id="kv-input-${k.name}" class="keyvault-input" placeholder="${k.placeholder || 'Enter value...'}" value="${val.replace(/"/g, '&quot;')}" onkeydown="if(event.key==='Enter') saveKeyVaultEntry('${k.name}')">
        <button class="btn-gh btn-gh-sm" id="kv-eye-${k.name}" onclick="toggleVaultKeyEye('${k.name}')" title="Show/Hide"><svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 8c.312.448 1.077 1.476 2.194 2.438C5.02 11.42 6.443 12.5 8 12.5c1.557 0 2.98-1.08 4.127-2.062 1.117-.962 1.882-1.99 2.194-2.438-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-1.557 0-2.98 1.08-4.127 2.062C2.756 6.524 1.991 7.552 1.679 8ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/></svg></button>
        <button class="btn-gh btn-gh-sm btn-gh-primary" onclick="saveKeyVaultEntry('${k.name}')">Save</button>
        ${isSet ? `<button class="btn-gh btn-gh-sm btn-gh-ghost" onclick="clearKeyVaultEntry('${k.name}')" title="Clear key">Clear</button>` : ''}
      </div>
    `;
    list.appendChild(card);
  });
}

function toggleVaultKeyEye(keyName) {
  const input = document.getElementById('kv-input-' + keyName);
  const eye = document.getElementById('kv-eye-' + keyName);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (eye) eye.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M.143 2.31 1.8 3.766A8.528 8.528 0 0 0 .43 7.101a1.62 1.62 0 0 0 0 1.798c.45.678 1.367 1.932 2.637 3.023C4.33 13.008 6.019 14 8 14c1.47 0 2.753-.544 3.829-1.328l2.861 2.518a.75.75 0 1 0 .984-1.134L1.127 1.176A.75.75 0 0 0 .143 2.31Zm4.053 3.551 1.78 1.563a2.502 2.502 0 0 0 3.208 2.816l1.246 1.096A6.99 6.99 0 0 1 8 12.5c-1.557 0-2.98-1.08-4.127-2.062C2.756 9.476 1.991 8.448 1.679 8c.28-.403.92-1.302 1.884-2.139h.633ZM15.57 8.899c-.45.678-1.367 1.932-2.637 3.023a8.878 8.878 0 0 1-1.854 1.258l-1.09-1.09a7.37 7.37 0 0 0 1.444-.929C12.557 10.18 13.98 9.1 14.321 8c-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-.78 0-1.527.27-2.192.748L4.622 3.062A8.47 8.47 0 0 1 8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798Z"/></svg>';
  } else {
    input.type = 'password';
    if (eye) eye.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 8c.312.448 1.077 1.476 2.194 2.438C5.02 11.42 6.443 12.5 8 12.5c1.557 0 2.98-1.08 4.127-2.062 1.117-.962 1.882-1.99 2.194-2.438-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-1.557 0-2.98 1.08-4.127 2.062C2.756 6.524 1.991 7.552 1.679 8ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/></svg>';
  }
}

function saveKeyVaultEntry(keyName) {
  const input = document.getElementById('kv-input-' + keyName);
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Please type a key or password before saving', false);
    return;
  }
  localStorage.setItem('apikey_' + keyName, val);
  showToast(`Saved ${keyName} to browser localStorage!`, true);
  updateKeyVaultNavBadge();
  renderKeyVaultList(document.getElementById('keyvault-search').value);
  renderCenter();
}

function clearKeyVaultEntry(keyName) {
  localStorage.removeItem('apikey_' + keyName);
  showToast(`Cleared ${keyName} from localStorage`, false);
  updateKeyVaultNavBadge();
  renderKeyVaultList(document.getElementById('keyvault-search').value);
  renderCenter();
}

function addCustomKeyFromVault() {
  const nameInput = document.getElementById('custom-key-name');
  const valInput = document.getElementById('custom-key-val');
  let name = nameInput.value.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const val = valInput.value.trim();
  
  if (!name) {
    showToast('Please enter an environment variable name (e.g. DATABASE_URL)', false);
    return;
  }
  if (!val) {
    showToast('Please enter the secret value', false);
    return;
  }
  
  localStorage.setItem('apikey_' + name, val);
  
  const custom = getCustomVaultKeys();
  if (!custom.includes(name)) {
    custom.push(name);
    localStorage.setItem('custom_vault_keys', JSON.stringify(custom));
  }
  
  nameInput.value = '';
  valInput.value = '';
  showToast(`Added custom secret ${name}!`, true);
  updateKeyVaultNavBadge();
  renderKeyVaultList(document.getElementById('keyvault-search').value);
}

function deleteCustomVaultKey(keyName) {
  localStorage.removeItem('apikey_' + keyName);
  let custom = getCustomVaultKeys();
  custom = custom.filter(k => k !== keyName);
  localStorage.setItem('custom_vault_keys', JSON.stringify(custom));
  showToast(`Removed custom secret ${keyName}`, false);
  updateKeyVaultNavBadge();
  renderKeyVaultList(document.getElementById('keyvault-search').value);
}

function copyAllEnvSnippet() {
  const all = getAllVaultKeys();
  const configured = all.filter(k => {
    const val = localStorage.getItem('apikey_' + k.name);
    return Boolean(val && val.trim());
  });
  
  if (!configured.length) {
    showToast('No API keys configured yet. Enter your keys first!');
    return;
  }
  
  let envText = "# Doctor9Trio / Skill Switcher - Environment Secrets\n# Stored in local browser vault\n\n";
  configured.forEach(k => {
    const val = localStorage.getItem('apikey_' + k.name) || '';
    envText += `${k.name}=${val}\n`;
  });
  
  copySnippetText(envText, `Copied ${configured.length} keys in .env format!`);
}

function saveSkillApiKey() {
  if (!activeModalId) return;
  const s = ALL_SKILLS.find(x => x.id === activeModalId);
  if (!s || !s.requiresApiKey) return;
  const input = document.getElementById('modal-apikey-input');
  const val = input.value.trim();
  if (!val) {
    showToast('Please enter a valid API key string', false);
    return;
  }
  localStorage.setItem('apikey_' + s.id, val);
  if (s.apiKeyName) {
    localStorage.setItem('apikey_' + s.apiKeyName, val);
  }
  showToast(`API Key saved for ${s.name}`, true);
  updateModalApiKeySection(s);
  updateKeyVaultNavBadge();
  renderCenter();
}

function clearSkillApiKey() {
  if (!activeModalId) return;
  const s = ALL_SKILLS.find(x => x.id === activeModalId);
  if (!s || !s.requiresApiKey) return;
  localStorage.removeItem('apikey_' + s.id);
  if (s.apiKeyName) {
    localStorage.removeItem('apikey_' + s.apiKeyName);
  }
  document.getElementById('modal-apikey-input').value = '';
  showToast(`API Key cleared for ${s.name}`, false);
  updateModalApiKeySection(s);
  updateKeyVaultNavBadge();
  renderCenter();
}

function toggleKeyVisibility() {
  const input = document.getElementById('modal-apikey-input');
  const eye = document.getElementById('modal-key-eye');
  if (!input || !eye) return;
  if (input.type === 'password') {
    input.type = 'text';
    eye.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M.143 2.31 1.8 3.766A8.528 8.528 0 0 0 .43 7.101a1.62 1.62 0 0 0 0 1.798c.45.678 1.367 1.932 2.637 3.023C4.33 13.008 6.019 14 8 14c1.47 0 2.753-.544 3.829-1.328l2.861 2.518a.75.75 0 1 0 .984-1.134L1.127 1.176A.75.75 0 0 0 .143 2.31Zm4.053 3.551 1.78 1.563a2.502 2.502 0 0 0 3.208 2.816l1.246 1.096A6.99 6.99 0 0 1 8 12.5c-1.557 0-2.98-1.08-4.127-2.062C2.756 9.476 1.991 8.448 1.679 8c.28-.403.92-1.302 1.884-2.139h.633ZM15.57 8.899c-.45.678-1.367 1.932-2.637 3.023a8.878 8.878 0 0 1-1.854 1.258l-1.09-1.09a7.37 7.37 0 0 0 1.444-.929C12.557 10.18 13.98 9.1 14.321 8c-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-.78 0-1.527.27-2.192.748L4.622 3.062A8.47 8.47 0 0 1 8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798Z"/></svg>';
  } else {
    input.type = 'password';
    eye.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 8c.312.448 1.077 1.476 2.194 2.438C5.02 11.42 6.443 12.5 8 12.5c1.557 0 2.98-1.08 4.127-2.062 1.117-.962 1.882-1.99 2.194-2.438-.312-.448-1.077-1.476-2.194-2.438C10.98 4.58 9.557 3.5 8 3.5c-1.557 0-2.98 1.08-4.127 2.062C2.756 6.524 1.991 7.552 1.679 8ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/></svg>';
  }
}

function updateModalApiKeySection(s) {
  const row = document.getElementById('modal-apikey-row');
  if (!row) return;
  row.style.display = 'block';
  const helpEl = document.getElementById('modal-apikey-help');
  const statusEl = document.getElementById('modal-apikey-status');
  const input = document.getElementById('modal-apikey-input');
  
  const info = getSkillCredentialInfo(s);
  helpEl.innerHTML = `<strong>${info.isPasswordPrimary ? 'Password / Secret' : 'API Key / Token'}:</strong> <code>${info.isPasswordPrimary ? info.passVar : info.keyVar}</code> &bull; Saved locally in browser localStorage.`;
  if (info.isConfigured) {
    statusEl.textContent = 'Configured';
    statusEl.className = 'key-status-badge configured';
  } else if (info.isRequired) {
    statusEl.textContent = 'Required';
    statusEl.className = 'key-status-badge';
  } else {
    statusEl.textContent = 'Optional';
    statusEl.className = 'key-status-badge';
  }
  input.value = info.savedKey || info.savedPass || '';
}

// --- JEV & Skills Educational Guide Modal ---
function openJevGuide() {
  const overlay = document.getElementById('guide-modal-overlay');
  if (overlay) overlay.classList.add('open');
}

function closeJevGuide(e) {
  if (e.target.id === 'guide-modal-overlay') closeJevGuideDirect();
}

function closeJevGuideDirect() {
  const overlay = document.getElementById('guide-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function switchGuideTab(tabId) {
  document.querySelectorAll('.guide-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.guide-content-panel').forEach(panel => panel.classList.remove('active'));
  const btn = document.getElementById('gtab-' + tabId);
  const panel = document.getElementById('guide-panel-' + tabId);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');
}
