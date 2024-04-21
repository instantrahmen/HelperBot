<script lang="ts">
  import { formatDate } from 'date-fns';

  let { timestamp }: { timestamp: number } = $props();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDate(date, 'P');
  };

  let formatted = $derived(formatTimestamp(timestamp));
</script>

{formatted}
