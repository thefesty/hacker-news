# Hacker News

Hacker News is an application which uses the Y Combinator Hacker News API, to show their latest items.
It's possible to configure how many items and which item types to display.

The application is build using AngularJS and Bootstrap.

## Installation

### Manual
Download the files and place them in a folder (i.e hacker-news), on your web-server.
Depending on which web-server you are using, you may need to do some minor configuration.

### NPM
Download the files and place them in an empty folder.
Run the following commands.
```bash
$ npm install
$ npm start
```

## API's
The application uses the following API's.

Top 500 item id's  
https://hacker-news.firebaseio.com/v0/topstories.json

All item properties (replace [id] with item id)  
https://hacker-news.firebaseio.com/v0/item/[id].json

All user properties (replace [id] with username)  
https://hacker-news.firebaseio.com/v0/user/[id].json

## Application Logic
The following describes the steps involed in generating the list of items, which is displayed to the user.

1. The id's of the top 500 items are retrieved (API call). 
2. Fore each item-id, retrieve all item-properties (API call).
3. Check if the retrieved item-type matches the desired types to display. If it does, then add it to a list of items. If it doesn't, then continue to step 4.
4. Check if the desired number of items has been retrieved. If so return the list of items retrieved. If not, repeat steps 2 to 4.
5. Retrieve all usernames from the retrieved items.
6. Fore each username, retrieve all user-properties (API call).
7. Match item and user, based on username.
8. Map all relevant properties in a single object.
9. Sort list based on item-score.
10. Return result.

## Links

- [AngularJS](https://angularjs.org/)
- [Bootstrap](http://getbootstrap.com/)
- [Angular Bootstrap UI](https://angular-ui.github.io/bootstrap/)
- [NPM](https://www.npmjs.com/)
