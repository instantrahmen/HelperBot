import type { Interaction, Message } from 'discord.js';
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
  value: BotParamValueTypes['select'];
};

export type BotEventParamsInput = BotEventParamsBase<'input'> & {
  type: 'input';
  initialValue?: BotParamValueTypes['input'];
  validator?: ZodString;
  transform?: (value: string) => string;
  imagePreview?: boolean;
  leadingLabel?: string;
  value: BotParamValueTypes['input'];
};

export type BotEventParamsToggle = BotEventParamsBase<'toggle'> & {
  type: 'toggle';
  initalValue?: BotParamValueTypes['toggle'];
  value: BotParamValueTypes['toggle'];
};

export type BotEventParamsNumber = BotEventParamsBase<'number'> & {
  type: 'number';
  initialValue?: BotParamValueTypes['number'];
  min?: number;
  max?: number;
  step?: number;
  value: BotParamValueTypes['number'];
};

export type BotEventParamsSlider = BotEventParamsBase<'slider'> & {
  type: 'slider';
  initialValue?: BotParamValueTypes['slider'];
  min?: number;
  max?: number;
  step?: number;
  value: BotParamValueTypes['slider'];
};

export type BotEventParamsDate = BotEventParamsBase<'date'> & {
  type: 'date';
  initialValue?: BotParamValueTypes['date'];
  value: BotParamValueTypes['date'];
};

export type BotEventParamsTextarea = BotEventParamsBase<'textarea'> & {
  type: 'textarea';
  initialValue?: BotParamValueTypes['textarea'];
  validator?: ZodString;
  transform?: (value: string) => string;
  value: BotParamValueTypes['textarea'];
};

export type BotEventParams =
  | BotEventParamsInput
  | BotEventParamsTextarea
  | BotEventParamsNumber
  | BotEventParamsSlider
  | BotEventParamsDate
  | BotEventParamsSelect
  | BotEventParamsToggle;

export type BotEventVariableTypes = {
  string: string;
};
export type BotEventVariable<T extends keyof BotEventVariableTypes = keyof BotEventVariableTypes> =
  {
    type: T;
    name: string;
    label: string;
  } & (
    | {
        commandType: 'message';
        value(message: Message): BotEventVariableTypes[T];
      }
    | {
        commandType: 'interaction';
        value(interaction: Interaction): BotEventVariableTypes[T];
      }
  );
export type BotEvent = BotEventAction & {
  type: 'event';
  variables: BotEventVariable[];
  childActions: BotAction[] | ControlFlow[];
};

export type BotAction = BotEventAction & {
  type: 'action';
};

export type ControlFlow = BotEventAction & {
  type: 'control-flow';
  id: string;
  label: string;
  description: string;
  value: string;
  params: BotEventParams[];
  childActions: BotAction[] | ControlFlow[];
};
