import axios, {AxiosInstance} from 'axios';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {ProxyService} from './proxy.service';

export class HttpService {
    agent: AxiosInstance;

    constructor(baseUrl: string, proxyManager?: ProxyService) {
        this.agent = axios.create({
            baseURL: baseUrl,
        })
        if (proxyManager) {
            this.agent.interceptors.request.use(request => {

                const proxy = proxyManager.getProxy();
                if (proxy) {
                    const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
                    request.httpsAgent = new HttpsProxyAgent(proxyUrl);
                }
                return request;
            });

        }
        this.agent.interceptors.response.use(response => response,
            err => {
                const errorObject = {
                    message: err.message || 'An error occurred',
                    status: err.response?.status,
                    data: err.response?.data
                };
                return Promise.reject(errorObject);
            });
    }

    getClient() {
        return this.agent;
    }
}
