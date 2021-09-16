import {
  BaseGeneratedListTypes,
  FieldTypeFunc,
  CommonFieldConfig,
  fieldType,
  graphql,
  orderDirectionEnum,
  filters,
  FieldDefaultValue,
} from '@keystone-next/keystone/types';

export type MyIntFieldConfig<
  TGeneratedListTypes extends BaseGeneratedListTypes
> = CommonFieldConfig<TGeneratedListTypes> & {
  defaultValue?: FieldDefaultValue<number, TGeneratedListTypes>;
  isRequired?: boolean;
  isIndexed?: boolean | 'unique';
};

export const myInt =
  <TGeneratedListTypes extends BaseGeneratedListTypes>({
    isIndexed,
    isRequired,
    defaultValue,
    ...config
  }: MyIntFieldConfig<TGeneratedListTypes> = {}): FieldTypeFunc =>
  (meta) =>
    fieldType({
      kind: 'scalar',
      mode: 'optional',
      scalar: 'Int',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
    })({
      ...config,
      input: {
        where: {
          arg: graphql.arg({ type: filters[meta.provider].Int.optional }),
          resolve: filters.resolveCommon,
        },
        create: { arg: graphql.arg({ type: graphql.Int }) },
        update: { arg: graphql.arg({ type: graphql.Int }) },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({ type: graphql.Int }),
      views: require.resolve('./view.tsx'),
      __legacy: {
        isRequired,
        defaultValue,
      },
    });
