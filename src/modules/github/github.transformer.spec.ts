import GithubTransformer, {toGithubFormat, toScoreFormat} from './github.transformer';
import {computePopularity} from '../score/score.service';

describe('GithubTransformer', () => {
    const rawItem = {
        id: 1,
        name: 'aaa',
        url: 'bbb',
        forks_count: 10,
        stargazers_count: 100,
        created_at: '2023-01',
        updated_at: '2023-02-01'
    };

    it('should convert raw item to githubFormat', () => {
        const formatted = toGithubFormat(rawItem);
        expect(formatted.id).toBe(rawItem.id);
        expect(formatted.forksCount).toBe(rawItem.forks_count);
        expect(formatted.starsCount).toBe(rawItem.stargazers_count);
        expect(formatted.createdAt).toEqual(new Date(rawItem.created_at));
    });

    it('should add computed score using toScoreFormat', () => {
        const githubItem = {
            ...toGithubFormat(rawItem)
        };
        const result = toScoreFormat(githubItem);
        const expectedScore = computePopularity(
            githubItem.starsCount,
            githubItem.forksCount,
            githubItem.createdAt
        );
        expect(result.score).toBe(expectedScore);
    });

    it('should transform an array of raw items', () => {
        const transformed = GithubTransformer.transform([rawItem]);
        expect(transformed).toHaveLength(1);
        expect(transformed[0]).toHaveProperty('score');
        expect(transformed[0].id).toBe(rawItem.id);
    });
});
