import {AxiosInstance} from "axios";
import proxies from '../../proxies.json'

import {formattedDate, GithubSortBy, GithubSortOrder} from "../../common/utils";
import {HttpService} from "./services/http.service";
import {ProxyService} from "./services/proxy.service";

export class GithubLoader {
    private githubClient: AxiosInstance;

    private baseUrl = 'https://api.github.com/'

    constructor(proxyManager: ProxyService) {
        this.githubClient = (new HttpService(this.baseUrl, proxyManager)).getClient()
    }

    async fetchListFromGithub(language?: string, createdAt?: Date, userSearchText?: string) {
        const filters: Record<string, string> = {}

        if (language) {
            filters.language = language;
        }
        if (createdAt) {
            filters.created = `>${formattedDate(createdAt)}`;
        }

        const formulatedQuery = this.formulateQuery(userSearchText, filters, 'stars', 'desc');
        const url = `/search/repositories?${formulatedQuery}`
        console.log('@@@ fetchListFromGithub:url: ', url);
        //TODO do pagination here
        const {data} = await this.githubClient.get(url);
        return data.items
    }

    private formulateQuery(text?: string, filters?: Record<string, any>, sortBy: GithubSortBy = 'stars', sortOrder: GithubSortOrder = 'desc') {
        const qItems = [];
        const searchParams = new URLSearchParams();
        if (text) {
            qItems.push(text);
        }
        if (filters) {
            const formulatedFilters = Object.keys(filters).map((key: string) => (`${key}:${filters[key]}`)).join('+');
            qItems.push(formulatedFilters);
        }
        searchParams.set('q', qItems.join('+'));
        searchParams.set('sort', sortBy);
        searchParams.set('order', sortOrder);

        return decodeURIComponent(searchParams.toString());
    }

}

const proxyManager = new ProxyService(proxies);

export default new GithubLoader(proxyManager)