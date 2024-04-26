import type { BotAction, BotEvent, BotEventAction } from '$lib/types/commands';

export const createEvents = (events: BotEventAction[]): BotEvent[] =>
  events.map((e) => ({ ...e, type: 'event' }));
export const createActions = (actions: BotEventAction[]): BotAction[] =>
  actions.map((a) => ({ ...a, type: 'action' }));
