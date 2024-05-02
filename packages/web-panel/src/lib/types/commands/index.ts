import type { ZodString } from 'zod';

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
  select: {
    label: string;
    value: string;
  };
  toggle: boolean;
  number: number;
  slider: number;
  date: string;
};

type BasicParamValueTypes = Omit<BotParamValueTypes, 'select'>;

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
  params: BotEventParams[];
};

export type BotEventParamsBase<T extends keyof BotParamValueTypes = keyof BotParamValueTypes> = {
  id: string;
  label: string;
  type: T;
  required: boolean;
  description?: string;
  hidden?: (values: Values) => boolean;
  initialValue?: BotParamValueTypes[T];
};

export type BotEventParamsSelect = BotEventParamsBase<'select'> & {
  type: 'select';
  options: BotParamValueTypes['select'][];
};

export type BotEventParamsInput = BotEventParamsBase<'input'> & {
  type: 'input';
  initialValue?: BotParamValueTypes['input'];
  validator?: ZodString;
  transform?: (value: string) => string;
  imagePreview?: boolean;
  leadingLabel?: string;
};

export type BotEventParamsToggle = BotEventParamsBase<'toggle'> & {
  type: 'toggle';
  initalValue?: BotParamValueTypes['toggle'];
};

export type BotEventParamsNumber = BotEventParamsBase<'number'> & {
  type: 'number';
  initialValue?: BotParamValueTypes['number'];
  min?: number;
  max?: number;
  step?: number;
};

export type BotEventParamsSlider = BotEventParamsBase<'slider'> & {
  type: 'slider';
  initialValue?: BotParamValueTypes['slider'];
  min?: number;
  max?: number;
  step?: number;
};

export type BotEventParamsDate = BotEventParamsBase<'date'> & {
  type: 'date';
  initialValue?: BotParamValueTypes['date'];
};

export type BotEventParamsTextarea = BotEventParamsBase<'textarea'> & {
  type: 'textarea';
  initialValue?: BotParamValueTypes['textarea'];
};

type BotEventParamsTypes =
  | BotEventParamsInput
  | BotEventParamsTextarea
  | BotEventParamsNumber
  | BotEventParamsSlider
  | BotEventParamsDate
  | BotEventParamsSelect
  | BotEventParamsToggle;

export type BotEventParams = BotEventParamsTypes;
// | BotEventParamsBase<keyof BasicParamValueTypes>;

export type BotEvent = BotEventAction & {
  type: 'event';
};

export type BotAction = BotEventAction & {
  type: 'action';
};
