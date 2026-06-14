import { Settings } from "./Settings"

interface IAccessTokenResponse {
    access_token: string
    refresh_token?: string
    expires_in?: number
}

export class SpotifyService {
    public static token: string = ""
    public static expiresAt: number = 0

    public static async exchange(): Promise<void> {
        const request = await fetch("https://accounts.spotify.com/api/token", {
            "headers": {
                "Authorization": `Basic ${Buffer.from(`${Settings.credentials.clientID}:${Settings.credentials.clientSecret}`).toString('base64')}`,
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: new URLSearchParams({
                client_id: Settings.credentials.clientID,
                grant_type: "authorization_code",
                code: Settings.credentials.code,
                redirect_uri: Settings.credentials.customRedirectUri
            }).toString(),
            "method": "POST"
        });

        if (!request.ok) throw new Error(`Spotify authorization failed with HTTP ${request.status}`)

        const json = await request.json() as IAccessTokenResponse

        this.token = json.access_token
        this.expiresAt = Date.now() + ((json.expires_in || 3600) - 60) * 1000

        if (json.refresh_token) Settings.credentials.refreshToken = json.refresh_token
    }

    public static async refresh(): Promise<void> {
        if (!Settings.credentials.refreshToken) return

        const request = await fetch("https://accounts.spotify.com/api/token", {
            "headers": {
                "Authorization": `Basic ${Buffer.from(`${Settings.credentials.clientID}:${Settings.credentials.clientSecret}`).toString('base64')}`,
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: Settings.credentials.refreshToken,
                redirect_uri: Settings.credentials.customRedirectUri
            }).toString(),
            "method": "POST"
        });

        if (!request.ok) throw new Error(`Spotify token refresh failed with HTTP ${request.status}`)

        const json = await request.json() as IAccessTokenResponse

        this.token = json.access_token
        this.expiresAt = Date.now() + ((json.expires_in || 3600) - 60) * 1000

        if (json.refresh_token) Settings.credentials.refreshToken = json.refresh_token
    }

    public static async ensureToken(): Promise<string> {
        if (this.token && Date.now() < this.expiresAt) return this.token

        await this.refresh()

        return this.token
    }
}
