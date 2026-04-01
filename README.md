# 🤖 Skool AI AutoPoster — Full Autopilot Setup Guide

Posts AI news to your Skool group 24/7 using Claude + Zapier. Zero manual work once deployed.

---

## What You Need

| Tool | Cost | Purpose |
|------|------|---------|
| GitHub account | Free | Host the code |
| Render.com account | $7/mo | Run the server 24/7 |
| Anthropic API key | ~$10/mo | Claude writes the posts |
| Zapier account | You have this ✅ | Publish posts to Skool |

**Total: ~$17–20/month for unlimited 24/7 posting**

---

## STEP 1 — Push Code to GitHub (10 min)

1. Go to **github.com** → click **New repository**
2. Name it `skool-autoposter` → set to **Private** → click Create
3. On your computer, open Terminal and run:

```bash
# Download the project files (or drag them into a folder)
cd skool-autoposter

# Initialize git and push
git init
git add .
git commit -m "Initial autoposter setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skool-autoposter.git
git push -u origin main
```

✅ Your code is now on GitHub (privately).

---

## STEP 2 — Set Up Zapier Webhook (15 min)

This is what receives the generated post and publishes it to Skool.

### 2a. Create the Zap

1. Go to **zapier.com** → click **Create Zap**
2. **Trigger:** Search for **"Webhooks by Zapier"** → Select **"Catch Hook"**
3. Click **Continue** → Copy the webhook URL (looks like `https://hooks.zapier.com/hooks/catch/123456/abcdef/`)
4. Save this URL — you'll need it in Step 3

### 2b. Set Up the Skool Action

**Option A — If Skool is in your Zapier (check first):**
1. Click **"+"** to add action → search **"Skool"**
2. If it appears → select **"Create Post"**
3. Connect your Skool account → select your group
4. Map the **Body/Content** field to: `post_content` (from the webhook data)
5. Turn on the Zap

**Option B — If Skool isn't in your Zapier:**
1. Check Skool Settings → look for an **email-to-post** address (some plans have this)
2. If yes: Zapier action = **"Send Outbound Email"** → to your Skool post email, body = `post_content`
3. If no: Use Zapier → **"Email by Zapier"** to send yourself the post for quick manual paste (takes 10 sec)

> 💡 **Pro tip:** Even semi-auto with email notification gives you 30-second posting. Many community owners prefer this for quality control.

---

## STEP 3 — Deploy to Render.com (15 min)

1. Go to **render.com** → Sign up (free) → click **New → Web Service**
2. Connect your GitHub account → select `skool-autoposter`
3. Configure:
   - **Name:** `skool-autoposter`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Starter ($7/mo) — needed for always-on (free tier sleeps)

### Add Environment Variables

In Render → your service → **Environment** tab, add these:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-your-key-here` |
| `ZAPIER_WEBHOOK_URL` | Your Zapier webhook URL from Step 2 |
| `COMMUNITY_NAME` | Your Skool group name |
| `COMMUNITY_VIBE` | Description of your audience |
| `POST_INTERVAL_HOURS` | `4` (posts 6x/day) or `6` (4x/day) |
| `MIN_QUALITY_SCORE` | `7` |
| `TRIGGER_TOKEN` | Any random string (e.g. `mytoken123`) |

4. Click **Deploy** → wait 2-3 minutes

✅ Your server is live!

---

## STEP 4 — Verify It's Working

### Check the health dashboard:
Visit `https://your-service-name.onrender.com/` in your browser.

You should see:
```json
{
  "status": "running",
  "postsPublished": 1,
  "lastPostTime": "2024-01-15T14:30:00Z",
  "lastPostPreview": "🔥 Just saw this from Anthropic...",
  "nextPostIn": "4 hours (recurring)"
}
```

### Manually trigger a test post:
```bash
curl -X POST https://your-service-name.onrender.com/trigger \
  -H "x-trigger-token: mytoken123"
```

Check your Zapier history to confirm it fired, and check your Skool group for the post.

---

## Customizing Your Posts

Edit the `COMMUNITY_VIBE` environment variable to change Claude's writing style:

**For a marketing/business community:**
```
savvy marketers and entrepreneurs using AI to scale their business, practical ROI-focused tone
```

**For a beginner community:**
```
complete beginners just starting with AI, friendly and non-technical, lots of encouragement
```

**For a developer community:**
```
intermediate to advanced developers building AI products, technical depth appreciated, no fluff
```

---

## Post Schedule

With `POST_INTERVAL_HOURS=4`, posts go out at (from server start):
- Every 4 hours, 24/7, 365 days a year

The system rotates through 7 post formats automatically:
1. 🚨 Breaking news flash
2. 💡 "What this means for you"
3. 🛠️ Tool spotlight
4. 🔥 Hot take / opinion
5. 🎓 Beginner explainer
6. ✍️ Prompt tip
7. 📰 Weekly roundup

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No posts appearing | Check Render logs → Environment tab (all vars set?) |
| Zapier not firing | Test webhook URL manually with curl |
| Low quality posts | Raise `MIN_QUALITY_SCORE` to 8, improve `COMMUNITY_VIBE` |
| Server sleeping | Make sure you're on Starter plan ($7/mo), not free tier |
| API key error | Verify key at console.anthropic.com, check billing |

### View live logs:
Render Dashboard → your service → **Logs** tab

---

## Monthly Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render.com | Starter | $7/mo |
| Anthropic API | Pay-as-you-go | ~$8–12/mo at 6 posts/day |
| Zapier | Your existing plan | $0 extra |
| **Total** | | **~$15–20/mo** |

For 6 posts/day × 30 days = 180 posts/month. That's **under $0.10 per post**.

---

## Need Help?

The server logs everything. Check Render → Logs for:
- `✅ Post #N published` = working perfectly
- `⚠️ Could not fetch [source]` = one RSS feed is down (normal, others still work)
- `❌ Pipeline error` = check your API key and webhook URL
