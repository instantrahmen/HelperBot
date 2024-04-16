// return active guild id
export const GET = async ({ locals }) => {
  const pb = locals.pb;

  if (!locals.user) {
    return Response.json({});
  }

  return Response.json({
    active_guild: locals.user.active_guild,
  });
};

// set active guild id
export const POST = async ({ locals, request }) => {
  const pb = locals.pb;
  const body = await request.json();

  const { guildId } = body;

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guildId provided' }), { status: 400 });
  }

  try {
    // refresh user
    const user = await locals.pb.collection('users').authRefresh();

    // set active guild

    pb.collection('users').update(user.record.id, {
      active_guild: guildId,
    });

    return Response.json({
      active_guild: guildId,
    });
  } catch (err: unknown) {
    if (err && err instanceof Error) {
      console.error(err.message);
      return new Response(JSON.stringify({ message: 'Failed to update active guild' }), {
        status: 500,
      });
    }
  }
};
