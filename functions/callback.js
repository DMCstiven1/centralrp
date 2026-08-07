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

  // SI NO PERTENECE AL SERVIDOR DE DISCORD: Mostramos una pantalla bonita
  if (!pertenece) {
    const htmlError = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Central RP</title>
    <link rel="icon" type="image/png" href="https://i.imgur.com/rg130IN.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg-dark: #0b090f;
        --accent: #feb8ff;
        --accent-glow: rgba(254, 184, 255, 0.4);
        --text-main: #ffffff;
        --text-muted: #b8b2bc;
        --danger: #ef4444;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background-color: var(--bg-dark);
        color: var(--text-main);
        font-family: 'Inter', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(rgba(11, 9, 15, 0.9), rgba(11, 9, 15, 0.95)),
                    url('https://i.imgur.com/nB62BWW.png') no-repeat center center/cover;
      }
      .error-card {
        background: rgba(14, 11, 20, 0.85);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 40px 30px;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        text-align: center;
        backdrop-filter: blur(16px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .icon-container {
        width: 70px;
        height: 70px;
        background: rgba(239, 68, 68, 0.1);
        border: 2px solid rgba(239, 68, 68, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px auto;
        color: var(--danger);
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
      }
      .icon-container svg {
        width: 34px;
        height: 34px;
        fill: currentColor;
      }
      h1 {
        font-family: 'Outfit', sans-serif;
        font-weight: 900;
        font-size: 1.8rem;
        text-transform: uppercase;
        margin-bottom: 12px;
        letter-spacing: -0.02em;
        color: #ffffff;
      }
      p {
        font-size: 0.95rem;
        color: var(--text-muted);
        line-height: 1.5;
        margin-bottom: 30px;
      }
      .btn-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .btn-discord {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: #5865F2;
        color: #ffffff;
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 1rem;
        padding: 14px 20px;
        border-radius: 12px;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        transition: all 0.2s ease;
        box-shadow: 0 0 20px rgba(88, 101, 242, 0.4);
      }
      .btn-discord:hover {
        background: #4752c4;
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(88, 101, 242, 0.6);
      }
      .btn-discord svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
      .btn-back {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(254, 184, 255, 0.05);
        color: var(--accent);
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        padding: 12px 20px;
        border-radius: 12px;
        border: 1px solid rgba(254, 184, 255, 0.2);
        text-decoration: none;
        text-transform: uppercase;
        transition: all 0.2s ease;
      }
      .btn-back:hover {
        background: rgba(254, 184, 255, 0.15);
        border-color: var(--accent);
      }
    </style>
    </head>
    <body>
      <div class="error-card">
        <div class="icon-container">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <h1>Acceso Restringido</h1>
        <p>Para poder iniciar sesión y entrar a Central Roleplay, necesitas formar parte de nuestro servidor oficial de Discord.</p>
        
        <div class="btn-container">
          <a href="https://discord.gg/WnYjHrq6Rb" target="_blank" class="btn-discord">
            <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            Unirme al Servidor
          </a>
          <a href="/" class="btn-back">Volver al Inicio</a>
        </div>
      </div>
    </body>
    </html>
    `;

    return new Response(htmlError, {
      status: 403,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
      },
    });
  }

  // Obtener información del usuario si sí pertenece
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
        `discord_user=${encodeURIComponent(JSON.stringify(userData))}; Path=/; Secure; SameSite=Lax; Max-Age=604800`
    },
  });
}
