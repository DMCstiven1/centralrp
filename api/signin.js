export default function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    const discordUrl =
        "https://discord.com/api/oauth2/authorize" +
        `?client_id=${clientId}` +
        "&response_type=code" +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        "&scope=identify%20guilds";

    res.redirect(302, discordUrl);
}
