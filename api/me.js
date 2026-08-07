export default function handler(req, res) {
    const cookies = req.headers.cookie || "";

    const match = cookies.match(
        /(?:^|;\s*)discord_user=([^;]+)/
    );

    if (!match) {
        return res.status(401).json({
            loggedIn: false
        });
    }

    try {
        const user = JSON.parse(
            decodeURIComponent(match[1])
        );

        return res.status(200).json({
            loggedIn: true,
            user
        });

    } catch (error) {
        return res.status(401).json({
            loggedIn: false
        });
    }
}
