import {AxiosInstance} from "axios";
import proxies from '../../proxies.json'

import {formattedDate, GithubSortBy, GithubSortOrder} from "../../common/utils";
import {HttpService} from "./services/http.service";
import {ProxyService} from "./services/proxy.service";
import {parseGithubResponseData} from "./github.utils";
import {MAX_REPOSITORY_ITEMS, REPOSITORIES_PER_PAGE} from "./github.constants";

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
        const data = await this.getPaginatedData(url);
        return data;
    }

    private async getPaginatedData(url: string) {
        const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
        let pagesRemaining = true;
        let data: any[] = [];
        while (pagesRemaining && data.length <= MAX_REPOSITORY_ITEMS) {
            console.log('@@@ getPaginatedData:data.length: ', data.length);
            const response = await this.githubClient.get(url, {
                params: {
                    per_page: REPOSITORIES_PER_PAGE
                }
            })
            const parsedData = parseGithubResponseData(response.data)
            data = [...data, ...parsedData];

            const linkHeader = response.headers.link;

            pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

            if (pagesRemaining) {
                url = linkHeader.match(nextPattern)[0];
            }
        }
        return data;
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