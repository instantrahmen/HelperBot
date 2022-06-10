import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, request }) => {
	// `params.id` comes from [id].js
	// const item = await db.get(params.id);

	// if (item) {
	//   return {
	//     body: { item }
	//   };
	// }

	// return {
	//   status: 404
	// };

	const clientId = '938274206574075994';

	const oauth2URL = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauthenticate&response_type=code&scope=email%20identify%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join%20applications.entitlements%20applications.store.update%20applications.commands%20messages.read%20webhook.incoming%20bot`;
	const url = new URL(request.url);
	const query = Object.fromEntries(url.searchParams);
	return {
		body: {
			params,
			query,
			oauth2URL
		}
	};
};
