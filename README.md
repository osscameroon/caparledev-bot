# CaParleDev Bot

#### Twitter bot for the hashtag #caparledev

0- cp .env.example .env && nano .env

1- Create a Twitter application

2- Get credentials

3- Set credentials in .env

4- Start the app

5- Launch ngrok tunnels to the app

6- Register the auth callback in twitter application

7- Call the endpoint to set generate auth URL

8- Open the auth URL in the browser and login with the bot account

9- After successful login, you will receive a JSON reponse with OAuth access token key and OAuth access token secret
```json
{
  "oauthToken": "OAuth access token key",
  "oauthTokenSecret": "OAuth access token secret"
}
```

10- Open the .env file and set OAuth token key and token secret generated previously
```dotenv
TWITTER_BOT_ACCESS_TOKEN_KEY=oauth_access_token_key
TWITTER_BOT_ACCESS_TOKEN_SECRET=oauth_access_token_secret
```

11- Enable Twitter stream and set the hashtag(s) you want to stream. Separate hashtag with a comma if you have many. You can set up to 5000
```dotenv
ENABLE_STREAM=true
HASHTAG_TO_TRACK=#hastag1,#hastag2,#hastag3,....,#hastagn
```

11- Restart the app