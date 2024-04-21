<script lang="ts">
  import { formatDate } from 'date-fns';

  let { timestamp, formatString = 'P' }: { timestamp: number; formatString?: string } = $props();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDate(date, formatString);
  };

  let formatted = $derived(formatTimestamp(timestamp));
</script>

{formatted}
