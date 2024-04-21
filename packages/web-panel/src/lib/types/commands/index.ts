export type CommandAction__Basic = {
  type: 'basic';
  // action?: () => Promise<void>;
  response?: string;
  attachments?: string[];
};

export type CommandAction__Code = {
  type: 'code';
  action: () => Promise<void>;
};

export type CommandAction = CommandAction__Basic | CommandAction__Code;
