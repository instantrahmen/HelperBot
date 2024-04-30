<script lang="ts">
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  // let items = $state([
  //   {
  //     id: 2,
  //     name: 'Item 2',
  //   },
  //   {
  //     id: 3,
  //     name: 'Item 3',
  //   },
  // ]);
  // let items2 = $state([
  //   {
  //     id: 1,
  //     name: 'Item 1',
  //   },
  // ]);
  // let's try in non-runes
  let items = [
    {
      id: 1,
      name: 'Item 1',
    },
  ];
  let items2 = [
    {
      id: 2,
      name: 'Item 2',
    },
    {
      id: 3,
      name: 'Item 3',
    },
  ];

  const flipDurationMs = 200;

  const sortItems1 = (e: CustomEvent<DndEvent<(typeof items)[0]>>) => {
    items = e.detail.items;
  };

  const sortItems2 = (e: CustomEvent<DndEvent<(typeof items2)[0]>>) => {
    items2 = e.detail.items;
  };
</script>

<main class="card bg-card-level-1 flex flex-1 flex-col gap-4 border p-4 px-4 lg:gap-6">
  <ul
    use:dndzone={{ items, flipDurationMs }}
    onconsider={sortItems1}
    onfinalize={sortItems1}
    class="bg-card-level-2 flex gap-2 rounded border border-dashed p-2"
  >
    {#each items as item (item.id)}
      <li
        class="bg-card-level-3 rounded border p-4 text-lg"
        animate:flip={{ duration: flipDurationMs }}
        data-item-id={item.id}
      >
        {item.name}
      </li>
    {/each}
  </ul>

  <ul
    use:dndzone={{ items: items2, flipDurationMs: flipDurationMs }}
    class="bg-card-level-2 flex gap-2 rounded border border-dashed p-4 text-lg"
    onconsider={sortItems2}
    onfinalize={sortItems2}
  >
    {#each items2 as item (item.id)}
      <li
        class="dashed bg-card-level-3 rounded border p-2"
        animate:flip={{ duration: 200 }}
        data-item-id={item.id}
      >
        {item.name}
      </li>
    {/each}
  </ul>
</main>
