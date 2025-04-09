export const story = {
  title: "The Crystal of Destiny",
  opening: "In the mystical realm of Eldara, where magic flows like rivers and ancient prophecies whisper through the wind, you are a young mage discovering your extraordinary powers. The sacred Crystal of Destiny, guardian of balance between light and dark magic, has been shattered into fragments, threatening to unleash chaos across the realms.",
  conflict: "As the chosen one prophesied in ancient scrolls, you must embark on a perilous journey to restore the Crystal before darkness consumes everything. Your decisions will shape not only your destiny but the fate of all Eldara.",
  choices: [
    {
      id: 1,
      text: "A mysterious elder offers to teach you forbidden magic. Do you...",
      options: [
        "Accept the knowledge, despite the risks",
        "Decline, choosing to follow the traditional path"
      ]
    },
    {
      id: 2,
      text: "You discover a wounded dark creature. Do you...",
      options: [
        "Help heal it, showing mercy",
        "Leave it, as dark creatures are dangerous"
      ]
    },
    {
      id: 3,
      text: "A village is under attack by shadow wraiths. Do you...",
      options: [
        "Stay and defend the villagers",
        "Continue your quest, time is running out"
      ]
    },
    {
      id: 4,
      text: "You find an ancient spellbook with powerful but corrupted magic. Do you...",
      options: [
        "Take it, knowledge is power",
        "Leave it sealed, some knowledge is better left untouched"
      ]
    },
    {
      id: 5,
      text: "A rival mage challenges you to a duel. Do you...",
      options: [
        "Accept the challenge",
        "Find a diplomatic solution"
      ]
    },
    {
      id: 6,
      text: "You discover a shortcut through dangerous territory. Do you...",
      options: [
        "Take the risk to save time",
        "Choose the longer, safer path"
      ]
    },
    {
      id: 7,
      text: "A powerful artifact could boost your magic, but it belongs to a temple. Do you...",
      options: [
        "Borrow it temporarily",
        "Respect the temple's property"
      ]
    },
    {
      id: 8,
      text: "You uncover a traitor in your group. Do you...",
      options: [
        "Show mercy and give them a chance to redeem",
        "Banish them from the group"
      ]
    },
    {
      id: 9,
      text: "The final crystal fragment is guarded by an ancient spirit. Do you...",
      options: [
        "Try to negotiate",
        "Prepare for battle"
      ]
    },
    {
      id: 10,
      text: "With the crystal restored, you have a choice. Do you...",
      options: [
        "Keep its power for yourself",
        "Share its power with all of Eldara"
      ]
    }
  ],
  outcomes: [
    {
      id: 1,
      text: "The forbidden knowledge opens your mind but leaves a dark mark on your soul.",
      impact: -1
    },
    {
      id: 2,
      text: "The creature becomes a loyal ally, proving that compassion has power.",
      impact: 1
    },
    {
      id: 3,
      text: "Your bravery saves many lives and earns you the villagers' eternal gratitude.",
      impact: 1
    },
    {
      id: 4,
      text: "The corrupted magic enhances your power but at a cost to your purity.",
      impact: -1
    },
    {
      id: 5,
      text: "The duel's outcome teaches you valuable lessons about power and wisdom.",
      impact: 0
    },
    {
      id: 6,
      text: "Your choice reveals much about your character and priorities.",
      impact: 0
    },
    {
      id: 7,
      text: "Your decision regarding the artifact reflects your respect for tradition.",
      impact: 1
    },
    {
      id: 8,
      text: "How you handle betrayal shapes the loyalty of those around you.",
      impact: 1
    },
    {
      id: 9,
      text: "Your approach to the guardian demonstrates your true character.",
      impact: 0
    },
    {
      id: 10,
      text: "The final choice determines your legacy in Eldara.",
      impact: 1
    }
  ],
  endings: {
    good: "You become a legendary guardian of Eldara, remembered for generations as a wise and benevolent protector of the Crystal's power.",
    neutral: "Your journey concludes with balance restored, though some question the choices that led you here.",
    bad: "The Crystal's power is restored, but at a great cost to your soul. Your name becomes a cautionary tale in Eldara's history."
  }
};