// import transform from 'ts-transform-const-enum';

type Filter = (value: any[]) => boolean;

export const filterObjectByKeys = (obj: object, filter: Filter) =>
  Object.fromEntries(Object.entries(obj).filter(filter));

export const enumToObject = (en: any): object =>
  filterObjectByKeys(en as object, ([key]) => !parseInt(key));

export const timeout = async (timeInMs: number) => {
  setTimeout(() => {
    Promise.resolve();
  }, timeInMs);
};

import { inspect } from 'util';

export const toJson = (obj: any) => {
  return inspect(obj, {
    depth: 1,
  });
};

export const jsonBlock = (jsonString: any, plaintext = false): string => `
${plaintext ? '' : `\`\`\`js`}
${typeof jsonString !== 'string' ? toJson(jsonString) : jsonString}
${plaintext ? '' : `\`\`\``}
    `;

export const indexArrayByKey = (
  array: Array<any>,
  key: string
): { [key: string]: any } =>
  array.reduce((obj: any, arrayItem: any) => {
    let objToSpread = {} as any;
    return { ...obj, [arrayItem[key]]: arrayItem };
  }, {});

export const indexWithinArray = (array: Array<any>, index: number) => {
  const maxValue = array.length - 1;

  return index >= 0 && index <= maxValue;
};

export const times = (amount: number, callback: Function) => {
  return [...new Array(amount)].map((_, i) => callback(i));
};

export const clamp = (max: number, num: number) => {
  if (num < 0) return 0;
  if (num > max) return max;
  return num;
};

export const wrap = (max: number, num: number) => {
  return num >= 0 ? num % max : ((num % max) + max) % max;
};

export const wrapWithinArray = (arr: Array<any>, value: number) => {
  return wrap(arr.length, value);
};

export const clampWithinArray = (arr: Array<any>, value: number) => {
  return clamp(arr.length - 1, value);
};
