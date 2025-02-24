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

## Trade-offs

1. The initial fetch may take some time.
2. Sorting by score in real time is not supported.
3. There is a constraint: the maximum number of repositories per category and date is limited to a constant value.
4. Github API call should be made for not previously made api calls.


## Could have improved

1. Retry github by respecting github rate limit headers
2. Respect Etag for reducing the api Calculates
3. Replace Mongodb with redis for better performance
4. Proper request validation - joi, swagger api could have provided, but beyond the scope.
5. Provide Pagination. Not done, because we have limited maximum repository items to 1000 
