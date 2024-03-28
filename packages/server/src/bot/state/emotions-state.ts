import { ActivityType, Client, Message } from 'discord.js';
import { botState } from '../components/Bot';

import { timeout } from '../utils';

type MoodType = 'happy' | 'flustered' | 'angry' | 'sad';
type MoodTypeExtended = MoodType | 'neutral';

type MoodValues = {
  happy: number;
  flustered: number;
  angry: number;
  sad: number;
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

export default class HelperEmotionsController {
  client: Client;

  private updateTimer: NodeJS.Timeout;

  constructor() {
    this.client = botState.client;

    this.updateTimer = setInterval(async () => {
      // console.log('updating status...');
      this.updateStatus();
    }, seconds(15));

    this.client.on('messageCreate', (message) => {
      this.handleMentions(message);
    });
  }

  cleanup() {
    clearInterval(this.updateTimer);
  }

  updateStatus() {
    const mood = GlobalState.getCurrentMood();
    if (mood === 'neutral') {
      this.client.user?.setStatus('online');
      this.client.user?.setActivity({
        name: `Feeling alright. :)`,
        // type: 'PLAYING',
        type: ActivityType.Playing,
      });
      return;
    }
    if (mood === 'happy') {
      this.client.user?.setStatus('online');
      this.client.user?.setActivity({
        name: `Feeling pretty great! :D`,
        type: ActivityType.Playing,
      });
      return;
    }
    if (mood === 'flustered') {
      this.client.user?.setStatus('idle');
      this.client.user?.setActivity({
        name: `😳`,
        type: ActivityType.Playing,
      });
      return;
    }
    if (mood === 'angry') {
      this.client.user?.setStatus('dnd');
      this.client.user?.setActivity({
        name: `Grrrrr >:(`,
        type: ActivityType.Playing,
      });
      return;
    }
    if (mood === 'sad') {
      this.client.user?.setStatus('dnd');
      this.client.user?.setActivity({
        name: `darn...:(`,
        type: ActivityType.Playing,
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
      });
    }
    if (!message.mentions.has(this.client.user.id)) return;
    if (message.mentions.everyone) return; // Don't respond to @everyone
    if (message.mentions.roles.size > 0) return; // Don't respond to role mentions

    console.log({
      mentions: message.mentions,
    });

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
      msgContains('hee') ||
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
      responses.push(`Wow I love you too, dummy!`);
    }

    if (
      msgContainsFullWord(`${this.client.user} is`) ||
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
      const image = getHelperMoodImage(mood, moodStrength);
      message.reply({
        content: responses.join(' '),
        // files: [image],
      });
      this.updateStatus();
    } else {
      mood = 'sad';
      GlobalState.increaseMoodValue('sad', 1);

      message.reply({
        content: `What are you even trying to say?!`,
        // files: [HelperMoodImages.angry[1]],
      });
    }

    this.updateStatus();
  }
}

const HelperMoodImages = {
  happy: [],
  flustered: [],
  angry: [],
  sad: [],
  neutral: [],
};

export const getHelperMoodImage = (
  mood: MoodTypeExtended,
  strength: number = 1
) => {
  const moodImages = HelperMoodImages[mood];
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
