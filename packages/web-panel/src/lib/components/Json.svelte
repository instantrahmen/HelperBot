<script lang="ts" generics="T = unknown">
  import JsonTree from 'svelte-json-tree';

  let { value }: { value: T } = $props();
</script>

<div
  class=" bg-card-level-2 text-card-foreground max-w-full overflow-x-auto overflow-y-auto rounded-lg border p-2 shadow-sm"
>
  <div class="ml-[-1.5rem] w-[100px] overflow-scroll md:w-full">
    <JsonTree
      {value}
      --json-tree-property-color="hsl(var(--primary))"
      --json-tree-string-color="hsl(var(--muted-foreground))"
      --json-tree-symbol-color="hsl(var(--card-foreground))"
      --json-tree-boolean-color="hsl(var(--accent))"
      --json-tree-function-color="hsl(var(--accent))"
      --json-tree-number-color="hsl(var(--accent))"
      --json-tree-operator-color="hsl(var(--card-foreground)"
      --json-tree-label-color="#f92672"
      --json-tree-arrow-color="#ae81ff"
      --json-tree-null-color="#66d9ef"
      --json-tree-undefined-color="#66d9ef"
      --json-tree-date-color="#fd971f"
      --json-tree-regex-color="#9effff"
      --json-tree-li-indentation="2.6rem"
      --json-tree-li-line-height="1.3"
      --json-tree-font-size="12px"
      --json-tree-font-family="monospace"
    />
  </div>
</div>
