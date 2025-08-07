# Twitter/X MCP Development Plan

## 1. Core Features

*   **Post Tweet:** Send a new tweet.
*   **Read Timeline:** Get tweets from a user's timeline.
*   **Search Tweets:** Search for tweets based on keywords.
*   **Send Direct Message:** Send a private message to a user.
*   **Follow/Unfollow User:** Manage relationships on the platform.
*   **Get User Profile:** Retrieve information from a specific profile.
*   **Scrape Tweet Information:** Extract detailed information from tweets, such as likes, retweets, and comments.
*   **Open Twitter Links:** Open a Twitter link in the browser.
*   **Sentiment Analysis:** Analyze the sentiment of tweets.
*   **Trending Topics:** List the most talked about topics in a specific location.
*   **Interact with Tweets:** Like, retweet, and comment on tweets.
*   **Get Followers:** Get a user's followers.
*   **Get Following:** Get who a user is following.
*   **Get Klout Score:** Get the Klout score of a user.
*   **Twitter Login:** Authenticate with Twitter to get an access token.

## 2. Architecture

The MCP server was built using TypeScript and Node.js, following the same structure as the other MCPs we reviewed. It uses the Twitter API for core functionality, Firecrawl to collect tweet information, and the Klout API for Klout scores.

## 3. Authentication

The server requires the following API keys. Only the API Key and Twitter Secret are required.

*   **Twitter API Key (Required):** You can get this from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps).
*   **Twitter API Secret Key (Required):** You can get this from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps).
*   **Twitter Bearer Token:** You can get this from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps).
*   **Twitter User ID:** You can get this from your Twitter profile.
*   **Firecrawl API Key:** You can get this from the [Firecrawl website](https://firecrawl.dev/).
*   **Klout API Key:** You can get this from the [Klout website](http://klout.com/s/developers/home).

You can also use the `twitter_login` tool to authenticate with Twitter and get an access token.
