export type CommandAction__Basic = {
  type: 'basic';
  response?: string;
  attachments?: string[];
};

export type CommandAction__Code = {
  type: 'code';
  action: () => Promise<void>;
};

export type CommandAction = CommandAction__Basic | CommandAction__Code;

export type BotParamValueTypes = {
  input: string;
  textarea: string;
  select: string;
  toggle: boolean;
  number: number;
  slider: number;
  date: string;
};

export type Values = {
  [key in keyof BotParamValueTypes]: {
    [id: string]: BotParamValueTypes[key];
  };
};

export type BotEventAction = {
  id: string;
  label: string;
  description: string;
  value: string;
  params: BotEventParams<keyof BotParamValueTypes>[];
};

export type BotEventParams<T extends keyof BotParamValueTypes = keyof BotParamValueTypes> = {
  id: string;
  label: string;
  type: T;
  required: boolean;
  description?: string;
  initalValue?: BotParamValueTypes[T];
};

export type BotEvent = BotEventAction & {
  type: 'event';
};

export type BotAction = BotEventAction & {
  type: 'action';
};
