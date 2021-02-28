# CaParleDev Bot

#### Twitter bot for the hashtag #caparledev

1- cp .env.example .env && nano .env

2- Create a Twitter application

3- Get credentials

4- Set credentials in .env

5- Start the app

6- Launch ngrok tunnels to the app

7- Register the auth callback in twitter application

8- Call the endpoint to set generate auth URL

9- Open the auth URL in the browser and login with the bot account

10- After successful login, you will receive a JSON reponse with OAuth access token key and OAuth access token secret
```json
{
  "oauthToken": "OAuth access token key",
  "oauthTokenSecret": "OAuth access token secret"
}
```

11- Open the .env file and set OAuth token key and token secret generated previously
```dotenv
TWITTER_BOT_ACCESS_TOKEN_KEY=oauth_access_token_key
TWITTER_BOT_ACCESS_TOKEN_SECRET=oauth_access_token_secret
```
12- Generate Bearer token
```bash
yarn bearer:token
```

13- Open the .env file and set the generated bearer token
```dotenv
TWITTER_BEARER_TOKEN=bearer_token
```

12- Enable Twitter stream and set the hashtag(s) you want to stream. Separate hashtag with a comma if you have many. You can set up to 5000
```dotenv
ENABLE_STREAM=true
HASHTAG_TO_TRACK=#hastag1,#hastag2,#hastag3,....,#hastagn
```

13- Restart the app
```shell
yarn start
```