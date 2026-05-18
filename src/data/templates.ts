export type TemplateHabit = {
  name: string;
  detail: string;
  category: string;
};

export type HabitTemplate = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;          // Tailwind bg class for the card accent
  accentText: string;     // Tailwind text class
  accentBg: string;       // Tailwind bg class for badge
  intent: string;
  habits: TemplateHabit[];
};

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // ─── YOUR DAILY TASKS (from the image) ───────────────────────────────────
  {
    id: "daily-tasks",
    title: "My Daily Tasks",
    description: "Your personal handwritten routine — digitised and ready to track.",
    icon: "📋",
    color: "from-orange-500/10 to-amber-500/10",
    accentText: "text-orange-600 dark:text-orange-400",
    accentBg: "bg-orange-100 dark:bg-orange-900/30",
    intent: "Complete every task with full presence and discipline.",
    habits: [
      { name: "Wake up @ 5:30 AM", detail: "Rise early and set the tone for the day.", category: "Morning" },
      { name: "Kitchen deep clean", detail: "Keep the kitchen spotless every morning.", category: "Home" },
      { name: "Baby chores", detail: "Attend to baby's morning needs and care.", category: "Family" },
      { name: "Pooja and chanting", detail: "10–15 minutes of prayer and mantra chanting.", category: "Spiritual" },
      { name: "Read a book", detail: "Read at least 10 pages of a meaningful book.", category: "Learning" },
      { name: "Office work", detail: "Focus block for professional tasks.", category: "Work" },
      { name: "Drink 3L water", detail: "Stay hydrated throughout the day.", category: "Health" },
      { name: "Hair and skin care", detail: "Daily self-care routine for hair and skin.", category: "Self-Care" },
      { name: "Study", detail: "Dedicated study or skill-building session.", category: "Learning" },
      { name: "Walk 10,000 steps", detail: "Hit your daily step goal — walk, don't skip.", category: "Fitness" },
    ],
  },

  // ─── MORNING ROUTINE ─────────────────────────────────────────────────────
  {
    id: "morning-routine",
    title: "Morning Routine",
    description: "Start every day with intention, energy, and clarity.",
    icon: "🌅",
    color: "from-yellow-500/10 to-orange-400/10",
    accentText: "text-yellow-600 dark:text-yellow-400",
    accentBg: "bg-yellow-100 dark:bg-yellow-900/30",
    intent: "Own the morning, own the day.",
    habits: [
      { name: "Wake up early", detail: "Rise before 6 AM to get a head start.", category: "Morning" },
      { name: "No phone for 30 min", detail: "Protect your mind from distractions first thing.", category: "Morning" },
      { name: "Drink a glass of water", detail: "Rehydrate after 8 hours of sleep.", category: "Health" },
      { name: "Morning stretch / yoga", detail: "5–10 minutes to wake up the body.", category: "Fitness" },
      { name: "Meditation", detail: "10 minutes of mindful breathing or guided meditation.", category: "Mindfulness" },
      { name: "Journaling", detail: "Write 3 things you're grateful for.", category: "Mindfulness" },
      { name: "Healthy breakfast", detail: "Fuel your body with a nutritious meal.", category: "Health" },
      { name: "Review daily goals", detail: "Spend 5 minutes planning your top 3 priorities.", category: "Productivity" },
    ],
  },

  // ─── FITNESS & HEALTH ────────────────────────────────────────────────────
  {
    id: "fitness-health",
    title: "Fitness & Health",
    description: "Build a strong body and healthy lifestyle one day at a time.",
    icon: "💪",
    color: "from-green-500/10 to-emerald-400/10",
    accentText: "text-green-600 dark:text-green-400",
    accentBg: "bg-green-100 dark:bg-green-900/30",
    intent: "A healthy body is the foundation of everything.",
    habits: [
      { name: "Morning workout", detail: "30–45 min of exercise — gym, run, or home workout.", category: "Fitness" },
      { name: "Drink 3L water", detail: "Track your water intake throughout the day.", category: "Health" },
      { name: "Walk 10,000 steps", detail: "Stay active — take the stairs, walk after meals.", category: "Fitness" },
      { name: "Eat vegetables", detail: "Include at least 2 servings of vegetables today.", category: "Health" },
      { name: "No junk food", detail: "Avoid processed and fried foods today.", category: "Health" },
      { name: "Sleep by 10 PM", detail: "Prioritise 7–8 hours of quality sleep.", category: "Health" },
      { name: "Stretching / cool down", detail: "5 minutes of stretching after workout.", category: "Fitness" },
      { name: "Track calories", detail: "Log your meals to stay aware of nutrition.", category: "Health" },
    ],
  },

  // ─── MINDFULNESS & SPIRITUAL ─────────────────────────────────────────────
  {
    id: "mindfulness",
    title: "Mindfulness & Spiritual",
    description: "Cultivate inner peace, gratitude, and spiritual growth daily.",
    icon: "🧘",
    color: "from-purple-500/10 to-violet-400/10",
    accentText: "text-purple-600 dark:text-purple-400",
    accentBg: "bg-purple-100 dark:bg-purple-900/30",
    intent: "Peace is not found — it is cultivated.",
    habits: [
      { name: "Morning meditation", detail: "10–20 minutes of silent or guided meditation.", category: "Mindfulness" },
      { name: "Pooja / prayer", detail: "Daily prayer or devotional practice.", category: "Spiritual" },
      { name: "Chanting / mantra", detail: "Recite your chosen mantra 108 times.", category: "Spiritual" },
      { name: "Gratitude journaling", detail: "Write 3 things you are grateful for today.", category: "Mindfulness" },
      { name: "Read spiritual text", detail: "10 minutes from Gita, Bible, Quran, or any scripture.", category: "Spiritual" },
      { name: "Digital detox hour", detail: "One hour completely offline — be present.", category: "Mindfulness" },
      { name: "Evening reflection", detail: "5 minutes reviewing your day with compassion.", category: "Mindfulness" },
      { name: "Acts of kindness", detail: "Do one kind thing for someone today.", category: "Spiritual" },
    ],
  },

  // ─── PRODUCTIVITY & WORK ─────────────────────────────────────────────────
  {
    id: "productivity",
    title: "Productivity & Work",
    description: "Deep work habits to help you achieve more with less stress.",
    icon: "🎯",
    color: "from-blue-500/10 to-cyan-400/10",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-100 dark:bg-blue-900/30",
    intent: "Do less, but do it with full focus.",
    habits: [
      { name: "Plan top 3 tasks", detail: "Identify your 3 most important tasks for today.", category: "Productivity" },
      { name: "Deep work block (2h)", detail: "2 hours of uninterrupted focused work.", category: "Work" },
      { name: "No social media before noon", detail: "Protect your peak hours from distraction.", category: "Productivity" },
      { name: "Clear email inbox", detail: "Process and respond to all important emails.", category: "Work" },
      { name: "Review & update tasks", detail: "End-of-day review of what was done and what's next.", category: "Productivity" },
      { name: "Learn one new thing", detail: "Read an article, watch a tutorial, or take a lesson.", category: "Learning" },
      { name: "Pomodoro sessions", detail: "Use 25-min focus + 5-min break cycles.", category: "Productivity" },
      { name: "Weekly review (Sundays)", detail: "Review goals, wins, and plan the next week.", category: "Productivity" },
    ],
  },

  // ─── LEARNING & GROWTH ───────────────────────────────────────────────────
  {
    id: "learning",
    title: "Learning & Growth",
    description: "Invest in yourself every day — knowledge compounds.",
    icon: "📚",
    color: "from-indigo-500/10 to-blue-400/10",
    accentText: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-indigo-100 dark:bg-indigo-900/30",
    intent: "Every day is a chance to become a better version of yourself.",
    habits: [
      { name: "Read 20 pages", detail: "Read from a non-fiction or self-improvement book.", category: "Learning" },
      { name: "Study session (1h)", detail: "Dedicated study time for your current course or skill.", category: "Learning" },
      { name: "Practice a skill", detail: "Deliberate practice — music, coding, language, etc.", category: "Learning" },
      { name: "Watch educational content", detail: "One educational video or podcast episode.", category: "Learning" },
      { name: "Write / blog", detail: "Write 200+ words — journal, blog, or notes.", category: "Learning" },
      { name: "Vocabulary / language", detail: "Learn 5 new words or practice a foreign language.", category: "Learning" },
      { name: "Teach someone", detail: "Explain something you learned to reinforce it.", category: "Learning" },
    ],
  },

  // ─── SELF-CARE & WELLNESS ────────────────────────────────────────────────
  {
    id: "self-care",
    title: "Self-Care & Wellness",
    description: "Nourish your mind, body, and soul with daily self-love rituals.",
    icon: "🌸",
    color: "from-pink-500/10 to-rose-400/10",
    accentText: "text-pink-600 dark:text-pink-400",
    accentBg: "bg-pink-100 dark:bg-pink-900/30",
    intent: "You cannot pour from an empty cup.",
    habits: [
      { name: "Skincare routine (AM)", detail: "Cleanse, tone, moisturise, and SPF.", category: "Self-Care" },
      { name: "Skincare routine (PM)", detail: "Evening cleanse and night cream.", category: "Self-Care" },
      { name: "Hair care", detail: "Oil, wash, or treatment as per schedule.", category: "Self-Care" },
      { name: "Healthy meal prep", detail: "Prepare at least one healthy meal from scratch.", category: "Health" },
      { name: "Relaxation time", detail: "30 minutes of something purely enjoyable.", category: "Self-Care" },
      { name: "No negative self-talk", detail: "Catch and reframe any negative thoughts.", category: "Mindfulness" },
      { name: "Connect with a loved one", detail: "Call or spend quality time with family or friends.", category: "Relationships" },
      { name: "Early bedtime", detail: "In bed by 10 PM for quality rest.", category: "Health" },
    ],
  },

  // ─── FAMILY & HOME ───────────────────────────────────────────────────────
  {
    id: "family-home",
    title: "Family & Home",
    description: "Keep your home peaceful and your family bonds strong.",
    icon: "🏡",
    color: "from-amber-500/10 to-yellow-400/10",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-amber-100 dark:bg-amber-900/30",
    intent: "A happy home is built one small act at a time.",
    habits: [
      { name: "Morning tidy-up", detail: "Make beds, clear surfaces, quick sweep.", category: "Home" },
      { name: "Kitchen clean", detail: "Wash dishes and wipe counters after every meal.", category: "Home" },
      { name: "Baby / child care tasks", detail: "Attend to children's needs and activities.", category: "Family" },
      { name: "Family meal together", detail: "Eat at least one meal together as a family.", category: "Family" },
      { name: "Quality time with kids", detail: "30 minutes of undivided attention — play, read, talk.", category: "Family" },
      { name: "Evening tidy-up", detail: "Reset the home before bed.", category: "Home" },
      { name: "Grocery / meal planning", detail: "Plan meals and check pantry stock.", category: "Home" },
      { name: "Gratitude with family", detail: "Share one thing you're grateful for at dinner.", category: "Family" },
    ],
  },

  // ─── FINANCIAL DISCIPLINE ────────────────────────────────────────────────
  {
    id: "financial",
    title: "Financial Discipline",
    description: "Build wealth through daily awareness and smart money habits.",
    icon: "💰",
    color: "from-teal-500/10 to-green-400/10",
    accentText: "text-teal-600 dark:text-teal-400",
    accentBg: "bg-teal-100 dark:bg-teal-900/30",
    intent: "Financial freedom is built one disciplined day at a time.",
    habits: [
      { name: "Track daily expenses", detail: "Log every rupee/dollar spent today.", category: "Finance" },
      { name: "No impulse purchases", detail: "Wait 24 hours before any unplanned buy.", category: "Finance" },
      { name: "Review budget", detail: "Check if you're on track with monthly budget.", category: "Finance" },
      { name: "Save / invest today", detail: "Transfer a fixed amount to savings or investment.", category: "Finance" },
      { name: "Read financial news", detail: "10 minutes of financial literacy content.", category: "Learning" },
      { name: "Avoid eating out", detail: "Cook at home to save money and eat healthier.", category: "Finance" },
    ],
  },
];
