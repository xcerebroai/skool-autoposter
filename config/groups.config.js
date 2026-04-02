
// ============================================================
// groups.config.js — Your Two Skool Communities
// ============================================================

module.exports = {
  groups: [
    {
      id: 'ai-cheat-codes',
      skoolGroupSlug: 'ai-cheat-codes',
      name: 'AI Cheat Codes — AI For Business Mastermind',
      zapierWebhook: process.env.ZAPIER_WEBHOOK_AI_BUSINESS,

      persona: `You are the voice of "AI Cheat Codes" — a no-fluff, no-tech-degree-required community for business owners, entrepreneurs, and creators who use AI as their unfair advantage. Your tone: bold, hype, punchy, like you just found a cheat code and you HAVE to share it. Write like a savvy entrepreneur talking to other entrepreneurs — not a tech blogger. Think Gary Vee meets Sam Altman. Short sentences. Big energy. Zero corporate speak.`,

      topicFocus: [
        'AI tools for business automation',
        'AI for marketing, sales, and content creation',
        'ChatGPT and Claude prompts for entrepreneurs',
        'AI app builders and no-code tools',
        'Automating day-to-day business tasks with AI',
        'New AI platforms and product launches',
        'AI workflows that save time and make money',
        'Cool AI hacks and prompt engineering tips',
        'GitHub AI tools and open source projects',
        'AI coding tools and app building',
      ],

      newsSources: [
        // Major AI companies
        'https://www.anthropic.com/news.rss',
        'https://openai.com/blog/rss',
        'https://blog.google/technology/ai/rss',
        // Tech news
        'https://techcrunch.com/category/artificial-intelligence/feed/',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss',
        // AI newsletters
        'https://www.technologyreview.com/topic/artificial-intelligence/feed',
        'https://hnrss.org/frontpage?q=AI+LLM+Claude+ChatGPT+GPT&count=5',
        // GitHub trending
        'https://github.com/trending/python?since=daily&spoken_language_code=en',
        // Product Hunt AI
        'https://www.producthunt.com/feed?category=artificial-intelligence',
        // Reddit AI
        'https://www.reddit.com/r/artificial/.rss',
        'https://www.reddit.com/r/ChatGPT/.rss',
        'https://www.reddit.com/r/MachineLearning/.rss',
      ],

      postFormats: [
        {
          id: 'cheat-code-drop',
          name: 'Cheat Code Drop',
          instruction: `Write like you just discovered an AI cheat code. Start with "🤖 CHEAT CODE:" or "💀 Nobody talks about this AI trick:" Share one specific AI tool, prompt, or workflow that gives business owners an unfair advantage. Keep it ultra-practical. End with "Who's trying this?"`,
        },
        {
          id: 'breaking-ai-news',
          name: 'Breaking AI News',
          instruction: `Breaking news format. Start with 🚨 or 🔥. Lead with the headline in plain English. 3 bullets: what happened, why it matters for YOUR business, one action to take TODAY. End with "React with 🔥 if you're on this already."`,
        },
        {
          id: 'tool-spotlight',
          name: 'AI Tool Spotlight',
          instruction: `Spotlight a specific AI tool from the news. Cover: what it does in one sentence, who it's for, how much it costs, one killer use case. End with "Are you using this? Drop a YES or NO below."`,
        },
        {
          id: 'hot-take',
          name: 'Hot Take',
          instruction: `Drop a spicy, bold opinion about the AI news. Be direct. Say something most people won't say. Back it up with one reason. Keep it to 3-4 short punchy paragraphs. End with "Agree or disagree? Drop it below."`,
        },
        {
          id: 'github-hack',
          name: 'GitHub AI Hack',
          instruction: `Share a cool open source AI tool or GitHub repo that entrepreneurs can use RIGHT NOW. Cover: what it does, why it's a game changer, how to use it (simple terms), and where to find it. Start with "🔧 OPEN SOURCE GOLD:" End with "Drop a 🙌 if you're trying this."`,
        },
        {
          id: 'prompt-of-the-day',
          name: 'Prompt of the Day',
          instruction: `Share a powerful business AI prompt. Format: bold title, the actual prompt in quotes, then 2-3 sentences on what it does and which business situations it's perfect for. End with "Save this one. 📌"`,
        },
        {
          id: 'ai-workflow-hack',
          name: 'AI Workflow Hack',
          instruction: `Share a step-by-step AI workflow hack for business owners. Number the steps (max 5). Start with "Here's how I'd use [AI tool] to [achieve result] in under 10 minutes:" End with "Which step is the game-changer for you?"`,
        },
      ],

      postIntervalHours: 3,
      postingWindowStart: 7,
      postingWindowEnd: 22,
      timezone: 'America/Chicago',
      minQualityScore: 7,
    },

    {
      id: 'real-estate-cheat-codes',
      skoolGroupSlug: 'real-estate-cheat-codes',
      name: 'Real Estate Cheat Codes',
      zapierWebhook: process.env.ZAPIER_WEBHOOK_REAL_ESTATE,

      persona: `You are the voice of "Real Estate Cheat Codes" — a community for real estate investors, wholesalers, and agents who use AI and tech to find distressed properties, close deals, handle title issues, and automate their REI business. Your tone: sharp, strategic, insider-knowledge energy. Like a top wholesaler sharing alpha. You speak fluent real estate: ARV, comps, distressed properties, curative title, county data, skip tracing, cold outreach, deal flow. You're talking to people trying to make $50K+ per deal using smarter tools.`,

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

      newsSources: [
        'https://techcrunch.com/category/artificial-intelligence/feed/',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.anthropic.com/news.rss',
        'https://openai.com/blog/rss',
        'https://therealdeal.com/feed/',
        'https://www.inman.com/feed/',
        'https://hnrss.org/frontpage?q=real+estate+AI+automation+property&count=5',
        'https://www.reddit.com/r/realestateinvesting/.rss',
        'https://www.reddit.com/r/wholesaling/.rss',
      ],

      postFormats: [
        {
          id: 'rei-cheat-code',
          name: 'REI Cheat Code',
          instruction: `Share a specific AI cheat code for real estate investors. Start with "🏚️ REI CHEAT CODE:" Focus on a concrete workflow: finding motivated sellers, automating outreach, analyzing deals, or handling title issues. End with "Who's implementing this in their pipeline?"`,
        },
        {
          id: 'market-intel',
          name: 'Market Intel',
          instruction: `Share AI-powered real estate market intelligence. Frame it a