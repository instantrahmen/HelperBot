import { Client } from 'discord.js';
import config from '../config';
import commandState from './Commands';
import HelperEmotionsController from '../state/emotions-state';

export const botState = {
  client: new Client({
    intents: config.intents,
  }),

  initialized: false,

  fynniController: undefined as HelperEmotionsController | undefined,

  // "private" members
  _initialize(force = false) {
    console.log('== Initializing bot. ==');
    if (this.initialized && !force) {
      throw new Error(
        `Bot already initialized. If you want to initialize again, pass "${true}"`
      );
    }

    this.client.login(config.botToken);

    console.log('Bot initialized.');

    this._registerClientEventListeners();

    this.initialized = true;
    return this;
  },

  _registerClientEventListeners() {
    this.client.once('ready', async () => {
      // Deploy commands every time server starts up
      console.log('Deploying commands...');
      await commandState.deployAll();
      console.log('deployed commands');

      console.log('Ready.');
    });
  },
};
