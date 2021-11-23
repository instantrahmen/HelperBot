// export * from './_deployCommands';
// export * from './_commandState';

export const jsonBlock = (jsonString: any): string => `
\`\`\`json
${JSON.stringify(jsonString, null, 2)}
\`\`\`
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
