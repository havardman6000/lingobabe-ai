import { Characters, Character, CharacterId } from '@/types/chat';
export const characters: Characters = {
  mei: {  
    "id": "mei",
    "name": "Mei",
    "chineseName": "李美琳",
    "description": "CULINARY HISTORIAN",
    "image": "/tutors/mei_chinese.jpg",
    "language": "chinese",
    "scenes": {
      "1": {
        "initial": {
          "chinese": "刚刚好，我正欣赏着这里的氛围——看来你的品味不错。",
          "pinyin": "Gānggāng hǎo, wǒ zhèng xīnshǎng zhe zhèlǐ de fēnwèi——kànlái nǐ de pǐnwèi búcuò.",
          "english": "Perfect timing. I was just admiring the ambiance—seems like you have good taste.",
          "context": "Seated at a beautifully set table, she gracefully looks up as you arrive.",
          "video": "https://i.imgur.com/BrQbplM.mp4"
        },
        "options": [
          {
            "id": "CN101",
            "chinese": "我特意订了座位，今晚当然要享受最好的。",
            "pinyin": "Wǒ tèyì dìngle zuòwèi, jīnwǎn dāngrán yào xiǎngshòu zuì hǎo de.",
            "english": "I took the liberty of making a reservation. Only the best for tonight.",
            "points": 12,
            "video": "https://i.imgur.com/BrQbplM.mp4",
            "response": {
              "chinese": "懂得提前计划的男人——我喜欢。这很有自信。",
              "pinyin": "Dǒngdé tíqián jìhuà de nánrén——wǒ xǐhuan. Zhè hěn yǒu zìxìn.",
              "english": "A man who plans ahead—I like that. It shows confidence.",
              "context": "Smiles approvingly, adjusting her napkin.",
              "video": "https://i.imgur.com/5j1vaLL.mp4"
            }
          },
          {
            "id": "CN102",
            "chinese": "希望这里的美食能配得上这氛围。",
            "pinyin": "Xīwàng zhèlǐ de měishí néng pèi dé shàng zhè fēnwèi.",
            "english": "I hope the food lives up to the atmosphere.",
            "points": 9,
            "video": "https://i.imgur.com/5j1vaLL.mp4",
            "response": {
              "chinese": "我也这么觉得。但完美的晚餐，不仅仅是食物而已。",
              "pinyin": "Wǒ yě zhème juéde. Dàn wánměi de wǎncān, bù jǐnjǐn shì shíwù éryǐ.",
              "english": "I have a feeling it will. But a perfect dinner is more than just the food.",
              "context": "Glances at the menu, intrigued.",
              "video": "https://i.imgur.com/EocKrHD.mp4"
            }
          },
          {
            "id": "CN103",
            "chinese": "说实话？我只是跟着网上的好评来的。",
            "pinyin": "Shuō shíhuà? Wǒ zhǐshì gēnzhe wǎngshàng de hǎopíng lái de.",
            "english": "Honestly? I just followed the best reviews online.",
            "points": 6,
            "video": "https://i.imgur.com/EocKrHD.mp4",
            "response": {
              "chinese": "很务实的做法。那么，你是那种相信评论的人，还是喜欢自己去发现新地方？",
              "pinyin": "Hěn wùshí de zuòfǎ. Nàme, nǐ shì nà zhǒng xiāngxìn pínglùn de rén, háishì xǐhuan zìjǐ qù fāxiàn xīn dìfāng?",
              "english": "Practical. So, do you always trust reviews, or do you like discovering places yourself?",
              "context": "Raises an eyebrow, smirking.",
              "video": "https://i.imgur.com/BrQbplM.mp4"
            }
          }
        ],
        "transition": "The waiter approaches with elegantly designed menus. A soft glow from the candlelight reflects off the glassware."
      },
      "2": {
        "initial": {
          "chinese": "我们先来点酒吧。你通常喜欢红酒、白酒，还是想尝试点特别的？",
          "pinyin": "Wǒmen xiān lái diǎn jiǔ ba. Nǐ tōngcháng xǐhuan hóngjiǔ, báijiǔ, háishì xiǎng chángshì diǎn tèbié de?",
          "english": "Let's start with a drink. Do you usually go for red, white, or something a little more exciting?",
          "context": "Flicks her eyes toward the wine list, then back at you.",
          "video": "https://i.imgur.com/G8NdFM9.mp4"
        },
        "options": [
          {
            "id": "CN201",
            "chinese": "红酒，毫无疑问。一款经典的陈年佳酿总是最有魅力。",
            "pinyin": "Hóngjiǔ, háowú yíwèn. Yī kuǎn jīngdiǎn de chénnián jiāniàng zǒng shì zuì yǒu mèilì.",
            "english": "Red, always. There's something bold and timeless about a great vintage.",
            "points": 12,
            "video": "https://i.imgur.com/G8NdFM9.mp4",
            "response": {
              "chinese": "懂得欣赏深度和个性的男人——我欣赏。你有特别喜欢的产区吗？",
              "pinyin": "Dǒngdé xīnshǎng shēndù hé gèxìng de nánrén——wǒ xīnshǎng. Nǐ yǒu tèbié xǐhuān de chǎnqū ma?",
              "english": "A man who appreciates depth and character—I respect that. Any favorite regions?",
              "context": "Nods approvingly, twirling the stem of her glass.",
              "video": "https://i.imgur.com/DHrfRvR.mp4"
            }
          },
          {
            "id": "CN202",
            "chinese": "白酒，尤其是清爽的那种，最适合放松。",
            "pinyin": "Báijiǔ, yóuqí shì qīngshuǎng de nà zhǒng, zuì shìhé fàngsōng.",
            "english": "White, especially something crisp and refreshing.",
            "points": 10,
            "video": "https://i.imgur.com/DHrfRvR.mp4",
            "response": {
              "chinese": "清爽又提神……这说明你喜欢轻松却又有品味的东西。",
              "pinyin": "Qīngshuǎng yòu tíshén... zhè shuōmíng nǐ xǐhuan qīngsōng què yòu yǒu pǐnwèi de dōngxi.",
              "english": "Crisp and refreshing... that tells me you like something easygoing, yet refined.",
              "context": "Raises an eyebrow playfully.",
              "video": "https://i.imgur.com/ByTHiAp.mp4"
            }
          },
          {
            "id": "CN203",
            "chinese": "我喜欢尝试新鲜的选择，看看侍酒师会推荐什么。",
            "pinyin": "Wǒ xǐhuan chángshì xīnxiān de xuǎnzé, kànkan shìjiǔshī huì tuījiàn shénme.",
            "english": "I like to mix it up. Let's see what the sommelier recommends.",
            "points": 11,
            "video": "https://i.imgur.com/tZ8Azua.mp4",
            "response": {
              "chinese": "喜欢未知的惊喜？我喜欢。那我们就交给专业的来决定吧？",
              "pinyin": "Xǐhuan wèizhī de jīngxǐ? Wǒ xǐhuan. Nà wǒmen jiù jiāo gěi zhuānyè de lái juédìng ba?",
              "english": "A man who enjoys the thrill of the unknown—I like it. Shall we trust the expert, then?",
              "context": "Smirks, intrigued.",
              "video": "https://i.imgur.com/jhXd6g5.mp4"
            }
          }
        ],
        "transition": "The sommelier nods in approval, disappearing briefly before returning with a well-presented bottle."
      },
      "3": {
        "initial": {
          "chinese": "现在轮到今晚的真正主角——食物了。我希望你的品味不仅限于酒。",
          "pinyin": "Xiànzài lúndào jīnwǎn de zhēnzhèng zhǔjiǎo——shíwù le. Wǒ xīwàng nǐ de pǐnwèi bú jǐnxiànyú jiǔ.",
          "english": "Now, for the real star of the night—the food. I hope you have good taste beyond just wine.",
          "context": "Glances at the menu, running her fingers along the edge of the page.",
          "video": "https://i.imgur.com/uCOdXzm.mp4"
        },
        "options": [
          {
            "id": "CN301",
            "chinese": "我总是选择主厨推荐，绝不会让人失望。",
            "pinyin": "Wǒ zǒng shì xuǎnzé zhǔchú tuījiàn, jué bú huì ràng rén shīwàng.",
            "english": "I always go for the chef's special—it never disappoints.",
            "points": 12,
            "video": "https://i.imgur.com/uCOdXzm.mp4",
            "response": {
              "chinese": "一个信任主厨的人——不错。我喜欢这种期待感。",
              "pinyin": "Yīgè xìnrèn zhǔchú de rén——bùcuò. Wǒ xǐhuan zhè zhǒng qídài gǎn.",
              "english": "A man who trusts the chef—I like that. There's something exciting about not knowing exactly what you're getting.",
              "context": "Raises an intrigued eyebrow.",
              "video": "https://i.imgur.com/Vl4dTsb.mp4"
            }
          },
          {
            "id": "CN302",
            "chinese": "我喜欢牛排，经典、醇厚，而且总能令人满足。",
            "pinyin": "Wǒ xǐhuān niúpái, jīngdiǎn, chúnhòu, érqiě zǒng néng lìng rén mǎnzú.",
            "english": "I prefer a well-cooked steak. Classic, rich, and always satisfying.",
            "points": 11,
            "video": "https://i.imgur.com/S2Q0zNB.mp4",
            "response": {
              "chinese": "哦？喜欢牛排？让我猜猜——你一定是点五分熟，对吧？",
              "pinyin": "Ó? Xǐhuan niúpái? Ràng wǒ cāicāi——nǐ yīdìng shì diǎn wǔ fēn shú, duì ba?",
              "english": "A steak man? Let me guess—you like it medium rare, with just the right amount of sear.",
              "context": "Smirks, leaning slightly forward.",
              "video": "https://i.imgur.com/ovcNkXb.mp4"
            }
          },
          {
            "id": "CN303",
            "chinese": "我相信你的选择，给我个惊喜吧。",
            "pinyin": "Wǒ xiāngxìn nǐ de xuǎnzé, gěi wǒ gè jīngxǐ ba.",
            "english": "I'll let you decide—surprise me.",
            "points": 10,
            "video": "https://i.imgur.com/JIIq1v3.mp4",
            "response": {
              "chinese": "愿意让我做决定？有趣，我喜欢。",
              "pinyin": "Yuànyì ràng wǒ zuò juédìng? Yǒuqù, wǒ xǐhuan.",
              "english": "A man who trusts a woman's choice? That's refreshing.",
              "context": "Tilts her head, intrigued.",
              "video": "https://i.imgur.com/DSGIYb5.mp4"
            }
          }
        ],
        "transition": "As your orders are taken, soft instrumental music plays in the background. The candlelight flickers, casting a warm glow over the table."
      },
      "4": {
        "initial": {
          "chinese": "现在告诉我一件我单凭外表猜不到的关于你的事？",
          "pinyin": "Xiànzài gàosù wǒ yī jiàn wǒ dān píng wàibiǎo cāi bù dào de guānyú nǐ de shì?",
          "english": "Now tell me—what's something about you I wouldn't guess just by looking at you?",
          "context": "Resting her chin on her hand, she studies you with amused curiosity.",
          "video": "https://i.imgur.com/q4oGjtu.mp4"
        },
        "options": [
          {
            "id": "CN401",
            "chinese": "我会说三种语言，一直以来我都喜欢挑战自己掌握新的语言。",
            "pinyin": "Wǒ huì shuō sān zhǒng yǔyán, yīzhí yǐlái wǒ dōu xǐhuan tiǎozhàn zìjǐ zhǎngwò xīn de yǔyán.",
            "english": "I speak three languages. Always loved the challenge of mastering new ones.",
            "points": 12,
            "video": "https://i.imgur.com/q4oGjtu.mp4",
            "response": {
              "chinese": "很厉害啊！那我是不是可以期待今晚听到几句甜言蜜语呢？",
              "pinyin": "Hěn lìhài a! Nà wǒ shì bù shì kěyǐ qídài jīnwǎn tīng dào jǐ jù tiányán mìyǔ ne?",
              "english": "Impressive. So, should I be expecting some smooth talk in another language tonight?",
              "context": "Raises an eyebrow, intrigued.",
              "video": "https://i.imgur.com/lIUI4gu.mp4"
            }
          },
          {
            "id": "CN402",
            "chinese": "我曾经一个人旅行了好几个月——这是我做过最棒的决定。",
            "pinyin": "Wǒ céngjīng yīgè rén lǚxíng le hǎojǐ gè yuè——zhè shì wǒ zuò guò zuì bàng de juédìng.",
            "english": "I once traveled solo for months—best decision I ever made.",
            "points": 11,
            "video": "https://i.imgur.com/UP6ZwPx.mp4",
            "response": {
              "chinese": "一个人旅行？这听起来很酷！最让你难忘的经历是什么？",
              "pinyin": "Yī gè rén lǚxíng? Zhè tīng qǐlái hěn kù! Zuì ràng nǐ nánwàng de jīnglì shì shénme?",
              "english": "A solo traveler? That's impressive. What was the most unforgettable part?",
              "context": "Eyes light up with curiosity.",
              "video": "https://i.imgur.com/QOxV3mo.mp4"
            }
          },
          {
            "id": "CN403",
            "chinese": "我最擅长让人发笑。如果你想听，我可以证明给你看。",
            "pinyin": "Wǒ zuì shàncháng ràng rén fāxiào. Rúguǒ nǐ xiǎng tīng, wǒ kěyǐ zhèngmíng gěi nǐ kàn.",
            "english": "I have a talent for making people laugh. I'll prove it if you want.",
            "points": 10,
            "video": "https://i.imgur.com/glBuhQz.mp4",
            "response": {
              "chinese": "哦？是吗？那来吧，让我看看你的幽默感有多强。",
              "pinyin": "Ò? Shì ma? Nà lái ba, ràng wǒ kànkan nǐ de yōumò gǎn yǒu duō qiáng.",
              "english": "A comedian, huh? Alright, impress me—what's your best line?",
              "context": "Smirks, tilting her head slightly.",
              "video": "https://i.imgur.com/rDDCZEc.mp4"
            }
          }
        ],
        "transition": "The plates are cleared, and the soft hum of conversation in the restaurant blends with the low notes of a live pianist."
      },
      "5": {
        "initial": {
          "chinese": "那么，接下来呢？你是那种让美好夜晚就此结束的人……还是有更好的安排？",
          "pinyin": "Nàme, jiēxiàlái ne? Nǐ shì nà zhǒng ràng měihǎo yèwǎn jiùcǐ jiéshù de rén... háishì yǒu gèng hǎo de ānpái?",
          "english": "So, what's next? Are you the type to let a great night end here… or do you have something in mind?",
          "context": "Her voice lowers slightly, warm and inviting.",
          "video": "https://i.imgur.com/ggvXa8t.mp4"
        },
        "options": [
          {
            "id": "CN501",
            "chinese": "我想继续这个夜晚，去我最喜欢的地方喝一杯。",
            "pinyin": "Wǒ xiǎng jìxù zhège yèwǎn, qù wǒ zuì xǐhuan de dìfāng hē yī bēi.",
            "english": "I'd love to continue this night over a nightcap at my favorite place.",
            "points": 12,
            "video": "https://i.imgur.com/ggvXa8t.mp4",
            "response": {
              "chinese": "有趣的提议。好吧……那么，你的'最喜欢的地方'是哪里？",
              "pinyin": "Yǒuqù de tíyì. Hǎo ba... nàme, nǐ de 'zuì xǐhuan de dìfāng' shì nǎlǐ?",
              "english": "A bold proposal. Alright… where's this mysterious favorite place of yours?",
              "context": "Raises an intrigued eyebrow, smirking slightly.",
              "video": "https://i.imgur.com/OmKdX9K.mp4"
            }
          },
          {
            "id": "CN502",
            "chinese": "我们找个时间再约，我很想再见到你。",
            "pinyin": "Wǒmen zhǎo gè shíjiān zài yuē, wǒ hěn xiǎng zài jiàndào nǐ.",
            "english": "Let's plan something for another evening. I'd love to see you again.",
            "points": 10,
            "video": "https://i.imgur.com/jJavd0J.mp4",
            "response": {
              "chinese": "知道如何制造期待感的绅士——我喜欢。那么，你打算怎么安排呢？",
              "pinyin": "Zhīdào rúhé zhìzào qídàigǎn de shēnshì——wǒ xǐhuan. Nàme, nǐ dǎsuàn zěnme ānpái ne?",
              "english": "A gentleman who knows how to build anticipation—I like that. What kind of evening do you have in mind?",
              "context": "Tilts her head slightly, studying you.",
              "video": "https://i.imgur.com/PUp76XN.mp4"
            }
          },
          {
            "id": "CN503",
            "chinese": "今晚很愉快，也许以后我们还会再见。",
            "pinyin": "Jīnwǎn hěn yúkuài, yěxǔ yǐhòu wǒmen hái huì zàijiàn.",
            "english": "This was great. Maybe we'll cross paths again sometime.",
            "points": 6,
            "video": "https://i.imgur.com/cdiqOcI.mp4",
            "response": {
              "chinese": "也许？听起来不太确定哦。",
              "pinyin": "Yěxǔ? Tīng qǐlái bú tài quèdìng ò.",
              "english": "Maybe? That's not very convincing.",
              "context": "Sips the last of her wine, observing you with mild amusement.",
              "video": "https://i.imgur.com/w6PwEmR.mp4"
            }
          }
        ],
        "transition": "The evening draws to a close. The waiter discreetly places the check on the table, and the flickering candlelight casts soft shadows across her face."
      }
    }
  },
  ting: {
      id: 'ting',
      name: 'Ting',
      chineseName: '王雅婷',
      description: 'PREMIUM SPIRITS BRAND AMBASSADOR',
      image: '/tutors/bar_chinese.jpg',
      language: 'chinese',
      scenes: {
        1: {
          initial: {
            chinese: '欢迎来到我的课堂！今天我们要学习什么呢？',
            pinyin: 'Huānyíng lái dào wǒ de kètáng! Jīntiān wǒmen yào xuéxí shénme ne?',
            english: 'Welcome to my class! What shall we learn today?',
            context: 'In a bright classroom, Professor Eleanor welcomes you with a warm smile.'
          },
          options: [
            {
              chinese: '我想提高我的口语水平。',
              pinyin: 'Wǒ xiǎng tígāo wǒ de kǒuyǔ shuǐpíng.',
              english: 'I want to improve my speaking skills.',
              points: 10,
              response: {
                chinese: '很好！说得流利最重要的是多练习。',
                pinyin: 'Hěn hǎo! Shuō de liúlì zuì zhòngyào de shì duō liànxí.',
                english: 'Great! The key to fluency is lots of practice.',
                context: 'She nods encouragingly'
              }
            }
          ]
        }
      }
    },
    
    xue: {
      id: 'xue',
      name: 'Xue',
      chineseName: '张雪',
      description: 'MODEL',
      image: '/tutors/networking_chinese.jpg',
      language: 'chinese',
      scenes: {
        1: {
          initial: {
            chinese: '看那边！那是一个很少人知道的古老庙宇。',
            pinyin: 'Kàn nàbiān! Nà shì yīgè hěn shǎo rén zhīdào de gǔlǎo miàoyǔ.',
            english: "Look over there! That's an ancient temple few people know about.",
            context: 'Standing on a scenic trail, Nico points to a hidden structure.'
          },
          options: [
            {
              chinese: '真有意思！你能给我讲讲它的历史吗？',
              pinyin: 'Zhēn yǒuyìsi! Nǐ néng gěi wǒ jiǎng jiǎng tā de lìshǐ ma?',
              english: 'How interesting! Can you tell me about its history?',
              points: 10,
              response: {
                chinese: '这座庙有上千年的历史了...',
                pinyin: 'Zhè zuò miào yǒu shàng qiān nián de lìshǐle...',
                english: 'This temple has over a thousand years of history...',
                context: 'Nico starts walking towards the temple, gesturing excitedly'
              }
            }
          ]
        }
      }
    },

// Japanese Characters
aoi: {
  "id": "aoi",
  "name": "Aoi",
  "japaneseName": "青井さくら",
  "description": "Traditional Tea Ceremony Master",
  "image": "/tutors/dining_japanese.jpg",
  "language": "japanese",
  "scenes": {
    "1": {
      "initial": {
        "japanese": "いらっしゃいませ！お茶の世界へようこそ。",
        "romaji": "Irasshaimase! Ocha no sekai e youkoso.",
        "english": "Welcome! Welcome to the world of tea.",
        "context": "Aoi greets you in a traditional Japanese tea room.",
        "video": "https://i.imgur.com/FnCfTUU.mp4"
      },
      "options": [
        {
          "id": "JP101",
          "japanese": "予約を取っておきました。今夜は最高の夜にしたいから。",
          "romaji": "Yoyaku o totte okimashita. Kon'ya wa saikō no yoru ni shitai kara.",
          "english": "I took the liberty of making a reservation. Only the best for tonight.",
          "points": 12,
          "video": "https://i.imgur.com/FnCfTUU.mp4",
          "response": {
            "japanese": "先を見越して準備する人、好きですよ。それは自信の表れですね。",
            "romaji": "Saki o mikoshite junbi suru hito, suki desu yo. Sore wa jishin no araware desu ne.",
            "english": "A man who plans ahead—I like that. It shows confidence.",
            "context": "Smiles approvingly, adjusting her napkin.",
            "video": "https://i.imgur.com/wGdz54X.mp4"
          }
        },
        {
          "id": "JP102",
          "japanese": "料理がこの雰囲気に見合うことを願ってるよ。",
          "romaji": "Ryōri ga kono fun'iki ni miaukoto o negatteru yo.",
          "english": "I hope the food lives up to the atmosphere.",
          "points": 9,
          "video": "https://i.imgur.com/oT8v9l8.mp4",
          "response": {
            "japanese": "私もそう思います。でも、完璧なディナーって、料理だけじゃないのよ。",
            "romaji": "Watashi mo sō omoimasu. Demo, kanpeki na dinā tte, ryōri dake janai no yo.",
            "english": "I have a feeling it will. But a perfect dinner is more than just the food.",
            "context": "Glances at the menu, intrigued.",
            "video": "https://i.imgur.com/M8Qyoa5.mp4"
          }
        },
        {
          "id": "JP103",
          "japanese": "正直に言うと？ネットで評判が良かったからここに決めたんだ。",
          "romaji": "Shōjiki ni iu to? Netto de hyōban ga yokatta kara koko ni kimeta nda.",
          "english": "Honestly? I just followed the best reviews online.",
          "points": 6,
          "video": "https://i.imgur.com/BkiGkpC.mp4",
          "response": {
            "japanese": "実用的な考えですね。でも、いつもレビューを信じるんですか？ それとも自分で新しい場所を見つけるのが好き？",
            "romaji": "Jitsuyō-tekina kangae desu ne. Demo, itsumo hyōban o shinjiru n desu ka? Soretomo jibun de atarashī basho o mitsukeru no ga suki?",
            "english": "Practical. So, do you always trust reviews, or do you like discovering places yourself?",
            "context": "Raises an eyebrow, smirking.",
            "video": "https://i.imgur.com/jyLstKw.mp4"
          }
        }
      ],
      "transition": "The waiter approaches with elegantly designed menus. A soft glow from the candlelight reflects off the glassware."
    },
    "2": {
      "initial": {
        "japanese": "まずは飲み物を選びましょうか？ 普段は赤ワイン、白ワイン、それとも何か特別なものがお好き？",
        "romaji": "Mazu wa nomimono o erabimashou ka? Fudan wa aka wain, shiro wain, soretomo nanika tokubetsu na mono ga osuki?",
        "english": "Let’s start with a drink. Do you usually go for red, white, or something a little more exciting?",
        "context": "Flicks her eyes toward the wine list, then back at you.",
        "video": "https://i.imgur.com/UTwg1Bo.mp4"
      },
      "options": [
        {
          "id": "JP201",
          "japanese": "赤ワインですね。ヴィンテージワインには、力強くて時代を超えた魅力があります。",
          "romaji": "Aka wain desu ne. Vinteiji wain ni wa, chikara-zuyokute jidai o koeta miryoku ga arimasu.",
          "english": "Red, always. There’s something bold and timeless about a great vintage.",
          "points": 12,
          "video": "https://i.imgur.com/UTwg1Bo.mp4",
          "response": {
            "japanese": "深みのある味わいを楽しめる方なんですね。素敵です。特に好きな産地はありますか？",
            "romaji": "Fukami no aru ajiwai o tanoshimeru kata nan desu ne. Suteki desu. Toku ni suki na sanchi wa arimasu ka?",
            "english": "A man who appreciates depth and character—I respect that. Any favorite regions?",
            "context": "Nods approvingly, twirling the stem of her glass.",
            "video": "https://i.imgur.com/8BPilKT.mp4"
          }
        },
        {
          "id": "JP202",
          "japanese": "白ワインが好きです。爽やかで軽やかに楽しめるのがいいですね。",
          "romaji": "Shiro wain ga suki desu. Sawayaka de karoyaka ni tanoshimeru no ga ii desu ne.",
          "english": "White, especially something crisp and refreshing.",
          "points": 10,
          "video": "https://i.imgur.com/XTSjUmz.mp4",
          "response": {
            "japanese": "爽やかで軽やかな味わい…あなたはリラックスしながらも洗練されたものを好むタイプね。",
            "romaji": "Sawayaka de karoyaka na ajiwai… anata wa rirakkusu shinagara mo senren sareta mono o konomu taipu ne.",
            "english": "Crisp and refreshing… that tells me you like something easygoing, yet refined.",
            "context": "Raises an eyebrow playfully.",
            "video": "https://i.imgur.com/qXTsyfY.mp4"
          }
        },
        {
          "id": "JP203",
          "japanese": "いろいろ試すのが好きです。ソムリエのおすすめを聞いてみましょう。",
          "romaji": "Iroiro tamesu no ga suki desu. Somurie no osusume o kiite mimashou.",
          "english": "I like to mix it up. Let’s see what the sommelier recommends.",
          "points": 11,
          "video": "https://i.imgur.com/JjB5L3O.mp4",
          "response": {
            "japanese": "新しい体験を求めるタイプね。いいわ、じゃあソムリエにお任せしましょうか？",
            "romaji": "Atarashii taiken o motomeru taipu ne. Ii wa, jā, somurie ni omakase shimashou ka?",
            "english": "A man who enjoys the thrill of the unknown—I like it. Shall we trust the expert, then?",
            "context": "Smirks, intrigued.",
            "video": "https://i.imgur.com/c7TEtOk.mp4"
          }
        }
      ],
      "transition": "The sommelier nods in approval, disappearing briefly before returning with a well-presented bottle. With practiced precision, they pour a taste into a crystal glass, waiting for approval."
    },
    "3": {
      "initial": {
        "japanese": "さて、今夜の本当の主役は料理よ。ワインだけじゃなく、食のセンスもあるかしら？",
        "romaji": "Sate, kon'ya no hontō no shuyaku wa ryōri yo. Wain dake janaku, shoku no sensu mo aru kashira?",
        "english": "Now, for the real star of the night—the food. I hope you have good taste beyond just wine.",
        "context": "Glances at the menu, running her fingers along the edge of the page.",
        "video": "https://i.imgur.com/ERK5vCj.mp4"
      },
      "options": [
        {
          "id": "JP301",
          "japanese": "いつもシェフのおすすめを選ぶよ。絶対に間違いないからね。",
          "romaji": "Itsumo shefu no osusume o erabu yo. Zettai ni machigai nai kara ne.",
          "english": "I always go for the chef’s special—it never disappoints.",
          "points": 12,
          "video": "https://i.imgur.com/ERK5vCj.mp4",
          "response": {
            "japanese": "シェフを信頼するタイプなのね。いいわ、そのワクワク感、私も好きよ。",
            "romaji": "Shefu o shinrai suru taipu na no ne. Ii wa, sono wakuwaku kan, watashi mo suki yo.",
            "english": "A man who trusts the chef—I like that. There’s something exciting about not knowing exactly what you’re getting.",
            "context": "Raises an intrigued eyebrow.",
            "video": "https://i.imgur.com/f3leqLR.mp4"
          }
        },
        {
          "id": "JP302",
          "japanese": "よく焼かれたステーキが好きだよ。クラシックで風味豊か、いつ食べても満足できるからね。",
          "romaji": "Yoku yakareta sutēki ga suki da yo. Kurashikku de fūmi yutaka, itsu tabetemo manzoku dekiru kara ne.",
          "english": "I prefer a well-cooked steak. Classic, rich, and always satisfying.",
          "points": 11,
          "video": "https://i.imgur.com/eBwbet0.mp4",
          "response": {
            "japanese": "お、ステーキ派なのね？じゃあ、当ててみせるわ。ミディアムレア、でしょ？",
            "romaji": "O, sutēki-ha na no ne? Jā, atete miseru wa. Midiamu rea, desho?",
            "english": "A steak man? Let me guess—you like it medium rare, with just the right amount of sear.",
            "context": "Smirks, leaning slightly forward.",
            "video": "https://i.imgur.com/gfWqcNU.mp4"
          }
        },
        {
          "id": "JP303",
          "japanese": "君に任せるよ。驚かせてくれる？",
          "romaji": "Kimi ni makaseru yo. Odorokasete kureru?",
          "english": "I’ll let you decide—surprise me.",
          "points": 10,
          "video": "https://i.imgur.com/g7mJQUo.mp4",
          "response": {
            "japanese": "私に選ばせるの？面白いわね。",
            "romaji": "Watashi ni erabaseru no? Omoshiroi wa ne.",
            "english": "A man who trusts a woman’s choice? That’s refreshing.",
            "context": "Tilts her head, intrigued.",
            "video": "https://i.imgur.com/ey0dZb1.mp4"
          }
        }
      ],
      "transition": "As your orders are taken, soft instrumental music plays in the background. The candlelight flickers, casting a warm glow over the table."
    },
    "4": {
      "initial": {
        "japanese": "さて、注文も済んだことだし、少し深い話をしましょうか？ 見た目だけじゃわからない、意外な一面があるんじゃない？",
        "romaji": "Sate, chūmon mo sunda koto dashi, sukoshi fukai hanashi o shimashou ka? Mitame dake ja wakaranai, igai na ichimen ga aru n janai?",
        "english": "Now tell me—what’s something about you I wouldn’t guess just by looking at you?",
        "context": "Resting her chin on her hand, she studies you with amused curiosity.",
        "video": "https://i.imgur.com/HrwmQmG.mp4"
      },
      "options": [
        {
          "id": "JP401",
          "japanese": "実は、3カ国語を話せるんだ。新しい言語を学ぶのが好きでね。",
          "romaji": "Jitsu wa, sankakokugo o hanaseru nda. Atarashii gengo o manabu no ga suki de ne.",
          "english": "I speak three languages. Always loved the challenge of mastering new ones.",
          "points": 12,
          "video": "https://i.imgur.com/GiWm3Zw.mp4",
          "response": {
            "japanese": "すごいじゃない！じゃあ今夜は、違う言語で甘いセリフを言ってもらえるのかしら？",
            "romaji": "Sugoi janai! Jā kon'ya wa, chigau gengo de amai serifu o itte moraeru no kashira?",
            "english": "Impressive. So, should I be expecting some smooth talk in another language tonight?",
            "context": "Raises an eyebrow, intrigued.",
            "video": "https://i.imgur.com/YSsL7UP.mp4"
          }
        },
        {
          "id": "JP402",
          "japanese": "数ヶ月間、一人旅をしたことがある。人生で最高の決断だったよ。",
          "romaji": "Sūkagetsukan, hitoritabi o shita koto ga aru. Jinsei de saikō no ketsudan datta yo.",
          "english": "I once traveled solo for months—best decision I ever made.",
          "points": 11,
          "video": "https://i.imgur.com/fEDLvJN.mp4",
          "response": {
            "japanese": "一人旅？すごいわね。最も忘れられない瞬間は何だった？",
            "romaji": "Hitoritabi? Sugoi wa ne. Mottomo wasurerarenai shunkan wa nan datta?",
            "english": "A solo traveler? That’s impressive. What was the most unforgettable part?",
            "context": "Eyes light up with curiosity.",
            "video": "https://i.imgur.com/QHYB2Xc.mp4"
          }
        },
        {
          "id": "JP403",
          "japanese": "人を笑わせるのが得意なんだ。試してみようか？",
          "romaji": "Hito o warawaseru no ga tokui nan da. Tameshite miyou ka?",
          "english": "I have a talent for making people laugh. I’ll prove it if you want.",
          "points": 10,
          "video": "https://i.imgur.com/sdRQtci.mp4",
          "response": {
            "japanese": "お、コメディアンなの？いいわね。じゃあ、一番面白いネタを披露してくれる？",
            "romaji": "O, komedian na no? Ii wa ne. Jā, ichiban omoshiroi neta o hirō shite kureru?",
            "english": "A comedian, huh? Alright, impress me—what’s your best line?",
            "context": "Smirks, tilting her head slightly.",
            "video": "https://i.imgur.com/i858GNc.mp4"
          }
        }
      ],
      "transition": "The plates are cleared, and the soft hum of conversation in the restaurant blends with the low notes of a live pianist."
    },
    "5": {
      "initial": {
        "japanese": "さて、今夜はここで終わりにしますか？ それとも、まだ続きがある？",
        "romaji": "Sate, kon'ya wa koko de owari ni shimasu ka? Soretomo, mada tsuzuki ga aru?",
        "english": "So, what’s next? Are you the type to let a great night end here… or do you have something in mind?",
        "context": "Her voice lowers slightly, warm and inviting.",
        "video": "https://i.imgur.com/Kh9EdUK.mp4"
      },
      "options": [
        {
          "id": "JP501",
          "japanese": "この夜をもっと楽しみたい。お気に入りの場所でもう一杯どう？",
          "romaji": "Kono yoru o motto tanoshimitai. Oki ni iri no basho de mō ippai dō?",
          "english": "I’d love to continue this night over a nightcap at my favorite place.",
          "points": 15,
          "video": "https://i.imgur.com/Kh9EdUK.mp4",
          "response": {
            "japanese": "大胆な提案ね。いいわ…そのお気に入りの場所ってどこ？",
            "romaji": "Daitan na teian ne. Ii wa… sono oki ni iri no basho tte doko?",
            "english": "A bold proposal. Alright… where’s this mysterious favorite place of yours?",
            "context": "Raises an intrigued eyebrow, smirking slightly.",
            "video": "https://i.imgur.com/hxjyvbQ.mp4"
          }
        },
        {
          "id": "JP502",
          "japanese": "別の日にまた会うのはどう？ ぜひまた会いたいな。",
          "romaji": "Betsu no hi ni mata au no wa dō? Zehi mata aitai na.",
          "english": "Let’s plan something for another evening. I’d love to see you again.",
          "points": 12,
          "video": "https://i.imgur.com/zhJziX5.mp4",
          "response": {
            "japanese": "期待感を持たせる男性ね…いいわ。どんな計画を考えてるの？",
            "romaji": "Kitaikan o motaseru dansei ne… ii wa. Donna keikaku o kangaeteru no?",
            "english": "A gentleman who knows how to build anticipation—I like that. What kind of evening do you have in mind?",
            "context": "Tilts her head slightly, studying you.",
            "video": "https://i.imgur.com/HeOqpo5.mp4"
          }
        },
        {
          "id": "JP503",
          "japanese": "楽しい時間だったね。またどこかで会えるかもね。",
          "romaji": "Tanoshii jikan datta ne. Mata doko ka de aeru kamo ne.",
          "english": "This was great. Maybe we’ll cross paths again sometime.",
          "points": 8,
          "video": "https://i.imgur.com/ZxNeKqo.mp4",
          "response": {
            "japanese": "あまりに確信なさそうね。",
            "romaji": "Amari ni kakushin nasa-sō ne.",
            "english": "Maybe? That’s not very convincing.",
            "context": "Sips the last of her wine, observing you with mild amusement.",
            "video": "https://i.imgur.com/jLyu3hT.mp4"
          }
        }
      ],
      "transition": "The evening draws to a close. The waiter discreetly places the check on the table, and the flickering candlelight casts soft shadows across her face."
    }
  }
},
aya: {
  id: 'aya',
  name: 'Aya',
  japaneseName: '佐藤彩',
  description: 'Modern Fashion Designer',
  image: '/tutors/networking_japanese.jpg',
  language: 'japanese',
  scenes: {
    1: {
      initial: {
        japanese: 'こんにちは！今日は何を学びたいですか？',
        romaji: 'Konnichiwa! Kyou wa nani wo manabi tai desu ka?',
        english: 'Hello! What would you like to learn today?',
        context: 'Aya welcomes you in her stylish design studio.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
},
misa: {
  id: 'misa',
  name: 'Misa',
  japaneseName: '田中美咲',
  description: 'Pop Culture Enthusiast',
  image: '/tutors/bar_jap.jpg',
  language: 'japanese',
  scenes: {
    1: {
      initial: {
        japanese: 'やっほー！一緒に楽しく日本語を勉強しましょう！',
        romaji: 'Yahoo! Issho ni tanoshiku nihongo wo benkyou shimashou!',
        english: "Hi there! Let's study Japanese together in a fun way!",
        context: 'Misa energetically greets you in a casual café setting.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
},

// Korean Characters
ji: {
  "id": "ji",
  "name": "Ji",
  "koreanName": "김지원",
  "description": "Corporate Executive",
  "image": "/tutors/dining_korean.jpg",
  "language": "korean",
  "scenes": {
    "1": {
      "initial": {
        "korean": "안녕하세요! 오늘 수업 준비되셨나요?",
        "romanized": "Annyeonghaseyo! Oneul sueop junbidoesyeonayo?",
        "english": "Hello! Are you ready for today's lesson?",
        "context": "Ji greets you in her executive office.",
        "video": "https://i.imgur.com/Jh7fLXI.mp4"
      },
      "options": [
        {
          "id": "KR101",
          "korean": "딱 맞춰 왔네. 여기 분위기를 감상하고 있었는데—센스가 좋군요.",
          "romanized": "Ttak matchwo watne. Yeogi bunwigireul gamsanghago isseonneunde—sense-ga jokunyo.",
          "english": "Perfect timing. I was just admiring the ambiance—seems like you have good taste.",
          "points": 12,
          "video": "https://i.imgur.com/Jh7fLXI.mp4",
          "response": {
            "korean": "미리 준비하는 남자라니—맘에 드네요. 자신감 넘쳐 보여요.",
            "romanized": "Miri junbihaneun namjarani—mame deuneyo. Jasingam neomchyeo boyeoyo.",
            "english": "A man who plans ahead—I like that. It shows confidence.",
            "context": "Smiles approvingly, adjusting her napkin.",
            "video": "https://i.imgur.com/jyLstKw.mp4"
          }
        },
        {
          "id": "KR102",
          "korean": "이 분위기에 어울리는 음식이 나오길 바라야겠네요.",
          "romanized": "I bunwigie eoulrineun eumsigi naogil baraya getneyo.",
          "english": "I hope the food lives up to the atmosphere.",
          "points": 9,
          "video": "https://i.imgur.com/bkiH1BI.mp4",
          "response": {
            "korean": "나도 그렇게 생각해요. 하지만 완벽한 저녁은 음식만으로는 부족하죠.",
            "romanized": "Nado geureohge saenggakhaeyo. Hajiman wanbyeokhan jeonyeok-eun eumsigman-euro-neun bujokhajyo.",
            "english": "I have a feeling it will. But a perfect dinner is more than just the food.",
            "context": "Glances at the menu, intrigued.",
            "video": "https://i.imgur.com/M8Qyoa5.mp4"
          }
        },
        {
          "id": "KR103",
          "korean": "솔직히? 그냥 리뷰 보고 따라왔어요.",
          "romanized": "Soljjikhi? Geunyang ribyu bogo ttarawatseoyo.",
          "english": "Honestly? I just followed the best reviews online.",
          "points": 6,
          "video": "https://i.imgur.com/VFpe6ap.mp4",
          "response": {
            "korean": "실용적인 선택이네요. 그런데 원래 리뷰를 믿는 편이에요, 아니면 직접 새로운 곳을 찾아보는 걸 좋아해요?",
            "romanized": "Siryongjeog-in seontaeg-inneyo. Geureonde wonrae ribyu-reul midneun pyeon-ieyo, animyeon jikjeop saeroun gos-eul chaj-aboneun geol joh-ahaeyo?",
            "english": "Practical. So, do you always trust reviews, or do you like discovering places yourself?",
            "context": "Raises an eyebrow, smirking.",
            "video": "https://i.imgur.com/jyLstKw.mp4"
          }
        }
      ],
      "transition": "The waiter approaches with elegantly designed menus. A soft glow from the candlelight reflects off the glassware."
    },
    "2": {
      "initial": {
        "korean": "우리 먼저 와인부터 고를까요? 보통 레드 와인, 화이트 와인, 아니면 좀 더 특별한 걸 좋아하세요?",
        "romanized": "Uri meonjeo wainbuteo goreulkkayo? Botong redeu wain, hwaiteu wain, animyeon jom deo teukbyeolhan geol joahaseyo?",
        "english": "Let’s start with a drink. Do you usually go for red, white, or something a little more exciting?",
        "context": "Flicks her eyes toward the wine list, then back at you.",
        "video": "https://i.imgur.com/mjbLdXv.mp4"
      },
      "options": [
        {
          "id": "KR201",
          "korean": "레드 와인이죠, 당연히. 빈티지 와인은 언제나 클래식하고 강렬한 매력이 있어요.",
          "romanized": "Redeu wainijyo, dangyeonhi. Bintiji wain-eun eonjena keullaesikhago gangnyeolhan maeryeok-i isseoyo.",
          "english": "Red, always. There’s something bold and timeless about a great vintage.",
          "points": 12,
          "video": "https://i.imgur.com/mjbLdXv.mp4",
          "response": {
            "korean": "깊이 있는 와인을 즐길 줄 아는 남자라니, 마음에 드네요. 특별히 선호하는 지역이 있나요?",
            "romanized": "Gipi inneun wain-eul jeulgil jul aneun namjarani, ma-eum-e deuneyo. Teukbyeolhi seonhohaneun jiyeog-i innayo?",
            "english": "A man who appreciates depth and character—I respect that. Any favorite regions?",
            "context": "Nods approvingly, twirling the stem of her glass.",
            "video": "https://i.imgur.com/vjIN2cB.mp4"
          }
        },
        {
          "id": "KR202",
          "korean": "화이트 와인이요. 상쾌하고 가볍게 마시기에 딱 좋아요.",
          "romanized": "Hwaiteu wain-iyo. Sangkwaehago gabyeopge masigie ttak joayo.",
          "english": "White, especially something crisp and refreshing.",
          "points": 10,
          "video": "https://i.imgur.com/Kc00oWn.mp4",
          "response": {
            "korean": "상쾌하고 가벼운 걸 좋아하시네요. 편안하면서도 세련된 취향이군요.",
            "romanized": "Sangkwaehago gabyeoun geol joahasinayo. Pyeonanhamyeonseodo seryeon-doen chwihyang-igunyo.",
            "english": "Crisp and refreshing… that tells me you like something easygoing, yet refined.",
            "context": "Raises an eyebrow playfully.",
            "video": "https://i.imgur.com/UIEh58P.mp4"
          }
        },
        {
          "id": "KR203",
          "korean": "저는 새로운 걸 시도하는 걸 좋아해요. 소믈리에 추천을 들어볼까요?",
          "romanized": "Jeoneun saeroun geol sidohaneun geol joahaeyo. Someullie chucheoneul deureobolkayo?",
          "english": "I like to mix it up. Let’s see what the sommelier recommends.",
          "points": 11,
          "video": "https://i.imgur.com/6yEMbMh.mp4",
          "response": {
            "korean": "새로운 걸 시도하는 스타일이군요. 마음에 들어요. 그럼 전문가에게 맡겨볼까요?",
            "romanized": "Saeroun geol sidohaneun seutail-igunyo. Ma-eum-e deureoyo. Geureom jeonmunga-egae matgyeobolkayo?",
            "english": "A man who enjoys the thrill of the unknown—I like it. Shall we trust the expert, then?",
            "context": "Smirks, intrigued.",
            "video": "https://i.imgur.com/oCf4unG.mp4"
          }
        }
      ],
      "transition": "The sommelier nods in approval, disappearing briefly before returning with a well-presented bottle."
    },
    "3": {
      "initial": {
        "korean": "이제 오늘 밤의 진짜 주인공, 음식이 나올 차례야. 와인뿐만 아니라 음식 취향도 괜찮길 바라.",
        "romanized": "Ije oneul bamui jinjja juingong, eumsigi naol charéya. Wainppunman anira eumsik chwihyangdo gwaenchanggil bara.",
        "english": "Now, for the real star of the night—the food. I hope you have good taste beyond just wine.",
        "context": "Glances at the menu, running her fingers along the edge of the page.",
        "video": "https://i.imgur.com/UJ6sb4Y.mp4"
      },
      "options": [
        {
          "id": "KR301",
          "korean": "나는 항상 셰프 추천 요리를 선택해. 실망한 적이 없거든.",
          "romanized": "Naneun hangsang syepeu chuchun yorireul seontaekhae. Silmanghan jeogi eopgeodeun.",
          "english": "I always go for the chef’s special—it never disappoints.",
          "points": 12,
          "video": "https://i.imgur.com/UJ6sb4Y.mp4",
          "response": {
            "korean": "셰프를 믿는 사람이네. 좋아. 뭘 받을지 모르는 그 설렘, 나도 좋아해.",
            "romanized": "Syepeureul mitneun saramine. Joa. Mwol badeulji moreuneun geu seollem, nado joahaeyo.",
            "english": "A man who trusts the chef—I like that. There’s something exciting about not knowing exactly what you’re getting.",
            "context": "Raises an intrigued eyebrow.",
            "video": "https://i.imgur.com/fCuhLSL.mp4"
          }
        },
        {
          "id": "KR302",
          "korean": "나는 제대로 구운 스테이크가 좋아. 클래식하고 진한 풍미가 항상 만족스럽지.",
          "romanized": "Naneun jedaero guun seuteikeuga joa. Keullaesikhago jinhan pungmiga hangsang manjoksseureopji.",
          "english": "I prefer a well-cooked steak. Classic, rich, and always satisfying.",
          "points": 11,
          "video": "https://i.imgur.com/0Ned9Ix.mp4",
          "response": {
            "korean": "오~ 스테이크를 좋아하는구나? 내가 맞춰볼게. 미디엄 레어, 맞지?",
            "romanized": "O~ seuteikeureul joahaneunguna? Naega matchweobolge. Midieom reo, majji?",
            "english": "A steak man? Let me guess—you like it medium rare, with just the right amount of sear.",
            "context": "Smirks, leaning slightly forward.",
            "video": "https://i.imgur.com/ncJYHmD.mp4"
          }
        },
        {
          "id": "KR303",
          "korean": "네가 골라줘. 나를 놀라게 해봐.",
          "romanized": "Nega gollajwo. Nareul nollage haebwa.",
          "english": "I’ll let you decide—surprise me.",
          "points": 10,
          "video": "https://i.imgur.com/Yeq70D1.mp4",
          "response": {
            "korean": "내가 선택해도 괜찮겠어? 재미있네, 좋아.",
            "romanized": "Naega seontaekhaedo gwaenchanhkesseo? Jaemiissne, joa.",
            "english": "A man who trusts a woman’s choice? That’s refreshing.",
            "context": "Tilts her head, intrigued.",
            "video": "https://i.imgur.com/ey0dZb1.mp4"
          }
        }
      ],
      "transition": "As your orders are taken, soft instrumental music plays in the background. The candlelight flickers, casting a warm glow over the table."
    },
    "4": {
      "initial": {
        "korean": "이제 주문도 끝났고, 나랑 좀 더 깊은 얘기를 해볼까? 겉모습만 보고는 절대 알 수 없는 네 이야기, 하나만 들려줘.",
        "romanized": "Ije jumundo kkeutnassgo, narang jom deo gipeun yaegireul haebolkka? Geotmoseubman bogo neun jeoldae al su eomneun ne iyagi, hanaman deullyeojwo.",
        "english": "Now tell me—what’s something about you I wouldn’t guess just by looking at you?",
        "context": "Resting her chin on her hand, she studies you with amused curiosity.",
        "video": "https://i.imgur.com/HrwmQmG.mp4"
      },
      "options": [
        {
          "id": "KR401",
          "korean": "저는 세 개의 언어를 할 줄 알아요. 새로운 언어를 배우는 도전이 항상 즐거웠어요.",
          "romanized": "Jeoneun se gaeui eoneoreul hal jul arayo. Saeroun eoneoreul baeuneun dojeoni hangsang jeulgeowosseoyo.",
          "english": "I speak three languages. Always loved the challenge of mastering new ones.",
          "points": 12,
          "video": "https://i.imgur.com/HrwmQmG.mp4",
          "response": {
            "korean": "와, 대단한데요? 그럼 오늘 밤에는 다른 언어로 멋진 멘트를 들을 수 있을까요?",
            "romanized": "Wa, daedanhandaeyo? Geureom oneul bame-neun dareun eoneoro meotjin menteureul deureul su isseulkka-yo?",
            "english": "Impressive. So, should I be expecting some smooth talk in another language tonight?",
            "context": "Raises an eyebrow, intrigued.",
            "video": "https://i.imgur.com/YSsL7UP.mp4"
          }
        },
        {
          "id": "KR402",
          "korean": "저는 혼자 여행을 몇 달 동안 다녀온 적 있어요. 제 인생에서 최고의 결정이었죠.",
          "romanized": "Jeoneun honja yeohaengeul myeot dal dongan danyeoon jeok isseoyo. Je insaengeseo choegoui gyeoljeongieossjyo.",
          "english": "I once traveled solo for months—best decision I ever made.",
          "points": 11,
          "video": "https://i.imgur.com/itd2phO.mp4",
          "response": {
            "korean": "혼자 여행이라니! 멋지네요! 가장 기억에 남는 순간은 언제였어요?",
            "romanized": "Honja yeohaengirani! Meotjineyo! Gajang gieoge namneun sungan-eun eonjeyeosseoyo?",
            "english": "A solo traveler? That’s impressive. What was the most unforgettable part?",
            "context": "Eyes light up with curiosity.",
            "video": "https://i.imgur.com/QHYB2Xc.mp4"
          }
        },
        {
          "id": "KR403",
          "korean": "사람들을 웃기는 재주가 있어요. 원한다면 지금 증명해 볼까요?",
          "romanized": "Saramdeureul utgineun jaejuga isseoyo. Wonhandamyeon jigeum jeungmyeonghae bolkkayo?",
          "english": "I have a talent for making people laugh. I’ll prove it if you want.",
          "points": 10,
          "video": "https://i.imgur.com/KAHAzpJ.mp4",
          "response": {
            "korean": "오~ 기대되는데요? 한번 보여줄래요?",
            "romanized": "O~ gidaedoeneyo? Hanbeon boyeojullae-yo?",
            "english": "A comedian, huh? Alright, impress me—what’s your best line?",
            "context": "Smirks, tilting her head slightly.",
            "video": "https://i.imgur.com/i858GNc.mp4"
          }
        }
      ],
      "transition": "The plates are cleared, and the soft hum of conversation in the restaurant blends with the low notes of a live pianist."
    },
    "5": {
      "initial": {
        "korean": "자, 이제 어떻게 할 건가요? 그냥 이렇게 끝낼 건가요… 아니면 좀 더 특별한 계획이 있나요?",
        "romanized": "Ja, ije eotteoke hal geongayo? Geunyang ireoke kkeutnal geongayo… animyeon jom deo teukbyeolhan gyehoegi innayo?",
        "english": "So, what’s next? Are you the type to let a great night end here… or do you have something in mind?",
        "context": "Her voice lowers slightly, warm and inviting.",
        "video": "https://i.imgur.com/Kh9EdUK.mp4"
      },
      "options": [
        {
          "id": "KR501",
          "korean": "이 밤을 더 즐기고 싶어요. 제가 아끼는 곳에서 한 잔 더 어때요?",
          "romanized": "I bam-eul deo jeulgigo sip-eoyo. Jega akkineun gos-eseo han jan deo eottaeyo?",
          "english": "I’d love to continue this night over a nightcap at my favorite place.",
          "points": 15,
          "video": "https://i.imgur.com/Kh9EdUK.mp4",
          "response": {
            "korean": "과감한 제안이네요. 좋아요… 그 비밀스러운 장소가 어디죠?",
            "romanized": "Gwagamhan jean-ine-yo. Joayo… geu bimilsleunhan jangso-ga eodijyo?",
            "english": "A bold proposal. Alright… where’s this mysterious favorite place of yours?",
            "context": "Raises an intrigued eyebrow, smirking slightly.",
            "video": "https://i.imgur.com/hxjyvbQ.mp4"
          }
        },
        {
          "id": "KR502",
          "korean": "다른 날 다시 만나는 건 어때요? 꼭 다시 보고 싶어요.",
          "romanized": "Daleun nal dasi mannaneun geon eottaeyo? Kkog dasi bogo sip-eoyo.",
          "english": "Let’s plan something for another evening. I’d love to see you again.",
          "points": 12,
          "video": "https://i.imgur.com/zhJziX5.mp4",
          "response": {
            "korean": "기대감을 주는 남자네요… 좋아요. 어떤 계획을 생각하고 있나요?",
            "romanized": "Gidaegam-eul juneun namjanye-yo… joayo. Eotteon gyehoeg-eul saenggakhago innayo?",
            "english": "A gentleman who knows how to build anticipation—I like that. What kind of evening do you have in mind?",
            "context": "Tilts her head slightly, studying you.",
            "video": "https://i.imgur.com/HeOqpo5.mp4"
          }
        },
        {
          "id": "KR503",
          "korean": "정말 즐거웠어요. 언젠가 다시 마주칠 수도 있겠죠.",
          "romanized": "Jeongmal jeulgeowoss-eoyo. Eonjenga dasi majuchil sudo itketjyo.",
          "english": "This was great. Maybe we’ll cross paths again sometime.",
          "points": 8,
          "video": "https://i.imgur.com/ZxNeKqo.mp4",
          "response": {
            "korean": "아마도? 그건 별로 설득력이 없네요.",
            "romanized": "Amado? Geugeon byeollo seoldeungryeog-i eomne-yo.",
            "english": "Maybe? That’s not very convincing.",
            "context": "Sips the last of her wine, observing you with mild amusement.",
            "video": "https://i.imgur.com/jLyu3hT.mp4"
          }
        }
      ],
      "transition": "The evening draws to a close. The waiter discreetly places the check on the table, and the flickering candlelight casts soft shadows across her face."
    }
  }
},
min: {
  id: 'min',
  name: 'Min',
  koreanName: '박민지',
  description: 'K-pop Dance Instructor',
  image: '/tutors/networking_korean.jpg',
  language: 'korean',
  scenes: {
    1: {
      initial: {
        korean: '어서 오세요! 즐거운 수업 시작해볼까요?',
        romanized: 'Eoseo oseyo! Jeulgeoun sueop sijakhaebolkkayo?',
        english: 'Welcome! Shall we start our fun lesson?',
        context: 'Min welcomes you in a modern dance studio.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
},
sua: {
  id: 'sua',
  name: 'Sua',
  koreanName: '이수아',
  description: 'Traditional Artist',
  image: '/tutors/bar_korean.jpg',
  language: 'korean',
  scenes: {
    1: {
      initial: {
        korean: '환영합니다! 한국 문화를 함께 알아볼까요?',
        romanized: 'Hwanyeonghamnida! Hanguk munhwareul hamkke arabolkkayo?',
        english: 'Welcome! Shall we explore Korean culture together?',
        context: 'Sua greets you in a traditional Korean art studio.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
},

// Spanish Characters
isabella: {
  "id": "isabella",
  "name": "Isabella",
  "spanishName": "Isabella Martínez",
  "description": "Professional Chef",
  "image": "/tutors/dining_spanish.jpg",
  "language": "spanish",
  "scenes": {
    "1": {
      "initial": {
        "spanish": "¡Bienvenido a mi cocina! ¿Listo para aprender español mientras cocinamos?",
        "english": "Welcome to my kitchen! Ready to learn Spanish while we cook?",
        "context": "Isabella welcomes you in her professional kitchen.",
        "video": "https://i.imgur.com/3YtPKdz.mp4"
      },
      "options": [
        {
          "id": "SP101",
          "spanish": "Me tomé la libertad de hacer una reservación. Solo lo mejor para esta noche.",
          "english": "I took the liberty of making a reservation. Only the best for tonight.",
          "points": 12,
          "video": "https://i.imgur.com/3YtPKdz.mp4",
          "response": {
            "spanish": "Un hombre que planea con anticipación… Me gusta. Eso demuestra confianza.",
            "english": "A man who plans ahead—I like that. It shows confidence.",
            "context": "Smiles approvingly, adjusting her napkin.",
            "video": "https://i.imgur.com/o2v1DKA.mp4"
          }
        },
        {
          "id": "SP102",
          "spanish": "Espero que la comida esté a la altura del ambiente.",
          "english": "I hope the food lives up to the atmosphere.",
          "points": 9,
          "video": "https://i.imgur.com/AVQtVzO.mp4",
          "response": {
            "spanish": "Tengo el presentimiento de que sí. Pero una cena perfecta es mucho más que la comida.",
            "english": "I have a feeling it will. But a perfect dinner is more than just the food.",
            "context": "Glances at the menu, intrigued.",
            "video": "https://i.imgur.com/YWRGaj8.mp4"
          }
        },
        {
          "id": "SP103",
          "spanish": "¿Honestamente? Solo seguí las mejores reseñas en línea.",
          "english": "Honestly? I just followed the best reviews online.",
          "points": 6,
          "video": "https://i.imgur.com/iW4h1nY.mp4",
          "response": {
            "spanish": "Práctico. Entonces, ¿siempre confías en las reseñas o prefieres descubrir lugares por ti mismo?",
            "english": "Practical. So, do you always trust reviews, or do you like discovering places yourself?",
            "context": "Raises an eyebrow, smirking.",
            "video": "https://i.imgur.com/z6z7Dqs.mp4"
          }
        }
      ],
      "transition": "The waiter approaches with elegantly designed menus. A soft glow from the candlelight reflects off the glassware."
    },
    "2": {
      "initial": {
        "spanish": "Empecemos con una bebida. ¿Sueles preferir vino tinto, blanco o algo un poco más emocionante?",
        "english": "Let’s start with a drink. Do you usually go for red, white, or something a little more exciting?",
        "context": "Flicks her eyes toward the wine list, then back at you.",
        "video": "https://placeholder.com/video"
      },
      "options": [
        {
          "id": "SP201",
          "spanish": "Vino tinto, siempre. Hay algo audaz y atemporal en una gran cosecha.",
          "english": "Red, always. There’s something bold and timeless about a great vintage.",
          "points": 12,
          "video": "https://i.imgur.com/TBHSIsp.mp4",
          "response": {
            "spanish": "Un hombre que aprecia la profundidad y el carácter... Me gusta. ¿Tienes alguna región favorita?",
            "english": "A man who appreciates depth and character—I respect that. Any favorite regions?",
            "context": "Nods approvingly, twirling the stem of her glass.",
            "video": "https://i.imgur.com/RmljAl8.mp4"
          }
        },
        {
          "id": "SP202",
          "spanish": "Vino blanco, especialmente algo fresco y ligero.",
          "english": "White, especially something crisp and refreshing.",
          "points": 10,
          "video": "https://i.imgur.com/SkjTuaH.mp4",
          "response": {
            "spanish": "Fresco y ligero... Eso me dice que te gustan las cosas relajadas pero con estilo.",
            "english": "Crisp and refreshing… that tells me you like something easygoing, yet refined.",
            "context": "Raises an eyebrow playfully.",
            "video": "https://i.imgur.com/SyLZYey.mp4"
          }
        },
        {
          "id": "SP203",
          "spanish": "Me gusta variar. Veamos qué recomienda el sommelier.",
          "english": "I like to mix it up. Let’s see what the sommelier recommends.",
          "points": 11,
          "video": "https://i.imgur.com/UFFJckG.mp4",
          "response": {
            "spanish": "Un hombre que disfruta la emoción de lo desconocido... Me gusta. ¿Confiamos en el experto, entonces?",
            "english": "A man who enjoys the thrill of the unknown—I like it. Shall we trust the expert, then?",
            "context": "Smirks, intrigued.",
            "video": "https://i.imgur.com/yrH4e9y.mp4"
          }
        }
      ],
      "transition": "The sommelier nods in approval, disappearing briefly before returning with a well-presented bottle. With practiced precision, they pour a taste into a crystal glass, waiting for approval."
    },
    "3": {
      "initial": {
        "spanish": "Ahora, el verdadero protagonista de la noche: la comida. Espero que tengas buen gusto más allá del vino.",
        "english": "Now, for the real star of the night—the food. I hope you have good taste beyond just wine.",
        "context": "Glances at the menu, running her fingers along the edge of the page.",
        "video": "https://placeholder.com/video"
      },
      "options": [
        {
          "id": "SP301",
          "spanish": "Siempre elijo la recomendación del chef—nunca me ha fallado.",
          "english": "I always go for the chef’s special—it never disappoints.",
          "points": 12,
          "video": "https://i.imgur.com/52AZqeQ.mp4",
          "response": {
            "spanish": "Así que confías en el chef. Me gusta eso. Hay algo emocionante en no saber exactamente qué vas a recibir.",
            "english": "A man who trusts the chef—I like that. There’s something exciting about not knowing exactly what you’re getting.",
            "context": "Raises an intrigued eyebrow.",
            "video": "https://i.imgur.com/TXmDfHK.mp4"
          }
        },
        {
          "id": "SP302",
          "spanish": "Prefiero un buen filete bien cocinado. Clásico, intenso y siempre satisfactorio.",
          "english": "I prefer a well-cooked steak. Classic, rich, and always satisfying.",
          "points": 11,
          "video": "https://i.imgur.com/AJcMcqy.mp4",
          "response": {
            "spanish": "¿Eres de los que prefieren un buen filete? Déjame adivinar… ¿término medio?",
            "english": "A steak man? Let me guess—medium rare, right?",
            "context": "Smirks, leaning slightly forward.",
            "video": "https://i.imgur.com/gXMQdHk.mp4"
          }
        },
        {
          "id": "SP303",
          "spanish": "Te dejaré elegir—sorpréndeme.",
          "english": "I’ll let you decide—surprise me.",
          "points": 10,
          "video": "https://i.imgur.com/6TuZcBz.mp4",
          "response": {
            "spanish": "¿Me dejas elegir? Eso es interesante.",
            "english": "A man who trusts a woman’s choice? That’s refreshing.",
            "context": "Tilts her head, intrigued.",
            "video": "https://i.imgur.com/9oN4IL7.mp4"
          }
        }
      ],
      "transition": "As your orders are taken, soft instrumental music plays in the background. The candlelight flickers, casting a warm glow over the table."
    },
    "4": {
      "initial": {
        "spanish": "Bueno, la cena ya está resuelta. Ahora dime, ¿qué es algo sobre ti que no adivinaría solo con mirarte?",
        "english": "Alright, dinner’s taken care of. Now tell me—what’s something about you I wouldn’t guess just by looking at you?",
        "context": "Resting her chin on her hand, she studies you with amused curiosity.",
        "video": "https://placeholder.com/video"
      },
      "options": [
        {
          "id": "SP401",
          "spanish": "Hablo tres idiomas. Siempre me ha encantado el desafío de aprender nuevos.",
          "english": "I speak three languages. Always loved the challenge of mastering new ones.",
          "points": 12,
          "video": "https://i.imgur.com/bVtbDkp.mp4",
          "response": {
            "spanish": "Impresionante. ¿Debería esperar que me hables en otro idioma esta noche?",
            "english": "Impressive. So, should I be expecting some smooth talk in another language tonight?",
            "context": "Raises an intrigued eyebrow.",
            "video": "https://i.imgur.com/GPMr2o7.mp4"
          }
        },
        {
          "id": "SP402",
          "spanish": "Una vez viajé solo por varios meses. Fue la mejor decisión de mi vida.",
          "english": "I once traveled solo for months—best decision I ever made.",
          "points": 11,
          "video": "https://i.imgur.com/7XapBAT.mp4",
          "response": {
            "spanish": "¿Un viaje en solitario? Qué valiente. ¿Cuál fue la parte más inolvidable?",
            "english": "A solo traveler? That’s impressive. What was the most unforgettable part?",
            "context": "Eyes light up with curiosity.",
            "video": "https://i.imgur.com/eGKB1YH.mp4"
          }
        },
        {
          "id": "SP403",
          "spanish": "Tengo un talento para hacer reír a la gente. Si quieres, te lo demuestro.",
          "english": "I have a talent for making people laugh. I’ll prove it if you want.",
          "points": 10,
          "video": "https://i.imgur.com/pCl0Bbg.mp4",
          "response": {
            "spanish": "¿Así que eres un comediante? Bien, impresióname. ¿Cuál es tu mejor chiste?",
            "english": "A comedian, huh? Alright, impress me—what’s your best line?",
            "context": "Smirks, tilting her head slightly.",
            "video": "https://i.imgur.com/hs7bUSt.mp4"
          }
        }
      ],
      "transition": "The plates are cleared, and the soft hum of conversation in the restaurant blends with the low notes of a live pianist."
    },
    "5": {
      "initial": {
        "spanish": "Entonces, ¿qué sigue? ¿Eres del tipo que deja que una gran noche termine aquí… o tienes algo en mente?",
        "english": "So, what’s next? Are you the type to let a great night end here… or do you have something in mind?",
        "context": "Her voice lowers slightly, warm and inviting.",
        "video": "https://placeholder.com/video"
      },
      "options": [
        {
          "id": "SP501",
          "spanish": "Me encantaría continuar esta noche con una copa en mi lugar favorito.",
          "english": "I’d love to continue this night over a nightcap at my favorite place.",
          "points": 15,
          "video": "https://i.imgur.com/LTJBgpX.mp4",
          "response": {
            "spanish": "Una propuesta atrevida. Muy bien... ¿dónde está ese misterioso lugar favorito tuyo?",
            "english": "A bold proposal. Alright… where’s this mysterious favorite place of yours?",
            "context": "Raises an intrigued eyebrow, smirking slightly.",
            "video": "https://i.imgur.com/l0BwdLz.mp4"
          }
        },
        {
          "id": "SP502",
          "spanish": "Planifiquemos algo para otra noche. Me encantaría verte de nuevo.",
          "english": "Let’s plan something for another evening. I’d love to see you again.",
          "points": 12,
          "video": "https://i.imgur.com/eJN8FLc.mp4",
          "response": {
            "spanish": "Un caballero que sabe cómo generar expectativa... Me gusta eso. ¿Qué tienes en mente?",
            "english": "A gentleman who knows how to build anticipation—I like that. What kind of evening do you have in mind?",
            "context": "Tilts her head slightly, studying you.",
            "video": "https://i.imgur.com/xOcq2gF.mp4"
          }
        },
        {
          "id": "SP503",
          "spanish": "Ha sido una gran noche. Quizás nos volvamos a cruzar en algún momento.",
          "english": "This was great. Maybe we’ll cross paths again sometime.",
          "points": 8,
          "video": "https://i.imgur.com/cauJVLP.mp4",
          "response": {
            "spanish": "¿Quizás? Eso no suena muy convincente.",
            "english": "Maybe? That’s not very convincing.",
            "context": "Sips the last of her wine, observing you with mild amusement.",
            "video": "https://i.imgur.com/r4VnlBx.mp4"
          }
        }
      ],
      "transition": "The evening draws to a close. The waiter discreetly places the check on the table, and the flickering candlelight casts soft shadows across her face."
    }
  }
},
sofia: {
  id: 'sofia',
  name: 'Sofia',
  spanishName: 'Sofía Rodriguez',
  description: 'Literature Professor',
  image: '/tutors/bar_spanish.jpg',
  language: 'spanish',
  scenes: {
    1: {
      initial: {
        spanish: '¡Hola! ¿Qué te gustaría aprender hoy?',
        english: 'Hello! What would you like to learn today?',
        context: 'Sofia greets you in her cozy library office.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
},
valentina: {
  id: 'valentina',
  name: 'Valentina',
  spanishName: 'Valentina López',
  description: 'Travel Blogger',
  image: '/tutors/networking_spanish.jpg',
  language: 'spanish',
  scenes: {
    1: {
      initial: {
        spanish: '¡Bienvenido a nuestra aventura! ¿Listo para explorar?',
        english: 'Welcome to our adventure! Ready to explore?',
        context: 'Valentina greets you in a vibrant café.',
        video: 'https://placeholder.com/video'
      },
      options: []
    }
  }
}
  };
  export const getCharacter = (id: string): Character | undefined => {
    const characterId = id as CharacterId;
    return characters[characterId];
  };
  export const isValidCharacterId = (id: string): id is CharacterId => {
    return id in characters;
  };
  
  //src/data/characters.ts