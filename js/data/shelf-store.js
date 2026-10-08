/* Skill Switcher — Technology Discovery Library Data Store */
/* Personal Tech Inspiration & Discovery Engine inspired by Readwise, Raindrop & Linkwarden */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ShelfStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'skill_switcher_discoveries_v3';

  // Curated initial seed discoveries with deep "Why I saved this" & "Potential use" context
  const DEFAULT_SEED_DISCOVERIES = [
    {
      id: 'disc_seed_1',
      url: 'https://recent.design/',
      title: 'Recent Design',
      type: 'design',
      intent: 'inspiration',
      status: 'active',
      whySaved: 'Pinterest-style masonry layout where cards let the content & visual screenshots supply the color. Zero UI noise.',
      potentialUse: 'EKA Connect & Skills Switcher design gallery redesign and visual reference feed.',
      project: 'FrontEnd',
      collection: 'Design & Visual Identity',
      tags: ['gallery', 'masonry', 'inspiration', 'branding'],
      starred: true,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 72,
      updatedAt: Date.now() - 1000 * 60 * 60 * 72,
      lastViewedAt: Date.now() - 1000 * 60 * 60 * 12,
      favicon: 'https://www.google.com/s2/favicons?domain=recent.design&sz=64'
    },
    {
      id: 'disc_seed_2',
      url: 'https://github.com/motiondivision/motion',
      title: 'Motion Division (Framer Motion)',
      type: 'repo',
      intent: 'might_use',
      status: 'active',
      whySaved: 'Industry-standard declarative physics and layout transition engine for React and web apps.',
      potentialUse: 'Micro-animations, drag-to-dismiss sheets, and fluid accordion transitions in EKA Connect.',
      project: 'EKA Connect',
      collection: 'React & Animation Engines',
      tags: ['animation', 'react', 'gestures', 'physics'],
      starred: true,
      githubMeta: {
        stars: '26.8k',
        language: 'TypeScript',
        topics: ['animation', 'gestures', 'react', 'physics'],
        description: 'A production-ready motion library for React and the web.'
      },
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      updatedAt: Date.now() - 1000 * 60 * 60 * 48,
      lastViewedAt: Date.now() - 1000 * 60 * 60 * 20,
      favicon: 'https://github.com/favicon.ico'
    },
    {
      id: 'disc_seed_3',
      url: 'https://constraint.systems/',
      title: 'Constraint Systems',
      type: 'tool',
      intent: 'experiment',
      status: 'active',
      whySaved: 'Extreme monospace constraint experiments by Grant Custer. High-contrast typography and pure utility.',
      potentialUse: 'Inspector modals and code preview cards in developer tooling and IDE extensions.',
      project: 'Skills-Switcher',
      collection: 'Typography & Monospace Lab',
      tags: ['typography', 'creative-tools', 'minimalist', 'monospace'],
      starred: false,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 36,
      updatedAt: Date.now() - 1000 * 60 * 60 * 36,
      lastViewedAt: Date.now() - 1000 * 60 * 60 * 30,
      favicon: 'https://www.google.com/s2/favicons?domain=constraint.systems&sz=64'
    },
    {
      id: 'disc_seed_4',
      url: 'https://growth.design/',
      title: 'Growth Design Case Studies',
      type: 'article',
      intent: 'learn',
      status: 'active',
      whySaved: 'Teardowns of user onboarding and cognitive friction in comic-strip format.',
      potentialUse: 'Audit onboarding funnel and notification fatigue for vehicle fleet manager dashboard.',
      project: 'EKA Connect',
      collection: 'CRO & Growth Psychology',
      tags: ['ux-psychology', 'onboarding', 'retention', 'cognitive-load'],
      starred: true,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24,
      lastViewedAt: Date.now() - 1000 * 60 * 60 * 18,
      favicon: 'https://www.google.com/s2/favicons?domain=growth.design&sz=64'
    },
    {
      id: 'disc_seed_5',
      url: 'https://rebrand.gallery/',
      title: 'Rebrand Gallery',
      type: 'design',
      intent: 'inspiration',
      status: 'active',
      whySaved: 'Clean multi-tag filtering with brand logos and case-study links.',
      potentialUse: 'Design token showcase and brand asset management UI.',
      project: 'FrontEnd',
      collection: 'Design & Visual Identity',
      tags: ['branding', 'visual-identity', 'case-studies'],
      starred: false,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 16,
      updatedAt: Date.now() - 1000 * 60 * 60 * 16,
      lastViewedAt: null,
      favicon: 'https://www.google.com/s2/favicons?domain=rebrand.gallery&sz=64'
    },
    {
      id: 'disc_seed_6',
      url: 'https://notyourtype.nl/',
      title: 'Not Your Type',
      type: 'design',
      intent: 'concept',
      status: 'inbox',
      whySaved: 'High-contrast stark typography laboratory. Bold Dutch design aesthetic.',
      potentialUse: 'Poster design generator or hero typography for technical marketing pages.',
      project: 'PosterIQ',
      collection: 'Typography & Monospace Lab',
      tags: ['typography', 'editorial', 'high-contrast'],
      starred: false,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      updatedAt: Date.now() - 1000 * 60 * 60 * 8,
      lastViewedAt: null,
      favicon: 'https://www.google.com/s2/favicons?domain=notyourtype.nl&sz=64'
    },
    {
      id: 'disc_seed_7',
      url: 'https://abtest.design/',
      title: 'A/B Test Design',
      type: 'article',
      intent: 'learn',
      status: 'inbox',
      whySaved: 'Real-world CRO experiments showing exact control vs variation metrics.',
      potentialUse: 'Conversion rate optimization for checkout and landing page signups.',
      project: 'EKA Connect',
      collection: 'CRO & Growth Psychology',
      tags: ['cro', 'experimentation', 'metrics', 'conversion'],
      starred: false,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
      updatedAt: Date.now() - 1000 * 60 * 60 * 4,
      lastViewedAt: null,
      favicon: 'https://www.google.com/s2/favicons?domain=abtest.design&sz=64'
    },
    {
      id: 'disc_seed_8',
      url: 'https://www.uxsnaps.com/',
      title: 'UX Snaps',
      type: 'design',
      intent: 'inspiration',
      status: 'active',
      whySaved: 'Curated library of mobile UX flows and micro-interactions from top consumer apps.',
      potentialUse: 'Benchmark mobile vehicle booking and telematics flows.',
      project: 'Mobile App',
      collection: 'Design & Visual Identity',
      tags: ['mobile-ui', 'ux-teardowns', 'flows'],
      starred: false,
      githubMeta: null,
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      updatedAt: Date.now() - 1000 * 60 * 60 * 2,
      lastViewedAt: null,
      favicon: 'https://www.google.com/s2/favicons?domain=uxsnaps.com&sz=64'
    }
  ];

  // Helper to extract domain from URL
  function extractDomain(url) {
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch (e) {
      return url.split('/')[0] || url;
    }
  }

  // Favicon resolver
  function resolveFavicon(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('github.com')) {
        return 'https://github.com/favicon.ico';
      }
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=64`;
    } catch (e) {
      return '';
    }
  }

  // Parse GitHub owner & repo from URL
  function parseGitHubRepo(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('github.com')) {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          return { owner: parts[0], repo: parts[1] };
        }
      }
    } catch (e) {}
    return null;
  }

  // Detect item type based on URL
  function detectTypeFromUrl(url) {
    if (!url) return 'other';
    const lower = url.toLowerCase();
    if (lower.includes('github.com') || lower.includes('gitlab.com')) return 'repo';
    if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) return 'video';
    if (lower.includes('huggingface.co') || lower.includes('replicate.com') || lower.includes('fal.ai') || lower.includes('openai.com') || lower.includes('anthropic.com')) return 'ai';
    if (lower.includes('dribbble.com') || lower.includes('behance.net') || lower.includes('awwwards.com') || lower.includes('design') || lower.includes('font') || lower.includes('type')) return 'design';
    if (lower.includes('medium.com') || lower.includes('substack.com') || lower.includes('blog.') || lower.includes('/blog/')) return 'article';
    return 'tool';
  }

  // Fetch GitHub metadata asynchronously (unauthenticated public API)
  async function fetchGitHubMeta(url) {
    const parsed = parseGitHubRepo(url);
    if (!parsed) return null;

    try {
      const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      if (!res.ok) return null;
      const data = await res.json();
      return {
        owner: parsed.owner,
        repo: parsed.repo,
        stars: data.stargazers_count ? (data.stargazers_count > 999 ? (data.stargazers_count / 1000).toFixed(1) + 'k' : data.stargazers_count.toString()) : '0',
        forks: data.forks_count ? data.forks_count.toString() : '0',
        language: data.language || 'Unknown',
        topics: Array.isArray(data.topics) ? data.topics.slice(0, 5) : [],
        description: data.description || '',
        license: data.license && data.license.spdx_id ? data.license.spdx_id : null
      };
    } catch (e) {
      console.warn('[DiscoveryStore] GitHub API fetch skipped:', e);
      return null;
    }
  }

  // LocalStorage read/write
  function loadDiscoveries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DISCOVERIES));
        return [...DEFAULT_SEED_DISCOVERIES];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Backfill collection from seed mapping if missing
        const seedMap = {};
        DEFAULT_SEED_DISCOVERIES.forEach(s => {
          if (s.collection) seedMap[s.id] = s.collection;
        });
        parsed.forEach(item => {
          if (!item.collection && seedMap[item.id]) {
            item.collection = seedMap[item.id];
          }
        });
        return parsed;
      }
    } catch (e) {
      console.warn('[DiscoveryStore] Failed to parse localStorage items:', e);
    }
    return [...DEFAULT_SEED_DISCOVERIES];
  }

  function saveDiscoveries(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (e) {
      console.error('[DiscoveryStore] Failed to save to localStorage:', e);
      return false;
    }
  }

  // DiscoveryStore Public API
  const DiscoveryStore = {
    getAll: function () {
      return loadDiscoveries();
    },

    getById: function (id) {
      const items = loadDiscoveries();
      return items.find(i => i.id === id) || null;
    },

    // Zero-friction instant capture (Save to Inbox in 5 seconds)
    addQuick: function (url, whySaved = '', project = '', collection = '') {
      if (!url) throw new Error('URL is required');
      const cleanUrl = url.trim();
      const domain = extractDomain(cleanUrl);
      const gh = parseGitHubRepo(cleanUrl);

      return this.add({
        url: cleanUrl,
        title: gh ? `${gh.owner}/${gh.repo}` : domain,
        type: detectTypeFromUrl(cleanUrl),
        intent: 'might_use',
        status: 'inbox',
        whySaved: whySaved.trim(),
        potentialUse: '',
        project: project.trim(),
        collection: collection.trim(),
        tags: [],
        starred: false
      });
    },

    add: function (data) {
      if (!data || !data.url) throw new Error('URL is required');

      const items = loadDiscoveries();
      const now = Date.now();
      const cleanUrl = data.url.trim();
      const domain = extractDomain(cleanUrl);
      const gh = parseGitHubRepo(cleanUrl);

      const newDiscovery = {
        id: 'disc_' + now + '_' + Math.random().toString(36).substr(2, 6),
        url: cleanUrl,
        title: (data.title && data.title.trim()) || (gh ? `${gh.owner}/${gh.repo}` : domain),
        type: data.type || detectTypeFromUrl(cleanUrl),
        intent: data.intent || 'might_use',
        status: data.status || 'inbox',
        whySaved: (data.whySaved || data.note || '').trim(),
        potentialUse: (data.potentialUse || '').trim(),
        project: (data.project || '').trim(),
        collection: (data.collection || '').trim(),
        tags: Array.isArray(data.tags)
          ? data.tags.map(t => t.trim().toLowerCase()).filter(Boolean)
          : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []),
        starred: Boolean(data.starred),
        githubMeta: data.githubMeta || null,
        createdAt: now,
        updatedAt: now,
        lastViewedAt: now,
        favicon: data.favicon || resolveFavicon(cleanUrl)
      };

      // If GitHub URL and no metadata provided, asynchronously fetch it
      if (gh && !newDiscovery.githubMeta) {
        fetchGitHubMeta(cleanUrl).then(meta => {
          if (meta) {
            this.update(newDiscovery.id, {
              githubMeta: meta,
              title: newDiscovery.title === domain ? `${meta.owner}/${meta.repo}` : newDiscovery.title,
              tags: meta.topics.length && !newDiscovery.tags.length ? meta.topics : newDiscovery.tags
            });
          }
        }).catch(() => {});
      }

      items.unshift(newDiscovery);
      saveDiscoveries(items);
      return newDiscovery;
    },

    update: function (id, updates) {
      const items = loadDiscoveries();
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return null;

      const current = items[idx];
      const updated = {
        ...current,
        ...updates,
        collection: updates.collection !== undefined ? updates.collection.trim() : (current.collection || ''),
        tags: updates.tags !== undefined
          ? (Array.isArray(updates.tags)
              ? updates.tags.map(t => t.trim().toLowerCase()).filter(Boolean)
              : (typeof updates.tags === 'string' ? updates.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : current.tags))
          : current.tags,
        updatedAt: Date.now()
      };

      if (updates.url && updates.url !== current.url) {
        if (!updates.favicon) updated.favicon = resolveFavicon(updates.url);
      }

      items[idx] = updated;
      saveDiscoveries(items);
      return updated;
    },

    delete: function (id) {
      const items = loadDiscoveries();
      const filtered = items.filter(i => i.id !== id);
      if (filtered.length === items.length) return false;
      saveDiscoveries(filtered);
      return true;
    },

    toggleStar: function (id) {
      const items = loadDiscoveries();
      const item = items.find(i => i.id === id);
      if (!item) return null;
      item.starred = !item.starred;
      item.updatedAt = Date.now();
      saveDiscoveries(items);
      return item.starred;
    },

    updateStatus: function (id, newStatus) {
      return this.update(id, { status: newStatus });
    },

    touchViewed: function (id) {
      return this.update(id, { lastViewedAt: Date.now() });
    },

    // Rediscovery Engine: picks a high-value item not viewed recently
    getRediscoverItem: function () {
      const items = loadDiscoveries();
      if (!items.length) return null;

      // Prioritize items with whySaved or potentialUse, or marked starred/might_use
      const candidates = items.filter(i => i.status !== 'archived');
      if (!candidates.length) return items[0];

      // Pick randomly among the candidates
      const randomIndex = Math.floor(Math.random() * candidates.length);
      return candidates[randomIndex];
    },

    getCollections: function () {
      const items = loadDiscoveries();
      const map = {};
      items.forEach(i => {
        const col = i.collection || 'Uncategorized';
        if (!map[col]) {
          map[col] = { name: col, count: 0, sampleItems: [] };
        }
        map[col].count++;
        if (map[col].sampleItems.length < 3) {
          map[col].sampleItems.push(i);
        }
      });
      return Object.values(map).sort((a, b) => b.count - a.count);
    },

    getStats: function () {
      const items = loadDiscoveries();
      const stats = {
        total: items.length,
        inbox: items.filter(i => i.status === 'inbox').length,
        active: items.filter(i => i.status === 'active').length,
        inUse: items.filter(i => i.status === 'in_use').length,
        archived: items.filter(i => i.status === 'archived').length,
        starred: items.filter(i => i.starred).length,

        // By type
        design: items.filter(i => i.type === 'design').length,
        repo: items.filter(i => i.type === 'repo').length,
        tool: items.filter(i => i.type === 'tool').length,
        ai: items.filter(i => i.type === 'ai').length,
        article: items.filter(i => i.type === 'article').length,
        video: items.filter(i => i.type === 'video').length,
        other: items.filter(i => i.type === 'other').length,

        // By Intent
        inspiration: items.filter(i => i.intent === 'inspiration').length,
        mightUse: items.filter(i => i.intent === 'might_use').length,
        experiment: items.filter(i => i.intent === 'experiment').length,
        learn: items.filter(i => i.intent === 'learn').length,
        concept: items.filter(i => i.intent === 'concept').length
      };

      // Unique projects
      const projectMap = {};
      items.forEach(i => {
        if (i.project) {
          projectMap[i.project] = (projectMap[i.project] || 0) + 1;
        }
      });
      stats.projects = projectMap;

      // Unique collections
      const collectionMap = {};
      items.forEach(i => {
        if (i.collection) {
          collectionMap[i.collection] = (collectionMap[i.collection] || 0) + 1;
        }
      });
      stats.collections = collectionMap;

      // Unique tags with frequencies
      const tagCountMap = {};
      items.forEach(i => {
        if (Array.isArray(i.tags)) {
          i.tags.forEach(t => {
            const clean = t.trim().toLowerCase();
            if (clean) tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
          });
        }
      });
      stats.tags = Object.keys(tagCountMap).sort();
      stats.tagsWithCounts = Object.entries(tagCountMap)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      return stats;
    },

    formatMarkdownSnippet: function (id) {
      const item = this.getById(id);
      if (!item) return '';
      const parts = [`[${item.title}](${item.url})`];
      if (item.project) parts.push(`*(Project: ${item.project})*`);
      if (item.whySaved) parts.push(`— *Why: ${item.whySaved}*`);
      if (item.potentialUse) parts.push(`*(Potential use: ${item.potentialUse})*`);
      if (item.tags && item.tags.length) parts.push(item.tags.map(t => '#' + t).join(' '));
      return parts.join(' ');
    },

    formatAllFilteredMarkdown: function (items) {
      if (!Array.isArray(items) || !items.length) return '';
      return items.map(item => {
        const parts = [`- [${item.title}](${item.url})`];
        if (item.project) parts.push(`*(Project: ${item.project})*`);
        if (item.whySaved) parts.push(`— *Why: ${item.whySaved}*`);
        if (item.potentialUse) parts.push(`*(Use: ${item.potentialUse})*`);
        return parts.join(' ');
      }).join('\n');
    },

    exportJSON: function () {
      const items = loadDiscoveries();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `discovery-library-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return true;
    },

    importJSON: function (jsonString, mode = 'merge') {
      try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) throw new Error('Invalid format: root must be an array');

        const current = mode === 'replace' ? [] : loadDiscoveries();
        const existingUrls = new Set(current.map(i => i.url.toLowerCase()));

        let addedCount = 0;
        parsed.forEach(item => {
          if (!item.url) return;
          if (mode === 'merge' && existingUrls.has(item.url.toLowerCase())) return;

          const formatted = {
            id: item.id || ('disc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
            url: item.url.trim(),
            title: item.title || extractDomain(item.url),
            type: item.type || detectTypeFromUrl(item.url),
            intent: item.intent || 'might_use',
            status: item.status || 'inbox',
            whySaved: item.whySaved || item.note || '',
            potentialUse: item.potentialUse || '',
            project: item.project || '',
            collection: item.collection || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            starred: Boolean(item.starred),
            githubMeta: item.githubMeta || null,
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now(),
            lastViewedAt: item.lastViewedAt || null,
            favicon: item.favicon || resolveFavicon(item.url)
          };
          current.unshift(formatted);
          existingUrls.add(formatted.url.toLowerCase());
          addedCount++;
        });

        saveDiscoveries(current);
        return { success: true, count: addedCount, total: current.length };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    exportMarkdown: function () {
      const items = loadDiscoveries();
      const lines = [
        '# ✨ Discovery Library — Technology & Idea Graph',
        `*Exported from Skills-Switcher on ${new Date().toLocaleDateString()} — Total: ${items.length} discoveries*`,
        '',
        '---',
        ''
      ];

      // Group by Project first if any, then General
      const projectGroups = {};
      items.forEach(i => {
        const p = i.project || 'General / Unassigned';
        if (!projectGroups[p]) projectGroups[p] = [];
        projectGroups[p].push(i);
      });

      Object.keys(projectGroups).forEach(projName => {
        const projItems = projectGroups[projName];
        lines.push(`## 📁 Project: ${projName} (${projItems.length})`);
        lines.push('');

        projItems.forEach(item => {
          const star = item.starred ? ' ⭐' : '';
          const intentEmoji = {
            inspiration: '💡 Inspiration',
            might_use: '🔧 Might Use',
            experiment: '🧪 Experiment',
            learn: '📚 Learn',
            concept: '🧩 Concept'
          }[item.intent] || '📌 Reference';

          lines.push(`### [${item.title}](${item.url})${star}`);
          lines.push(`- **URL**: \`${item.url}\``);
          lines.push(`- **Type**: \`${item.type}\` · **Intention**: \`${intentEmoji}\` · **Status**: \`${item.status}\``);
          if (item.tags && item.tags.length) lines.push(`- **Tags**: ${item.tags.map(t => '`#' + t + '`').join(' ')}`);
          if (item.whySaved) lines.push(`- **Why I saved this**: ${item.whySaved}`);
          if (item.potentialUse) lines.push(`- **Potential use**: ${item.potentialUse}`);
          if (item.githubMeta) lines.push(`- **GitHub**: ⭐ ${item.githubMeta.stars} · Lang: ${item.githubMeta.language}`);
          lines.push('');
        });
      });

      const mdContent = lines.join('\n');
      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DISCOVERY-LIBRARY-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    },

    extractDomain: extractDomain,
    resolveFavicon: resolveFavicon,
    detectTypeFromUrl: detectTypeFromUrl,
    fetchGitHubMeta: fetchGitHubMeta
  };

  return DiscoveryStore;
});
