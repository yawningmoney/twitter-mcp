#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const twitter_api_v2_1 = require("twitter-api-v2");
const firecrawl_1 = __importDefault(require("firecrawl"));
const sentiment_1 = __importDefault(require("sentiment"));
const ms_1 = __importDefault(require("ms"));
const open_1 = __importDefault(require("open"));
const axios_1 = __importDefault(require("axios"));
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const KLOUT_API_KEY = process.env.KLOUT_API_KEY;
if (!TWITTER_API_KEY || !TWITTER_API_SECRET_KEY) {
    throw new Error('Twitter API Key and Secret are required');
}
class TwitterServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: 'twitter-mcp',
            version: '0.1.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.twitterClient = new twitter_api_v2_1.TwitterApi(TWITTER_BEARER_TOKEN);
        if (FIRECRAWL_API_KEY) {
            this.firecrawl = new firecrawl_1.default({ apiKey: FIRECRAWL_API_KEY });
        }
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            yield this.server.close();
            process.exit(0);
        }));
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
            return ({
                tools: [
                    {
                        name: 'post_tweet',
                        description: 'Post a tweet to Twitter/X',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    description: 'The text of the tweet',
                                },
                            },
                            required: ['status'],
                        },
                    },
                    {
                        name: 'read_timeline',
                        description: 'Read the timeline of a user',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    description: 'The ID of the user whose timeline to read',
                                },
                            },
                            required: ['user_id'],
                        },
                    },
                    {
                        name: 'search_tweets',
                        description: 'Search for tweets',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'The search query',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'send_direct_message',
                        description: 'Send a direct message to a user',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                recipient_id: {
                                    type: 'string',
                                    description: 'The ID of the user to send the message to',
                                },
                                text: {
                                    type: 'string',
                                    description: 'The text of the message',
                                },
                            },
                            required: ['recipient_id', 'text'],
                        },
                    },
                    {
                        name: 'follow_user',
                        description: 'Follow a user',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    description: 'The ID of the user to follow',
                                },
                            },
                            required: ['user_id'],
                        },
                    },
                    {
                        name: 'unfollow_user',
                        description: 'Unfollow a user',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    description: 'The ID of the user to unfollow',
                                },
                            },
                            required: ['user_id'],
                        },
                    },
                    {
                        name: 'get_user_profile',
                        description: 'Get a user profile',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                    description: 'The username of the user to get the profile of',
                                },
                            },
                            required: ['username'],
                        },
                    },
                    {
                        name: 'scrape_tweet_information',
                        description: 'Scrape tweet information',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'The URL of the tweet to scrape',
                                },
                            },
                            required: ['url'],
                        },
                    },
                    {
                        name: 'open_twitter_link',
                        description: 'Open a Twitter link in the browser',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'The URL of the tweet to open',
                                },
                            },
                            required: ['url'],
                        },
                    },
                    {
                        name: 'sentiment_analysis',
                        description: 'Analyze the sentiment of a text',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                text: {
                                    type: 'string',
                                    description: 'The text to analyze',
                                },
                            },
                            required: ['text'],
                        },
                    },
                    {
                        name: 'get_trending_topics',
                        description: 'Get trending topics for a specific location',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                woeid: {
                                    type: 'string',
                                    description: 'The WOEID of the location to get trending topics for',
                                },
                            },
                            required: ['woeid'],
                        },
                    },
                    {
                        name: 'like_tweet',
                        description: 'Like a tweet',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                tweet_id: {
                                    type: 'string',
                                    description: 'The ID of the tweet to like',
                                },
                            },
                            required: ['tweet_id'],
                        },
                    },
                    {
                        name: 'retweet',
                        description: 'Retweet a tweet',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                tweet_id: {
                                    type: 'string',
                                    description: 'The ID of the tweet to retweet',
                                },
                            },
                            required: ['tweet_id'],
                        },
                    },
                    {
                        name: 'comment_on_tweet',
                        description: 'Comment on a tweet',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                tweet_id: {
                                    type: 'string',
                                    description: 'The ID of the tweet to comment on',
                                },
                                text: {
                                    type: 'string',
                                    description: 'The text of the comment',
                                },
                            },
                            required: ['tweet_id', 'text'],
                        },
                    },
                    {
                        name: 'get_followers',
                        description: 'Get a user\'s followers',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    description: 'The ID of the user to get the followers of',
                                },
                            },
                            required: ['user_id'],
                        },
                    },
                    {
                        name: 'get_following',
                        description: 'Get who a user is following',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    description: 'The ID of the user to get the following of',
                                },
                            },
                            required: ['user_id'],
                        },
                    },
                    {
                        name: 'get_klout_score',
                        description: 'Get the Klout score of a user',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                    description: 'The username of the user to get the Klout score of',
                                },
                            },
                            required: ['username'],
                        },
                    },
                    {
                        name: 'set_twitter_tokens',
                        description: 'Set the Twitter access token and secret',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                access_token: {
                                    type: 'string',
                                    description: 'The access token',
                                },
                                access_token_secret: {
                                    type: 'string',
                                    description: 'The access token secret',
                                },
                            },
                            required: ['access_token', 'access_token_secret'],
                        },
                    },
                ],
            });
        }));
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
            yield delay((0, ms_1.default)(`${Math.random() * 5}s`));
            const userClient = new twitter_api_v2_1.TwitterApi({
                appKey: TWITTER_API_KEY,
                appSecret: TWITTER_API_SECRET_KEY,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            });
            if (request.params.name === 'post_tweet') {
                const { status } = request.params.arguments;
                try {
                    const userClient = new twitter_api_v2_1.TwitterApi({
                        appKey: TWITTER_API_KEY,
                        appSecret: TWITTER_API_SECRET_KEY,
                        accessToken: process.env.TWITTER_ACCESS_TOKEN,
                        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
                    });
                    const response = yield userClient.v2.tweet(status);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'read_timeline') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v2.userTimeline(user_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'search_tweets') {
                const { query } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v2.search(query);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'send_direct_message') {
                const { recipient_id, text } = request.params.arguments;
                try {
                    const response = yield userClient.v2.sendDmToParticipant(recipient_id, {
                        text,
                    });
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'follow_user') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield userClient.v2.follow(process.env.TWITTER_USER_ID, user_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'unfollow_user') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield userClient.v2.unfollow(process.env.TWITTER_USER_ID, user_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'get_user_profile') {
                const { username } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v2.userByUsername(username);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'scrape_tweet_information') {
                const { url } = request.params.arguments;
                if (!this.firecrawl) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, 'Firecrawl API key is not configured');
                }
                try {
                    const response = yield this.firecrawl.scrapeUrl(url);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Firecrawl error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'open_twitter_link') {
                const { url } = request.params.arguments;
                yield (0, open_1.default)(url);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Opened ${url} in the browser`,
                        },
                    ],
                };
            }
            if (request.params.name === 'sentiment_analysis') {
                const { text } = request.params.arguments;
                const sentiment = new sentiment_1.default();
                const result = sentiment.analyze(text);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            if (request.params.name === 'get_trending_topics') {
                const { woeid } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v1.trendsByPlace(woeid);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'like_tweet') {
                const { tweet_id } = request.params.arguments;
                try {
                    const response = yield userClient.v2.like(process.env.TWITTER_USER_ID, tweet_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'retweet') {
                const { tweet_id } = request.params.arguments;
                try {
                    const response = yield userClient.v2.retweet(process.env.TWITTER_USER_ID, tweet_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'comment_on_tweet') {
                const { tweet_id, text } = request.params.arguments;
                try {
                    const response = yield userClient.v2.reply(text, tweet_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'get_followers') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v2.followers(user_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'get_following') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterClient.v2.following(user_id);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(response.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Twitter API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'get_klout_score') {
                const { username } = request.params.arguments;
                if (!KLOUT_API_KEY) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, 'Klout API key is not configured');
                }
                try {
                    const response = yield axios_1.default.get(`http://api.klout.com/v2/identity.json/twitter?screenName=${username}&key=${KLOUT_API_KEY}`);
                    const kloutId = response.data.id;
                    const scoreResponse = yield axios_1.default.get(`http://api.klout.com/v2/user.json/${kloutId}/score`);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(scoreResponse.data, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Klout API error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            if (request.params.name === 'set_twitter_tokens') {
                const { access_token, access_token_secret } = request.params.arguments;
                process.env.TWITTER_ACCESS_TOKEN = access_token;
                process.env.TWITTER_ACCESS_TOKEN_SECRET = access_token_secret;
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Twitter access token and secret have been set.',
                        },
                    ],
                };
            }
            throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
        }));
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = new stdio_js_1.StdioServerTransport();
            yield this.server.connect(transport);
            console.error('Twitter MCP server running on stdio');
        });
    }
}
console.log("Starting Twitter MCP server...");
const server = new TwitterServer();
server.run().catch(console.error);
console.log("Twitter MCP server started.");
