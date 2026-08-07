export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Código inválido.", {
      status: 400,
    });
  }

  // Obtener Access Token
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: env.DISCORD_REDIRECT_URI,
  });

  const tokenResponse = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const token = await tokenResponse.json();

  if (!token.access_token) {
    return new Response("No se pudo obtener el token de Discord.", {
      status: 400,
    });
  }

  // Obtener servidores del usuario
  const guildsResponse = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );

  const guilds = await guildsResponse.json();

  const pertenece = Array.isArray(guilds) &&
    guilds.some(g => g.id === env.DISCORD_GUILD_ID);

  if (!pertenece) {
    return new Response(
      "Debes unirte al servidor de Discord de Central RP para continuar.",
      {
        status: 403,
      }
    );
  }

  // Obtener información del usuario
  const userResponse = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );

  const discordUser = await userResponse.json();

  const avatar = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const userData = {
    id: discordUser.id,
    username: discordUser.global_name || discordUser.username,
    avatar,
  };

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie":
        `discord_user=${encodeURIComponent(JSON.stringify(userData))}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=604800`
    },
  });
}
