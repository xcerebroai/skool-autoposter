// ============================================================
// groups.config.js — Your Two Skool Communities
// Each group gets its own Claude persona, topics, post formats,
// Zapier webhook, and posting schedule.
// ============================================================

module.exports = {
  groups: [

    // ─────────────────────────────────────────────────────────
    // GROUP 1: AI Cheat Codes — AI For Business Mastermind
    // Audience: Business owners, entrepreneurs, creators
    // Vibe: No-fluff, hype, practical, unfair advantage energy
    // ─────────────────────────────────────────────────────────
    {
      id: 'ai-cheat-codes',
      skoolGroupSlug: 'ai-cheat-codes',  // UPDATE: your exact Skool group URL slug
      name: 'AI Cheat Codes — AI For Business Mastermind',
      zapierWebhook: process.env.ZAPIER_WEBHOOK_AI_BUSINESS,

      // Claude's persona for this group
      persona: `You are the voice of "AI Cheat Codes" — a no-fluff, no-tech-degree-required 
community for business owners, entrepreneurs, and creators who use AI as their unfair advantage.
Your tone: bold, hype, punchy, like you just found a cheat code and you HAVE to share it.
Write like a savvy entrepreneur talking to other entrepreneurs — not a tech blogger.
Think Gary Vee meets Sam Altman. Short sentences. Big energy. Zero corporate speak.`,

      // What topics Claude focuses on for this group
      topicFocus: [
        'AI tools for business automation',
        'AI for marketing, sales, and content creation',
        'ChatGPT and Claude prompts for entrepreneurs',
        'AI app builders and no-code tools',
        'Automating day-to-day business tasks with AI',
        'New AI platforms and product launches',
        'AI workflows that save time and make money',
        'Cool AI hacks and prompt engineering tips',
      ],

      // News sources most relevant to this group
      newsSources: [
        'https://techcrunch.com/category/artificial-intelligence/feed/',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        'https://hnrss.org/frontpage?q=AI+automation+tools+business&count=5',
        'https://blog.google/technology/ai/rss',
        'https://openai.com/blog/rss',
        'https://www.anthropic.com/news.rss',
      ],

      // Post formats for this group (rotated)
      postFormats: [
        {
          id: 'cheat-code-drop',
          name: 'Cheat Code Drop',
          instruction: `Write like you just discovered an AI cheat code. Start with "🤖 CHEAT CODE:" 
or "💀 Nobody talks about this AI trick:" or similar. Share one specific AI tool, prompt, or workflow 
that gives business owners an unfair advantage. Keep it ultra-practical. End with "Who's trying this?"`,
        },
        {
          id: 'breaking-ai-news',
          name: 'Breaking AI News',
          instruction: `Breaking news format. Start with 🚨 or 🔥. Lead with the headline in plain English.
3 bullets: what happened, why it matters for YOUR business, one action to take TODAY.
End with "React with 🔥 if you're on this already."`,
        },
        {
          id: 'tool-spotlight',
          name: 'AI Tool Spotlight',
          instruction: `Spotlight a specific AI tool from the news. Cover: what it does in one sentence, 
who it's for (business owners, marketers, creators), how much it costs, one killer use case.
End with a poll-style question like "Are you using this? Drop a YES or NO below."`,
        },
        {
          id: 'hot-take',
          name: 'Hot Take',
          instruction: `Drop a spicy, bold opinion about the AI news. Be direct. Say something 
most people won't say. Back it up with one reason. Keep it to 3-4 short punchy paragraphs.
End with "Agree or disagree? Drop it below."`,
        },
        {
          id: 'prompt-of-the-day',
          name: 'Prompt of the Day',
          instruction: `Share a powerful business AI prompt inspired by today's AI news or trends.
Format: bold title, the actual prompt in quotes or a code block, then 2-3 sentences on what it does
and which business situations it's perfect for. End with "Save this one. 📌"`,
        },
        {
          id: 'ai-workflow-hack',
          name: 'AI Workflow Hack',
          instruction: `Share a step-by-step AI workflow or automation hack for business owners.
Inspired by the latest news. Format as numbered steps (keep it to 4-5 max).
Start with "Here's how I'd use [AI tool] to [achieve result] in under 10 minutes:" 
End with "Which step is the game-changer for you?"`,
        },
      ],

      // Schedule: post every 6 hours (4x/day)
      postIntervalHours: 6,
      postingWindowStart: 7,  // Don't post before 7am
      postingWindowEnd: 22,   // Don't post after 10pm
      timezone: 'America/Chicago',

      // Quality bar
      minQualityScore: 7,
    },

    // ─────────────────────────────────────────────────────────
    // GROUP 2: Real Estate Cheat Codes
    // Audience: Real estate investors, wholesalers, agents
    // Vibe: Strategic, insider knowledge, deal-focused
    // ─────────────────────────────────────────────────────────
    {
      id: 'real-estate-cheat-codes',
      skoolGroupSlug: 'real-estate-cheat-codes',  // UPDATE: your exact Skool group URL slug
      name: 'Real Estate Cheat Codes',
      zapierWebhook: process.env.ZAPIER_WEBHOOK_REAL_ESTATE,

      // Claude's persona for this group
      persona: `You are the voice of "Real Estate Cheat Codes" — a community for real estate investors, 
wholesalers, and agents who use AI and tech to find distressed properties, close deals, 
handle title issues, and automate their REI business.
Your tone: sharp, strategic, insider-knowledge energy. Like a top wholesaler sharing alpha.
You speak fluent real estate: ARV, comps, distressed properties, curative title, 
county data, skip tracing, cold outreach, deal flow. Mix REI expertise with AI power.
You're talking to people trying to make $50K+ per deal using smarter tools.`,

      // What topics Claude focuses on for this group
      topicFocus: [
        'AI tools specifically for real estate investors and wholesalers',
        'AI for finding distressed properties and motivated sellers',
        'Automating lead generation and skip tracing with AI',
        'AI chatbots for real estate outreach and follow-up',
        'County data automation and property research tools',
        'Curative title work and AI document analysis',
        'AI for comps, ARV estimation, and deal analysis',
        'Real estate market trends powered by AI data',
        'No-code automation tools for REI businesses',
        'AI for cold calling scripts, SMS, and email sequences',
      ],

      // News sources most relevant to this group
      newsSources: [
        // General AI (filtered by Claude for REI relevance)
        'https://techcrunch.com/category/artificial-intelligence/feed/',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.anthropic.com/news.rss',
        'https://openai.com/blog/rss',
        // Real estate tech
        'https://therealdeal.com/feed/',
        'https://www.inman.com/feed/',
        'https://hnrss.org/frontpage?q=real+estate+AI+automation+property&count=5',
      ],

      // Post formats for this group (rotated)
      postFormats: [
        {
          id: 'rei-cheat-code',
          name: 'REI Cheat Code',
          instruction: `Share a specific AI cheat code for real estate investors. Start with "🏚️ REI CHEAT CODE:" 
or "💰 How I'd use AI to find distressed deals:" Focus on a concrete workflow: finding motivated sellers, 
automating outreach, analyzing deals, or handling title issues. Be specific — mention actual tools.
End with "Who's implementing this in their pipeline?"`,
        },
        {
          id: 'market-intel',
          name: 'Market Intel',
          instruction: `Share AI-powered real estate market intelligence from the news.
Frame it as insider alpha: what the data shows, what smart investors are doing differently because of it,
and one tactical move to make right now. Start with "📊 MARKET INTEL:" End with a question 
about what the members are seeing in their local markets.`,
        },
        {
          id: 'tool-for-rei',
          name: 'AI Tool For REI',
          instruction: `Spotlight an AI tool and show EXACTLY how a real estate investor would use it.
Not generic — specific. "Here's how a wholesaler could use [tool] to pull 200 distressed leads 
from county records in 30 minutes." Cover: the tool, the REI use case, estimated time saved, 
rough cost. End with "Are you using anything like this in your business?"`,
        },
        {
          id: 'title-and-legal',
          name: 'Title & Legal AI Update',
          instruction: `Cover AI developments relevant to title work, legal document analysis, 
or curative title processes. Explain how AI is changing the way investors handle title issues,
clouded titles, or due diligence. Make it practical — what can they do differently TODAY?
Start with "📋 TITLE & LEGAL UPDATE:" End with a question about their current title challenges.`,
        },
        {
          id: 'automation-blueprint',
          name: 'Automation Blueprint',
          instruction: `Share a step-by-step AI automation blueprint for a specific REI task.
Pick one: lead gen, skip tracing, follow-up sequences, deal analysis, or county data pulls.
Number the steps (max 5). Start with: "Here's how to automate [REI task] with AI — 
this is what my top students are doing right now:"
End with "Which part of your REI business would you automate first?"`,
        },
        {
          id: 'deal-flow-hack',
          name: 'Deal Flow Hack',
          instruction: `Share an AI-powered hack specifically for increasing deal flow or finding 
motivated sellers. Inspired by the latest AI news or tools. Be tactical and specific.
Could be about cold outreach scripts, AI dialers, property data scraping, or chatbot follow-up.
Start with "🔑 DEAL FLOW HACK:" End with "Drop your market below and let's talk strategy."`,
        },
      ],

      // Schedule: post every 8 hours (3x/day) — slightly less than the main group
      postIntervalHours: 8,
      postingWindowStart: 7,
      postingWindowEnd: 21,
      timezone: 'America/Chicago',

      // Quality bar (slightly higher — smaller audience, more trust at stake)
      minQualityScore: 8,
    },

  ],
};
