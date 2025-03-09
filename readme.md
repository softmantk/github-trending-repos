# GitHub Popularity List

An API that provides popular GitHub repositories.

## Setup & Installation

1. **Install Node v20.**
2. **Install Dependencies:**  
   Run the following command from the root directory:  
   `npm install`
3. **Configure Environment Variables:**  
   Copy the environment file:  
   `cp .env.example .env`
4. **Configure Proxies:**  
   Copy the proxies list and set up your proxy:  
   `cp proxies.example.json .`
5. **Start the Web API:**  
   `npm run start`
6. **Start the Worker:**  
   `npm run worker`

## Modules

There are three modules:

1. **GitHub Module:**  
   Fetches and transforms the GitHub API response into the server's data format.
2. **Trending Repos Module:**  
   Provides an endpoint to retrieve popular GitHub repositories. It accepts inputs such as `createdAt` and `language`.
3. **Score Module:**  
   Calculates the score based on stars, forks, and the recency of updates.

## Flow

1. **Data Ingestion:**  
   There are two ways data ingesion happens:

   A: When user queries with language & date if data doesnt exist on our trendingRepos collection, we immediately calls github service , then transform, calculate score and update results.

   B. A worker service periodically fetches popular repositories from GitHub, based on frequency of user queries. TrendingRepo has frequency number & last fetched date, if frequency is more than **MIN_FREQUENCY_FOR_POPULAR_QUERY** number  & has not recently updated, worker will run the job.

2. **Score Calculation:**  
   The Score Module computes a popularity score for each repository based on stars, forks, and recency. Simple calculation, It has not further developed.

3. **Data Storage:**  
   The trending repositories and their scores are stored in a MongoDB database using the designed schema. This data is updated periodically to stay current only for popular user queries

4. **API:**  
   The Trending Repos Module exposes an endpoint (`/trending-repos`) that accepts query parameters (`language`, `createdAt`) to filter the stored data. Project uses open-api-schema validator to validate incoming request.

## How Does performance is Optimised

1. Github public API request are limited. Hence proxied request to expand request limit
2. Queries are only direcly hit to the github one time, after that result is kept in server database. Subsequent calls are technicaly cached.  After a certain period (CACHE_DURATION_MINUTES) if same request comes again, github api will be called again and updated the cache and respond back to user.
3. Popular user queries are automatically fetched asynchronously using cron job. If a particular user query (creation - 2023-01-01, language - javscript) has been hit X number of times already, that query is considered popular query and then the job will periodically update the db in background.


## Trade-offs

1. The initial fetch may take some time.
2. Sorting by score in real time is not supported.
3. There is a constraint: the maximum number of repositories per category and date is limited to a constant value.
4. Github API call should be made for not previously made api calls.


## Could have improved

1. Retry github by respecting github rate limit headers
2. Respect Etag for reducing the api Calculates
3. Replace Mongodb with redis for better performance
4. Improve workers popularity logic - Could have improved deciding if a query is popular, less recent queries should be removed after X number of days. We could  create a separate job.
5. Provide Pagination. Not done, because we have limited maximum repository items to 150 
