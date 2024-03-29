
export const serializeNonPOJOs = (obj: any) => {
  return structuredClone(obj);
};

export const test = () => {
  console.log('test');
}