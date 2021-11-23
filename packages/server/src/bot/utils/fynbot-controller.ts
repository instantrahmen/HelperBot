import { Client, CommandInteraction, Message } from 'discord.js';

type MoodType = 'happy' | 'flustered' | 'angry' | 'sad';
type MoodTypeExtended = MoodType | 'neutral';

type MoodValues = {
  happy: number;
  flustered: number;
  angry: number;
  sad: number;
  // neutral: never;
};

// time helpers
export const seconds = (amount: number) => amount * 1000;
export const minutes = (amount: number) => amount * seconds(60);
export const hours = (amount: number) => amount * minutes(60);

export class GlobalState {
  static moodValues = {
    happy: 0,
    flustered: 0,
    angry: 0,
    sad: 0,
    // neutral: 0,
  } as MoodValues;

  // 10 seconds for now, will make longer in the future. Probably more like 5 minutes?
  static effectTime = minutes(5);

  static getCurrentMood(): MoodTypeExtended {
    // Get the current highest mood
    return Object.keys(this.moodValues)
      .map((key) => {
        const moodKey = key as MoodType;
        return { key, value: this.moodValues[moodKey] };
      })
      .reduce(
        (currentHighest: any, currentMood) => {
          if (currentMood.value > currentHighest.value) return currentMood;
          return currentHighest;
        },
        { key: 'neutral', value: 0 }
      ).key;
  }

  static async increaseMoodValue(
    mood: MoodType,
    value: number = 1,
    temporary = true
  ) {
    this.moodValues[mood] = this.moodValues[mood] + value;

    if (!temporary) return;

    // When the timer runs out, undo the effects applied previously

    setTimeout(() => {
      console.log('clearing');
      this.decreaseMoodValue(mood, value, false);
    }, this.effectTime);
  }

  static async decreaseMoodValue(
    mood: MoodType,
    value: number = 1,
    temporary = true
  ) {
    this.moodValues[mood] = this.moodValues[mood] - value;

    if (!temporary) return;

    // When the timer runs out, undo the effects applied previously
    await timeout(this.effectTime);
    this.increaseMoodValue(mood, value, false);
  }
}

export default class FynbotGlobalController {
  client: Client;

  constructor(client: Client) {
    this.client = client;

    const _updateTimer = setInterval(async () => {
      console.log('updating status...');
      this.updateStatus();
    }, seconds(15));
  }

  updateStatus() {
    const mood = GlobalState.getCurrentMood();
    console.log({ mood: GlobalState.moodValues });
    if (mood === 'neutral') {
      this.client.user?.setStatus('online');
      this.client.user?.setActivity({
        name: `Feeling alright. :)`,
        type: 'PLAYING',
      });
      return;
    }
    if (mood === 'happy') {
      this.client.user?.setStatus('online');
      this.client.user?.setActivity({
        name: `Feeling pretty great! :D`,
        type: 'PLAYING',
      });
      return;
    }
    if (mood === 'flustered') {
      this.client.user?.setStatus('idle');
      this.client.user?.setActivity({
        name: `😳`,
        type: 'PLAYING',
      });
      return;
    }
    if (mood === 'angry') {
      this.client.user?.setStatus('dnd');
      this.client.user?.setActivity({
        name: `Grrrrr >:(`,
        type: 'PLAYING',
      });
      return;
    }
    if (mood === 'sad') {
      this.client.user?.setStatus('dnd');
      this.client.user?.setActivity({
        name: `darn...:(`,
        type: 'PLAYING',
      });

      return;
    }
  }
  // respond(interaction: CommandInteraction) {}

  handleMentions(message: Message) {
    const msgContains = (str: string) =>
      message.content.toLocaleLowerCase().includes(str);

    if (!this.client.user) return;
    if (message.author.bot) return;
    if (msgContains('@here') || msgContains('@everyone')) return;
    if (msgContains('a certain adorable bean')) {
      message.reply({
        content: 'Lies >.>',
        // files: [image],
      });
    }
    if (!message.mentions.has(this.client.user.id)) return;

    // Fynbot is being mentioned, oh shiiiit
    this.respondToMentions(message);
  }

  private async respondToMentions(message: Message) {
    let responses = [];
    let mood = 'neutral' as MoodTypeExtended;

    const msgContains = (str: string) =>
      message.content.toLocaleLowerCase().includes(str);

    const msgContainsFullWord = (str: string) =>
      message.content.toLocaleLowerCase().split(' ').includes(str);

    if (
      msgContainsFullWord('hi') ||
      msgContains('hey') ||
      msgContains('hello') ||
      msgContains('greetings') ||
      msgContainsFullWord('hai') ||
      msgContainsFullWord('ohai') ||
      msgContains('ohayo') ||
      msgContains('good morning') ||
      msgContains('good evening') ||
      msgContains('good day') ||
      msgContainsFullWord(`yo`) ||
      msgContains('yoo')
    ) {
      responses.push('Hey there!');
    }
    if (
      msgContains('how are you') ||
      msgContains(`how're you`) ||
      msgContains(`what's up`) ||
      msgContainsFullWord(`sup`)
    ) {
      mood = GlobalState.getCurrentMood();

      switch (mood) {
        case 'happy':
          responses.push('Feeling pretty great!');
          break;
        case 'angry':
          responses.push('Not great at all!');
          break;
        case 'flustered':
          responses.push(`I-I'm fine, dummy! Not embarrassed at all!`);
          break;
        case 'sad':
          responses.push('Feeling a bit sad tbh...');
          break;
        default:
          responses.push(`I'm doing alright!`);
      }
    }

    if (msgContainsFullWord('love you')) {
      responses.push(`Woooooow I love you too, dummy!`);
    }

    if (
      msgContainsFullWord('> is') ||
      msgContains('you are ') ||
      msgContains(`you're `) ||
      msgContains(`bot you `)
    ) {
      if (msgContains('not cute') || msgContains('not a cutie')) {
        mood = 'angry';
        responses.push(`Woooooow you don't have to be mean, dummy!`);
      } else if (msgContains('cute') || msgContains('cutie')) {
        mood = 'flustered';
        responses.push('N-not true at all, dummy!');
      }

      if (
        msgContains('great') ||
        msgContains('amazing') ||
        msgContains('wondeful') ||
        msgContains('perfect') ||
        msgContains('incredible') ||
        msgContains('beautiful') ||
        msgContains('smart') ||
        msgContains('hot')
      ) {
        if (msgContains('not ')) {
          mood = 'angry';
          responses.push(`How dare you say that? I'm amazing!`);
        } else {
          mood = 'happy';
          responses.push('Awee, thanks!');
        }
      }

      if (
        msgContains('shit') ||
        msgContains('trash') ||
        msgContains('awful') ||
        msgContains('suck') ||
        msgContains('buggy') ||
        msgContains('stupid') ||
        msgContains('dumb') ||
        msgContains('ugly')
      ) {
        if (!msgContains('not ')) {
          mood = 'angry';
          responses.push(`How dare you say that? I'm amazing!`);
        } else {
          mood = 'happy';
          responses.push('Awee, thanks!');
        }
      }
    }

    if (
      msgContains('sexy') ||
      msgContains('sex ') ||
      msgContains('slut') ||
      msgContains('pussy') ||
      msgContains('tits') ||
      msgContains('tiddies') ||
      msgContains('boobs') ||
      msgContains('boobies') ||
      msgContains('penis') ||
      msgContains('dick')
    ) {
      responses = [];
      mood = 'angry';
      responses.push(`I don't know what that means, but it sounds gross! Ewww`);
    }

    if (msgContains('bitch')) {
      mood = 'angry';
      responses.push('Bitch.');
    }
    console.log({ responses });
    if (responses.length > 0) {
      if (mood !== 'neutral') {
        GlobalState.increaseMoodValue(mood, 1);
      }

      const moodStrength =
        mood === 'neutral' ? 0 : GlobalState.moodValues[mood];
      const image = getFynbotMoodImage(mood, moodStrength);
      message.reply({
        content: responses.join(' '),
        files: [image],
      });
      this.updateStatus();
    } else {
      mood = 'sad';
      GlobalState.increaseMoodValue('sad', 1);

      message.reply({
        content: `What are you even trying to say?!`,
        files: [FynbotMoodImages.angry[1]],
      });
    }

    this.updateStatus();
  }
}

const timeout = async (timeInMs: number) => {
  setTimeout(() => {
    Promise.resolve();
  }, timeInMs);
};

const FynbotMoodImages = {
  happy: [
    'https://media.discordapp.net/attachments/862794834800410657/888466807139217479/Fynbot_Sweet_Smile.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465266302910464/Fynbot_Smug.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465761499238470/download20210905174538.png',
  ],
  flustered: [
    'https://media.discordapp.net/attachments/862794834800410657/888467277140348958/download20210905175139.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465348473524254/Fynbot_Yell.png',
  ],
  angry: [
    'https://media.discordapp.net/attachments/862794834800410657/888467802183319552/download20210905175344.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465382145417256/Fynbot_Annoyed.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465348473524254/Fynbot_Yell.png',
  ],
  sad: [
    'https://media.discordapp.net/attachments/862794834800410657/888465406799540235/Fynbot_Surprised.png',
    'https://media.discordapp.net/attachments/862794834800410657/888465311349743646/Fynbot_Sad.png',
  ],
  neutral: [
    'https://media.discordapp.net/attachments/862794834800410657/888466807139217479/Fynbot_Sweet_Smile.png',
  ],
};
export const getFynbotMoodImage = (
  mood: MoodTypeExtended,
  strength: number = 1
) => {
  const moodImages = FynbotMoodImages[mood];
  const imageIndex = constrain(strength - 1, moodImages.length - 1);

  console.log('image', {
    mood,
    imageIndex,
    image: moodImages[imageIndex],
    moodImages,
  });

  return moodImages[imageIndex];
};

export const constrain = (val: number, max: number, min = 0): number => {
  if (val > max) return max;
  if (val < min) return min;
  return val;
};
// interaction.reply({
//   content: intro,

//   files: [
//     'https://media.discordapp.net/attachments/862794834800410657/888465266302910464/Fynbot_Smug.png',
//   ],
// });
// },
// }),

// createCommand({
// name: 'sayhi',
// description: 'Hi theeere~',
// do: async (interaction: CommandInteraction) => {
// interaction.reply({
//   content: '> Yoooo~',

//   files: [
//     'https://media.discordapp.net/attachments/862794834800410657/888465761499238470/download20210905174538.png',
//   ],
// });
// },
// }),

// createCommand({
// name: 'blush',
// description: `I- I don't blush, sillyyy`,
// do: async (interaction: CommandInteraction) => {
// interaction.reply({
//   content: '> *Fynbot blushes slightly*',

//   files: [
//     'https://media.discordapp.net/attachments/862794834800410657/888467277140348958/download20210905175139.png',
//   ],
// });
// },
// }),

// createCommand({
// name: 'cuteresponse',
// description: `C-cute?! Who are you calling cute, dummy?!`,
// do: async (interaction: CommandInteraction) => {
// interaction.reply({
//   content: '> C-cute?! Who are you calling *cute*, dummy?!',

//   files: [
//     'https://media.discordapp.net/attachments/862794834800410657/888465348473524254/Fynbot_Yell.png',
//   ],
// });
// },
// }),
