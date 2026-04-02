// ============================================================
// Skool AI AutoPoster — Multi-Group Server v3
// One-tap email posting flow:
//   Claude generates post → Zapier emails you a beautiful card
//   → tap button → page opens with post auto-copied
//   → tap Skool link → paste → done in 10 seconds
// ============================================================

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const Parser = require('rss-parser');
const fetch = require('node-fetch');
const express = require('express');
const { groups } = require('../config/groups.config');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const rssParser = new Parser({ timeout: 10000 });
const app = express();
app.use(express.json());

// Per-group runtime state
const state = {};
groups.forEach(group => {
  state[group.id] = {
    postsPublished: 0,
    lastPostTime: null,
    lastPostPreview: null,
    consecutiveErrors: 0,
    formatIndex: 0,
    postHistory: [],
  };
});

// In-memory pending posts (token → post data, expires 6h)
const pendingPosts = new Map();

// ── 1. FETCH NEWS ────────────────────────────────────────────
async function fetchNewsForGroup(group) {
  const allItems = [];
  for (const sourceUrl of group.newsSources) {
    try {
      const feed = await rssParser.parseURL(sourceUrl);
      feed.items.slice(0, 3).forEach(item => {
        allItems.push({
          title: item.title || '',
          summary: (item.contentSnippet || item.content || '').slice(0, 400),
          link: item.link,
          pubDate: item.pubDate || item.isoDate,
          source: feed.title || sourceUrl,
        });
      });
    } catch (err) {
      console.warn(`  [${group.id}] Skipped source: ${err.message.slice(0, 60)}`);
    }
  }

  if (allItems.length === 0) throw new Error('No news fetched for: ' + group.id);
  allItems.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  const history = state[group.id].postHistory;
  const fresh = allItems.filter(item => {
    const words = item.title.toLowerCase().split(' ').filter(w => w.length > 5);
    return !history.some(prev => words.some(w => prev.toLowerCase().includes(w)));
  });

  return (fresh.length > 0 ? fresh : allItems).slice(0, 5);
}

// ── 2. GENERATE POST ─────────────────────────────────────────
async function generatePost(group, newsItems) {
  const groupState = state[group.id];
  const format = group.postFormats[groupState.formatIndex % group.postFormats.length];
  groupState.formatIndex++;

  const newsContext = newsItems
    .map((item, i) => `[${i + 1}] ${item.source}: "${item.title}"\n${item.summary}`)
    .join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 550,
    system: group.persona,
    messages: [{
      role: 'user',
      content: `You are posting to the Skool group: "${group.name}"

Latest AI news:
${newsContext}

Community focus: ${group.topicFocus.join(', ')}

Post format: ${format.name}
Instructions: ${format.instruction}

RULES: 150-250 words max. No hashtags. First person. Sound human. Today is ${new Date().toLocaleDateString()}. Post #${Math.floor(Math.random() * 10000)}. Never repeat a post you've written before. Always find a fresh angle. AVOID these overused stories from this week: Cognichip, AI designing chips, chip costs dropping. Find something NEW and different. If all news sources have the same story, pick a completely different angle or a different story entirely.
Spin news to fit this community if needed.
Output ONLY the post text. Nothing else.`,
    }],
  });

  return { text: response.content[0].text.trim(), format: format.name };
}

// ── 3. QUALITY SCORE ─────────────────────────────────────────
async function scorePost(postText, groupName) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: `Rate this Skool post for "${groupName}". Score 1-10 on: hook, relevance, value, engagement question, natural tone. Reply with ONLY a single integer.\n\nPost: """${postText}"""`,
    }],
  });
  const score = parseInt(response.content[0].text.trim(), 10);
  return isNaN(score) ? 7 : score;
}

// ── 4. BUILD ONE-TAP EMAIL ───────────────────────────────────
function buildEmailPayload(group, postText, postToken, score, format) {
  const serverUrl = process.env.SERVER_URL || 'https://your-app.onrender.com';
  const oneTapUrl = `${serverUrl}/post-ready/${postToken}`;
  const skipUrl = `${serverUrl}/skip/${postToken}`;

  const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:24px 16px;">
  <div style="background:linear-gradient(135deg,#7c6aff,#ff6a6a);border-radius:16px;padding:24px;margin-bottom:16px;text-align:center;">
    <div style="font-size:36px;margin-bottom:6px;">🤖</div>
    <h1 style="color:white;margin:0;font-size:20px;font-weight:800;">Post Ready to Go</h1>
    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">${group.name} &nbsp;•&nbsp; ${format} &nbsp;•&nbsp; Score: ${score}/10</p>
  </div>
  <div style="background:#1a1a26;border:1px solid #2a2a3a;border-radius:12px;padding:20px;margin-bottom:16px;">
    <p style="color:#6b6b8a;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Post Preview</p>
    <p style="color:#f0efff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${postText}</p>
  </div>
  <a href="${oneTapUrl}" style="display:block;background:linear-gradient(135deg,#7c6aff,#9080ff);color:white;text-decoration:none;text-align:center;padding:18px;border-radius:14px;font-size:16px;font-weight:700;margin-bottom:10px;">⚡ Tap to Post — 10 Seconds</a>
  <a href="${skipUrl}" style="display:block;background:#1a1a26;border:1px solid #2a2a3a;color:#6b6b8a;text-decoration:none;text-align:center;padding:12px;border-radius:10px;font-size:13px;margin-bottom:20px;">Skip this post</a>
  <p style="color:#3a3a5a;font-size:11px;text-align:center;margin:0;">Skool AI AutoPoster • Expires in 6 hours</p>
</div></body></html>`;

  return {
    subject: `⚡ Post Ready — ${group.name}`,
    body_html: emailHtml,
    body_text: `New post ready for ${group.name}:\n\n${postText}`,
    post_content: postText,
    group_name: group.name,
    post_format: format,
    quality_score: score,
    one_tap_url: oneTapUrl,
    timestamp: new Date().toISOString(),
  };
}

// ── 5. FIRE ZAPIER WEBHOOK ───────────────────────────────────
async function sendToZapier(group, payload) {
  if (!group.zapierWebhook) {
    console.log(`  [${group.id}] No webhook — post:\n${payload.post_content.slice(0, 100)}...\n`);
    return;
  }
  const res = await fetch(group.zapierWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`Zapier ${res.status} for ${group.id}`);
}

// ── 6. POSTING WINDOW ────────────────────────────────────────
function isInPostingWindow(group) {
  const localHour = (new Date().getUTCHours() - 5 + 24) % 24; // CT
  return localHour >= group.postingWindowStart && localHour < group.postingWindowEnd;
}

// ── 7. MAIN PIPELINE ─────────────────────────────────────────
async function runPipelineForGroup(group) {
  const groupState = state[group.id];
  const log = msg => console.log(`  [${group.id}] ${msg}`);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🤖 [${group.id}] ${new Date().toISOString()}`);

  if (!isInPostingWindow(group)) { log('⏰ Outside hours — skipping'); return; }

  try {
    log('📡 Fetching news...');
    const newsItems = await fetchNewsForGroup(group);
    log(`   ${newsItems.length} articles`);

    log('✍️  Generating...');
    let { text, format } = await generatePost(group, newsItems);

    log('🎯 Scoring...');
    let score = await scorePost(text, group.name);
    log(`   ${score}/10`);

    if (score < group.minQualityScore) {
      log(`   Retry (below ${group.minQualityScore})...`);
      const retry = await generatePost(group, newsItems);
      const retryScore = await scorePost(retry.text, group.name);
      if (retryScore > score) { text = retry.text; format = retry.format; score = retryScore; }
      log(`   Retry: ${retryScore}/10`);
    }

    // Store pending post with unique token
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    pendingPosts.set(token, {
      groupId: group.id,
      groupName: group.name,
      skoolGroupSlug: group.skoolGroupSlug,
      postText: text,
      format,
      score,
      createdAt: Date.now(),
    });
    setTimeout(() => pendingPosts.delete(token), 6 * 60 * 60 * 1000);

    log('📧 Emailing via Zapier...');
    const payload = buildEmailPayload(group, text, token, score, format);
    await sendToZapier(group, payload);

    if (newsItems[0]?.title) {
      groupState.postHistory.push(newsItems[0].title);
      if (groupState.postHistory.length > 20) groupState.postHistory.shift();
    }

    groupState.postsPublished++;
    groupState.lastPostTime = new Date().toISOString();
    groupState.lastPostPreview = text.slice(0, 120) + '...';
    groupState.consecutiveErrors = 0;

    log(`✅ Email sent! Post #${groupState.postsPublished} | Score: ${score}/10`);

  } catch (err) {
    groupState.consecutiveErrors++;
    log(`❌ Error (${groupState.consecutiveErrors}): ${err.message}`);
    if (groupState.consecutiveErrors >= 5) log('🚨 Check API key and webhook URL');
  }
}

// ── 8. ONE-TAP POST PAGE ─────────────────────────────────────
app.get('/post-ready/:token', (req, res) => {
  const post = pendingPosts.get(req.params.token);

  if (!post) {
    return res.send(`<html><body style="background:#0f0f14;color:#f0efff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;"><div><div style="font-size:48px">⏰</div><h2>Post expired</h2><p style="color:#6b6b8a">Posts expire after 6 hours. A new one will arrive soon.</p></div></body></html>`);
  }

  const skoolUrl = `https://www.skool.com/${post.skoolGroupSlug}/feed`;

  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Post Ready</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f0f14;color:#f0efff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px 16px;min-height:100vh}
.card{background:#1a1a26;border:1px solid #2a2a3a;border-radius:16px;padding:20px;margin-bottom:14px}
textarea{width:100%;background:#0f0f14;border:1px solid #2a2a3a;border-radius:10px;color:#f0efff;font-size:14px;padding:16px;line-height:1.7;resize:none;outline:none;font-family:inherit}
.btn{display:block;width:100%;padding:18px;border-radius:14px;font-size:16px;font-weight:700;text-align:center;text-decoration:none;border:none;cursor:pointer;margin-bottom:10px}
.primary{background:linear-gradient(135deg,#7c6aff,#9080ff);color:white}
.copy-btn{background:#1a1a26;border:1px solid #2a2a3a;color:#f0efff;font-family:inherit}
.copied{background:rgba(74,222,128,.15)!important;border-color:rgba(74,222,128,.3)!important;color:#4ade80!important}
.step{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start}
.num{background:#7c6aff;color:white;width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px}
.step-text{font-size:14px;line-height:1.5;color:#c0bfdf}
.step-text strong{color:#f0efff}
</style></head>
<body>
<div style="max-width:540px;margin:0 auto">
  <div style="text-align:center;margin-bottom:20px">
    <div style="font-size:40px;margin-bottom:8px">⚡</div>
    <h1 style="font-size:22px;font-weight:800">${post.groupName}</h1>
    <p style="color:#6b6b8a;font-size:13px;margin-top:4px">${post.format} &nbsp;•&nbsp; Score: ${post.score}/10</p>
  </div>
  <div class="card">
    <p style="color:#6b6b8a;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Your Post</p>
    <textarea id="postText" rows="10">${post.postText}</textarea>
  </div>
  <button class="btn copy-btn" id="copyBtn" onclick="copyPost()">📋 Step 1 — Copy Post</button>
  <a href="${skoolUrl}" target="_blank" class="btn primary" onclick="markPosted('${req.params.token}')">🏘️ Step 2 — Open Skool & Paste</a>
  <div class="card">
    <div class="step"><div class="num">1</div><div class="step-text"><strong>Tap Copy</strong> — post is copied to your clipboard automatically</div></div>
    <div class="step"><div class="num">2</div><div class="step-text"><strong>Tap Open Skool</strong> — your group feed opens in a new tab</div></div>
    <div class="step"><div class="num">3</div><div class="step-text"><strong>Click the post box</strong> in Skool → Paste (Ctrl+V or right-click) → hit Post</div></div>
  </div>
</div>
<script>
  window.addEventListener('load', () => setTimeout(copyPost, 400));
  function copyPost() {
    navigator.clipboard.writeText(document.getElementById('postText').value).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.textContent = '✅ Copied to clipboard!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = '📋 Step 1 — Copy Post'; btn.classList.remove('copied'); }, 3000);
    });
  }
  function markPosted(token) {
    fetch('/mark-posted/' + token, { method: 'POST' }).catch(() => {});
  }
</script>
</body></html>`);
});

app.post('/mark-posted/:token', (req, res) => { pendingPosts.delete(req.params.token); res.json({ ok: true }); });

app.get('/skip/:token', (req, res) => {
  pendingPosts.delete(req.params.token);
  res.send(`<html><body style="background:#0f0f14;color:#f0efff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;"><div><div style="font-size:48px">👍</div><h2>Skipped</h2><p style="color:#6b6b8a">Next post arrives on schedule.</p></div></body></html>`);
});

// ── 9. HEALTH DASHBOARD ──────────────────────────────────────
app.get('/', (req, res) => res.json({
  service: 'Skool AI AutoPoster v3 — One-Tap Email',
  uptime: process.uptime().toFixed(0) + 's',
  pendingPosts: pendingPosts.size,
  groups: groups.map(g => ({ id: g.id, name: g.name, webhookOk: !!g.zapierWebhook, ...state[g.id] })),
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/trigger/:groupId', async (req, res) => {
  if (req.headers['x-trigger-token'] !== process.env.TRIGGER_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  const group = groups.find(g => g.id === req.params.groupId);
  if (!group) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Triggered: ' + group.name });
  runPipelineForGroup(group);
});

app.post('/trigger-all', async (req, res) => {
  if (req.headers['x-trigger-token'] !== process.env.TRIGGER_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ message: 'All triggered' });
  groups.forEach(g => runPipelineForGroup(g));
});

// ── 10. START + SCHEDULE ─────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 Skool AI AutoPoster v3 — One-Tap Email Mode');
  console.log('═'.repeat(60));
  groups.forEach(g => {
    console.log(`\n  📣 ${g.name}`);
    console.log(`     Every ${g.postIntervalHours}h | ${g.postingWindowStart}am–${g.postingWindowEnd - 12}pm CT`);
    console.log(`     Webhook: ${g.zapierWebhook ? '✅' : '⚠️  NOT SET'}`);
  });
  console.log(`\n  Dashboard: http://localhost:${PORT}/`);
  console.log('═'.repeat(60) + '\n');
});

groups.forEach(group => {
  runPipelineForGroup(group);
  setInterval(() => runPipelineForGroup(group), group.postIntervalHours * 60 * 60 * 1000);
  console.log(`⏱  [${group.id}] Scheduled every ${group.postIntervalHours}h`);
});

process.on('SIGTERM', () => { console.log('Shutting down...'); process.exit(0); });
