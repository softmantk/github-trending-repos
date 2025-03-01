export const parseGithubResponseData = (data: any) => {
    if (Array.isArray(data)) {
        return data
    }
    if (!data) {
        return []
    }
    delete data.incomplete_results;
    delete data.repository_selection;
    delete data.total_count;
    const namespaceKey = Object.keys(data)[0];
    data = data[namespaceKey];
    return data;
}
