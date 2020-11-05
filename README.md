# Wooclap-server
![badge1](https://img.shields.io/badge/license-MIT-brightgreen.svg )  ![badge2](https://img.shields.io/badge/language-NodeJS-yellow)

### Prerequisite
At the root of the project create a .env file and copy the accessible code on the following file:

* [Google Doc](https://docs.google.com/document/d/1a2kmwagv1bPuxloXzOAb0p535OUYqnEdXI_Wsde7rqU/edit)

Or copy paste the code below and complete it:

```
PORT=<the port you want to run the server>
AUTHORIZE_URL=<the url you authorize to access and request your api while doing tests. (app like postman don't need this)>
WOOCLAP_CONTACT_EMAIL=<the email sender when a mail is sent to users>
WOOCLAP_CONTACT_NAME=<the contact name>
WOOCLAP_BOT_EMAIL=<the email sender when a mail is sent to the sales team>
WOOCLAP_BOT_NAME=<the bot name>
WOOCLAP_SALES_EMAIL=<the sales team mail>
WOOCLAP_SALES_NAME=<the sales team name>
MJ_APIKEY_PUBLIC=<relative to mailjet tool>
MJ_APIKEY_PRIVATE=<relative to mailjet tool>
```

⚠️ You cannot use every email addresses you want as your email senders, you'll have to:
1. Register on [Mailjet](https://app.mailjet.com/dashboard).
2. Going on the Settings > API Key Management section page.
3. Copy the api key and the secret key into your .env file.
4. Going on the Settings > Sender domains & addresses page.
5. Adding the email addresses you want to use as mail sender.
6. Validate the email validation to confirm your change.

With a free Mailjet account you can send 200 emails per day with a limit of 6000 emails per month.

### Install
At the root of the project run
```
$> yarn install
```

### Commands
```
$> yarn prestart
```
Builds the content of the src/ folder and puts it in the build/ folder. When you issue the yarn start command, this script runs first before the start script.

```
$> yarn start
```
Serves the content of the build/ folder instead of the src/ folder we were serving previously. This is the script you’ll use when serving the file in production. In fact, services like Heroku automatically run this script when you deploy.
You should see the message below

```
$> yarn startdev
```
Start the server during development of the app using babel-node to run the app instead of regular node.
The --exec flag forces babel-node to serve the src/ folder using node since the files in the build/ folder have been compiled to ES5.
