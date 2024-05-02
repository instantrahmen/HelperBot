import type {
  BotAction,
  BotEvent,
  BotEventAction,
  BotEventParams,
  BotParamValueTypes,
  Values,
} from '$lib/types/commands';
export const createEvents = (events: BotEventAction[]): BotEvent[] =>
  events.map((e) => ({ ...e, type: 'event' }));
export const createActions = (actions: BotEventAction[]): BotAction[] =>
  actions.map((a) => ({ ...a, type: 'action' }));

export function convertParamsToValues<
  T extends keyof BotParamValueTypes = keyof BotParamValueTypes,
>(params: BotEventParams[]): Values {
  const valueTypes: (keyof BotParamValueTypes)[] = [
    'input',
    'textarea',
    'select',
    'toggle',
    'number',
    'slider',
    'date',
  ];

  const defaultValues: Partial<BotParamValueTypes> = {
    input: '',
    textarea: '',
    select: { label: '', value: '' },
    toggle: false,
    number: 0,
    slider: 0,
    date: '',
  };

  return valueTypes.reduce((values, type) => {
    const paramsOfType = params.filter((param) => param.type === type);

    const typeValues: Values[keyof BotParamValueTypes] = paramsOfType.reduce(
      (typeValues, param) => {
        const { id, initialValue } = param;
        const defaultValue = initialValue ?? defaultValues[type];

        return {
          ...typeValues,
          [id]: defaultValue,
        };
      },
      {}
    );

    return {
      ...values,
      [type]: typeValues,
    };
  }, {} as Values);
}
