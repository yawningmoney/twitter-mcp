#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const axios_1 = __importDefault(require("axios"));
const firecrawl_1 = __importDefault(require("firecrawl"));
const sentiment_1 = __importDefault(require("sentiment"));
const ms_1 = __importDefault(require("ms"));
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY;
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
        this.twitterApi = axios_1.default.create({
            baseURL: 'https://api.twitter.com/2',
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            },
        });
        this.firecrawl = new firecrawl_1.default({ apiKey: FIRECRAWL_API_KEY });
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
                        name: 'twitter_login',
                        description: 'Login to Twitter to get the access token',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                            required: [],
                        },
                    },
                ],
            });
        }));
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
            yield delay((0, ms_1.default)(`${Math.random() * 5}s`));
            if (request.params.name === 'post_tweet') {
                const { status } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post('tweets', {
                        text: status,
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data.detail) !== null && _b !== void 0 ? _b : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'read_timeline') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.get(`users/${user_id}/tweets`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data.detail) !== null && _d !== void 0 ? _d : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'search_tweets') {
                const { query } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.get('tweets/search/recent', {
                        params: { query },
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data.detail) !== null && _f !== void 0 ? _f : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'send_direct_message') {
                const { recipient_id, text } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post('dm_conversations/with/user/dm_events', {
                        event: {
                            type: 'message_create',
                            message_create: {
                                target: {
                                    recipient_id,
                                },
                                message_data: {
                                    text,
                                },
                            },
                        },
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data.detail) !== null && _h !== void 0 ? _h : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'follow_user') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post(`users/${process.env.TWITTER_USER_ID}/following`, {
                        target_user_id: user_id,
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data.detail) !== null && _k !== void 0 ? _k : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'unfollow_user') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.delete(`users/${process.env.TWITTER_USER_ID}/following/${user_id}`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_m = (_l = error.response) === null || _l === void 0 ? void 0 : _l.data.detail) !== null && _m !== void 0 ? _m : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'get_user_profile') {
                const { username } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.get(`users/by/username/${username}`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_p = (_o = error.response) === null || _o === void 0 ? void 0 : _o.data.detail) !== null && _p !== void 0 ? _p : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'scrape_tweet_information') {
                const { url } = request.params.arguments;
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
                const open = yield Promise.resolve().then(() => __importStar(require('open')));
                yield open.default(url);
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
                    const response = yield this.twitterApi.get('trends/place.json', {
                        params: { id: woeid },
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_r = (_q = error.response) === null || _q === void 0 ? void 0 : _q.data.detail) !== null && _r !== void 0 ? _r : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'like_tweet') {
                const { tweet_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post(`users/${process.env.TWITTER_USER_ID}/likes`, {
                        tweet_id,
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_t = (_s = error.response) === null || _s === void 0 ? void 0 : _s.data.detail) !== null && _t !== void 0 ? _t : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'retweet') {
                const { tweet_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post(`users/${process.env.TWITTER_USER_ID}/retweets`, {
                        tweet_id,
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_v = (_u = error.response) === null || _u === void 0 ? void 0 : _u.data.detail) !== null && _v !== void 0 ? _v : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'comment_on_tweet') {
                const { tweet_id, text } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.post('tweets', {
                        text,
                        reply: {
                            in_reply_to_tweet_id: tweet_id,
                        },
                    });
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_x = (_w = error.response) === null || _w === void 0 ? void 0 : _w.data.detail) !== null && _x !== void 0 ? _x : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'get_followers') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.get(`users/${user_id}/followers`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_z = (_y = error.response) === null || _y === void 0 ? void 0 : _y.data.detail) !== null && _z !== void 0 ? _z : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'get_following') {
                const { user_id } = request.params.arguments;
                try {
                    const response = yield this.twitterApi.get(`users/${user_id}/following`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Twitter API error: ${(_1 = (_0 = error.response) === null || _0 === void 0 ? void 0 : _0.data.detail) !== null && _1 !== void 0 ? _1 : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'get_klout_score') {
                const { username } = request.params.arguments;
                if (!KLOUT_API_KEY) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, 'Klout API key is not configured');
                }
                try {
                    const kloutApi = axios_1.default.create({
                        baseURL: 'http://api.klout.com/v2',
                    });
                    const response = yield kloutApi.get(`identity.json/twitter?screenName=${username}&key=${KLOUT_API_KEY}`);
                    const kloutId = response.data.id;
                    const scoreResponse = yield kloutApi.get(`user.json/${kloutId}/score`);
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
                    if (axios_1.default.isAxiosError(error)) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Klout API error: ${(_3 = (_2 = error.response) === null || _2 === void 0 ? void 0 : _2.data.detail) !== null && _3 !== void 0 ? _3 : error.message}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    throw error;
                }
            }
            if (request.params.name === 'twitter_login') {
                // This is a placeholder for the OAuth flow.
                // In a real scenario, this would involve opening a browser window
                // and having the user authorize the application.
                // For now, we will just return a message with a link to the Twitter developer portal.
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Please go to https://developer.twitter.com/en/portal/projects-and-apps and create an app to get your API keys.',
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
const server = new TwitterServer();
server.run().catch(console.error);
