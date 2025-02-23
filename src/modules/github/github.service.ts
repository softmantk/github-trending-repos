import githubProcessor, {GithubLoader} from "./github.loader";
import githubTransformer, {GithubTransformer} from "./github.transformer";

export class GithubService {


    constructor(private githubExtractor: GithubLoader, private transformer: GithubTransformer) {
    }


    async getRepositoryList(language: string, createdAt?: Date, userSearchText?: string,) {
        try {
            // Extract Data
            const data = await this.githubExtractor.fetchListFromGithub(language, createdAt, userSearchText);
            const transformedData = this.transformer.transform(data);
            // TODO keep replica of transformed records in the system
            console.log()
            return transformedData
        } catch (e) {
            throw e;
        }
    }
}

export default new GithubService(githubProcessor, githubTransformer)