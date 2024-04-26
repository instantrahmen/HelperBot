<script context="module" lang="ts">
  import { type Props } from './';

  type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

  export type Builder = ArrayElement<NonNullable<Props['builders']>>;
</script>

<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils/';
  import { buttonVariants, type Events } from './index.js';

  type $$Props = Props & {
    disabled?: boolean;
    href?: string;
  };
  type $$Events = Events;

  let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'default';
  export let builders: $$Props['builders'] = [];
  export let disabled: $$Props['disabled'] = false;
  export let href: $$Props['href'] = undefined;

  export { className as class };

  // const disabledClasses = 'cursor-not-allowed opacity-50';

  $: if (href && disabled) href = undefined;
  $: buttonProps = {
    type: href ? undefined : 'button',
    href,
  } as any;
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  {disabled}
  {...buttonProps}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
