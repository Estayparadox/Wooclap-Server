# Wooclap-server

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

### Install
At the root of the project run
```
$> yarn install
```

### Run
At the root of the project run
```
$> yarn start
```

You should see the message below
```
Server running on port 8000
```