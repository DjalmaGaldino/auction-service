
## Getting started
```
  npm install
```
## Install middy

npm install @middy/core @middy/http-event-normalizer @middy/http-error-handler @middy/http-json-body-parser
(https://www.npmjs.com/package/middy)

## Install http errors

npm install http-errors
(https://www.npmjs.com/package/http-errors)

## curl location

If you need or want to execute curl in terminal:

curl --location --request POST 'DOMAIN' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=CLIENT_ID' \
--data-urlencode 'username=USER_NAME' \
--data-urlencode 'password=YOUR PASSWORD' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'


