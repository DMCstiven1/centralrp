export default function handler(req, res) {
    res.setHeader(
        "Set-Cookie",
        "discord_user=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    res.redirect(302, "/");
}
