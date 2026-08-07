export default async function handler(req, res) {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Código inválido.");
    }

    const {
        DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET,
        DISCORD_GUILD_ID,
        DISCORD_REDIRECT_URI
    } = process.env;

    // Obtener Access Token de Discord
    const body = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI
    });

    const tokenResponse = await fetch(
        "https://discord.com/api/oauth2/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        }
    );

    const token = await tokenResponse.json();

    if (!token.access_token) {
        return res.status(400).send(
            "No se pudo obtener el token de Discord."
        );
    }

    // Obtener servidores del usuario
    const guildsResponse = await fetch(
        "https://discord.com/api/users/@me/guilds",
        {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        }
    );

    const guilds = await guildsResponse.json();

    const pertenece =
        Array.isArray(guilds) &&
        guilds.some(guild => guild.id === DISCORD_GUILD_ID);

    // Si no pertenece al servidor
    if (!pertenece) {
        return res.status(403).send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Restringido - Central RP</title>

    <style>
        :root {
            --bg-dark: #0b090f;
            --accent: #feb8ff;
            --text-main: #ffffff;
            --text-muted: #b8b2bc;
            --danger: #ef4444;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;

            background:
                linear-gradient(
                    rgba(11, 9, 15, 0.9),
                    rgba(11, 9, 15, 0.95)
                ),
                url("https://i.imgur.com/nB62BWW.png")
                no-repeat center center / cover;
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
            margin: 0 auto 20px;
            color: var(--danger);
        }

        .icon-container svg {
            width: 34px;
            height: 34px;
            fill: currentColor;
        }

        h1 {
            font-weight: 900;
            font-size: 1.8rem;
            text-transform: uppercase;
            margin-bottom: 12px;
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

        .btn-discord,
        .btn-back {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px 20px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 800;
        }

        .btn-discord {
            background: #5865F2;
            color: #fff;
        }

        .btn-back {
            background: rgba(254, 184, 255, 0.05);
            color: var(--accent);
            border: 1px solid rgba(254, 184, 255, 0.2);
        }
    </style>
</head>

<body>

    <div class="error-card">

        <div class="icon-container">
            <svg viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/>
            </svg>
        </div>

        <h1>Acceso Restringido</h1>

        <p>
            Para poder iniciar sesión y entrar a Central Roleplay,
            necesitas formar parte de nuestro servidor oficial de Discord.
        </p>

        <div class="btn-container">

            <a
                href="https://discord.gg/WnYjHrq6Rb"
                target="_blank"
                class="btn-discord"
            >
                Unirme al Servidor
            </a>

            <a href="/" class="btn-back">
                Volver al Inicio
            </a>

        </div>

    </div>

</body>
</html>
        `);
    }

    // Obtener información del usuario
    const userResponse = await fetch(
        "https://discord.com/api/users/@me",
        {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        }
    );

    const discordUser = await userResponse.json();

    const avatar = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : "https://cdn.discordapp.com/embed/avatars/0.png";

    const userData = {
        id: discordUser.id,
        username:
            discordUser.global_name ||
            discordUser.username,
        avatar
    };

    const cookieValue = encodeURIComponent(
        JSON.stringify(userData)
    );

    res.setHeader(
        "Set-Cookie",
        `discord_user=${cookieValue}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=604800`
    );

    res.redirect(302, "/");
}
