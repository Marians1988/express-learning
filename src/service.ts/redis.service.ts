import { Redis } from 'ioredis';

interface SessionRecord {
    userId: string;
    sessionId: string;
    loggedInAt: string;
}

 class RedisService {

    private client: Redis;
    
    constructor() {
        this.client = new Redis("rediss://default:gQAAAAAAAYX8AAIncDI5Nzk3NmZjMDBhYmU0NDg2OGE3MzQ2ZGE4OTc0MjI3NHAyOTk4MzY@assured-pika-99836.upstash.io:6379");
        this.client.on('error', (err: Error) => console.error('ioredis Error:', err));
        this.client.on('connect', () => console.log('✅ Connesso a Redis tramite ioredis'));
    }

    public saveRefreshToken = async (userId: string | number, refreshToken: string): Promise<void> => {
    // ioredis usa argomenti posizionali o opzioni a seconda della versione
    // EX = 7 giorni in secondi
    await this.client.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
    }

    public saveSession = async (userId: string | number, sessionId: string, loggedInAt: string): Promise<void> => {
    const sessionRecord: SessionRecord = {
        userId: userId.toString(),
        sessionId,
        loggedInAt,
    };

    await this.client.set(
        `session:${userId}:${sessionId}`,
        JSON.stringify(sessionRecord),
        'EX',
        7 * 24 * 60 * 60
    );
    }

    public isValid = async (userId: string | number, token: string): Promise<boolean> => {
    const savedToken = await this.client.get(`refresh_token:${userId}`);
    return savedToken === token;
    }

    public isSessionValid = async (userId: string | number, sessionId: string): Promise<boolean> => {
    const savedSession = await this.client.get(`session:${userId}:${sessionId}`);
    if (!savedSession) {
        return false;
    }

    try {
        const parsedSession = JSON.parse(savedSession) as SessionRecord;
        return parsedSession.userId === userId.toString() && parsedSession.sessionId === sessionId;
    } catch {
        return false;
    }
    }

    public getSession = async (userId: string | number, sessionId: string): Promise<SessionRecord | null> => {
    const savedSession = await this.client.get(`session:${userId}:${sessionId}`);
    if (!savedSession) {
        return null;
    }

    try {
        return JSON.parse(savedSession) as SessionRecord;
    } catch {
        return null;
    }
    }

    public revokeToken = async (userId: string | number): Promise<void> => {
    await this.client.del(`refresh_token:${userId}`);
    }

    public revokeSessionId = async (userId: string | number, sessionId: string): Promise<void> => {
    await this.client.del(`session:${userId}:${sessionId}`);
    }

}

export const redisService = new RedisService();
