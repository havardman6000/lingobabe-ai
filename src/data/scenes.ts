export const scenes = {
    1: {
      initial: {
        chinese: '刚刚好，我正欣赏着这里的氛围——看来你的品味不错。',
        pinyin: 'Gānggāng hǎo, wǒ zhèng xīnshǎng zhe zhèlǐ de fēnwèi——kànlái nǐ de pǐnwèi búcuò.',
        english: 'Perfect timing. I was just admiring the ambiance—seems like you have good taste.',
        context: 'Seated at a beautifully set table, she gracefully looks up as you arrive.'
      },
      options: [
        {
          chinese: '我特意订了座位，今晚当然要享受最好的。',
          pinyin: 'Wǒ tèyì dìngle zuòwèi, jīnwǎn dāngrán yào xiǎngshòu zuì hǎo de.',
          english: 'I took the liberty of making a reservation. Only the best for tonight.',
          points: 12,
          response: {
            chinese: '懂得提前计划的男人——我喜欢。这很有自信。',
            pinyin: 'Dǒngdé tíqián jìhuà de nánrén——wǒ xǐhuan. Zhè hěn yǒu zìxìn.',
            english: 'A man who plans ahead—I like that. It shows confidence.',
            context: 'Smiles approvingly, adjusting her napkin.'
          }
        },
        // Add other options from your original scenes...
      ]
    },
    // Add other scenes...
  }
  
  export type Scene = typeof scenes[keyof typeof scenes]
  export type Option = Scene['options'][number]
  // src/data/scenes.ts