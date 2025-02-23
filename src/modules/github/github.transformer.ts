import {set, pipe, map} from 'lodash/fp';
import {computePopularity} from "../score/score.service";

type githubFormat = {
    id: number;
    name: string;
    url: string;
    forksCount: number;
    starsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export const toGithubFormat = (item: Record<string, any>): githubFormat => {
    return {
        id: item.id,
        name: item.name,
        url: item.url,
        forksCount: item.forks_count,
        starsCount: item.stargazers_count,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
    }
}

export const toScoreFormat = (item: Record<string, any>) => {
    const score = computePopularity(item.starsCount, item.forksCount, item.createdAt)
    const final =set('score', score, item)
    return final;
}

export class GithubTransformer {
    transform = (items: Record<string, any>[]) => {
        const response = pipe(
            map(toGithubFormat),
            map(toScoreFormat), // Assumes score calculation is not heavy
        )(items);
        // console.log('@@@ transform:response: ', response);
        return response;
    }

}

export default new GithubTransformer();