export interface ProxyConfig {
    id: number;
    host: string;
    port: number;
    username: string;
    password: string;
    rateLimitRemaining?: number;
    rateLimitReset?: number;
}

export class ProxyService {
    private proxies: ProxyConfig[];

    constructor(proxies: ProxyConfig[]) {
        this.proxies = proxies;
    }

    public getProxy(): ProxyConfig | null {
        if (!this.proxies.length) {
            throw new Error('No proxies found');
        }
        // TODO We could improve algorithm to get proxy based on load - by respecting limit headers
        const randomIndex = Math.floor(Math.random() * this.proxies.length);
        return this.proxies[randomIndex];
    }
}
