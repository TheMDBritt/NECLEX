export interface Verse {
  ref: string;
  text: string;
}

/**
 * Verses chosen to encourage a nursing student under exam pressure.
 * Rotated daily by date so a returning learner sees a different one each day.
 */
export const verses: Verse[] = [
  {
    ref: "Philippians 4:6–7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
  },
  {
    ref: "Joshua 1:9",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
  },
  {
    ref: "Isaiah 40:31",
    text: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
  },
  {
    ref: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
  },
  {
    ref: "2 Timothy 1:7",
    text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
  },
  {
    ref: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
  },
  {
    ref: "Psalm 46:5",
    text: "God is within her, she will not fall; God will help her at break of day.",
  },
  {
    ref: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
  },
  {
    ref: "Proverbs 3:5–6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  },
  {
    ref: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
  },
  {
    ref: "Psalm 27:1",
    text: "The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?",
  },
  {
    ref: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
  },
  {
    ref: "Psalm 23:4",
    text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
  },
  {
    ref: "1 Corinthians 15:58",
    text: "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain.",
  },
  {
    ref: "Mark 9:23",
    text: "Everything is possible for one who believes.",
  },
  {
    ref: "Psalm 121:1–2",
    text: "I lift up my eyes to the mountains — where does my help come from? My help comes from the Lord, the Maker of heaven and earth.",
  },
  {
    ref: "Deuteronomy 31:6",
    text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
  },
  {
    ref: "Lamentations 3:22–23",
    text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
  },
  {
    ref: "Psalm 28:7",
    text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
  },
  {
    ref: "Zephaniah 3:17",
    text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
  },
];

/**
 * Returns a stable verse for a given date (defaults to today).
 * Same date → same verse; different date → next verse in the rotation.
 */
export function verseForDate(date: Date = new Date()): Verse {
  // Days since epoch as a stable rotating index.
  const days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const verse = verses[days % verses.length];
  // Non-null: verses array is non-empty.
  return verse ?? verses[0]!;
}
