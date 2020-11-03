# Wooclap-server

### Prerequisite
In the backend/ folder create a .env file and copy the code below inside this file.

```
PORT=8000
AUTHORIZE_URL="http://localhost:3000"
WOOCLAP_CONTACT_EMAIL="joseph.pereniguez@outlook.com"
WOOCLAP_CONTACT_NAME="Joseph"
WOOCLAP_BOT_EMAIL="joseph.pereniguez@outlook.com"
WOOCLAP_BOT_NAME="Joseph"
WOOCLAP_SALES_EMAIL="joseph.pereniguez@gmail.com"
WOOCLAP_SALES_NAME="Joseph"
MJ_APIKEY_PUBLIC='c8e14a0f2c8aed61ff59b958fd2c225e'
MJ_APIKEY_PRIVATE='82d5d692bc0e7524e2f370f392361f4c'
```

* PORT is the port you want to run the server
* AUTHORIZE_URL is the url you authorize to access and request your api while doing tests. (app like postman don't need this).
* WOOCLAP_CONTACT_XXX is the email sender when a mail is sent to users.
* WOOCLAP_BOT_XXX is the email sender when a mail is sent to the sales team.
* WOOCLAP_SALES_XXX is the sales team mail.
* MJ_APIKEY_PUBLIC and MJ_APIKEY_PRIVATE are relative to mailjet tool.

### Install
In the backend/ folder run
```
$> yarn install
```

### Run
In the backend/ folder run
```
$> yarn start
```

You should see the message below
```
Server running on port 8000
```