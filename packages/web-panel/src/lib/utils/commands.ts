import type {
  BotAction,
  BotEvent,
  BotEventAction,
  BotEventParams,
  BotEventVariable,
  BotParamValueTypes,
  Values,
  BotEventVariableTypes,
  BotEventParamsDate,
  BotEventParamsInput,
  BotEventParamsNumber,
  BotEventParamsSelect,
  BotEventParamsSlider,
  BotEventParamsToggle,
  BotEventParamsTextarea,
} from '$lib/types/commands';

type PartialParam = Omit<BotEventParams, 'value'>;
type PartialEvent = Omit<BotEvent, 'type' | 'childActions'>;
type PartialAction = Omit<BotAction, 'type'>;

export const createEvents = (events: PartialEvent[]): BotEvent[] =>
  events.map(({ ...e }) => ({
    ...e,
    type: 'event',
    childActions: [],
  }));

export const createParam = (param: PartialParam): BotEventParams => {
  if (param.initialValue) return { ...param, value: param.initialValue } as BotEventParams;
  if (param.type === 'date')
    return {
      ...param,
      value: new Date().toDateString(),
    } as BotEventParamsDate;
  if (param.type === 'number') return { ...param, value: 0 } as BotEventParamsNumber;
  if (param.type === 'slider') return { ...param, value: 0 } as BotEventParamsSlider;
  if (param.type === 'select')
    return { ...param, value: { label: '', value: '' } } as BotEventParamsSelect;
  if (param.type === 'toggle') return { ...param, value: false } as BotEventParamsToggle;
  if (param.type === 'textarea') return { ...param, value: '' } as BotEventParamsTextarea;
  return { ...param, type: 'input', value: '' } as BotEventParamsInput;
};

export const createActions = (actions: PartialAction[]): BotAction[] =>
  actions.map((a) => ({ ...a, type: 'action' }));

export const createVariable = (
  variable: BotEventVariable
): BotEventVariable<typeof variable.type> => ({
  ...variable,
});

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
