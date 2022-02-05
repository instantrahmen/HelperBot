// import transform from 'ts-transform-const-enum';

type Filter = (value: any[]) => boolean;

export const filterObjectByKeys = (obj: object, filter: Filter) =>
  Object.fromEntries(Object.entries(obj).filter(filter));

export const enumToObject = (en: any): object =>
  filterObjectByKeys(en as object, ([key]) => !parseInt(key));
