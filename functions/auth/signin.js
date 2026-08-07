export async function onRequest(context) {
  const { env } = context;

  const discord =
    "https://discord.com/api/oauth2/authorize" +
    `?client_id=${env.DISCORD_CLIENT_ID}` +
    "&response_type=code" +
    `&redirect_uri=${encodeURIComponent(env.DISCORD_REDIRECT_URI)}` +
    "&scope=identify guilds";

  return Response.redirect(discord, 302);
}
