# hacker-news

Hacker News is an application which uses the Y Combinator Hacker News API, to show their lates items.
It's possible to configure how many items and which item types to display.

The application is build using AngularJS and Bootstrap.

## API's
The application uses the following API's.

https://hacker-news.firebaseio.com/v0/topstories.json
https://hacker-news.firebaseio.com/v0/item/[id].json
https://hacker-news.firebaseio.com/v0/user/[id].json

## Application Logic
The following describes the steps involed in genrating the list of items, which is displayed to the user.

1. The id's of the top 500 items are retrieved (API call). 
2. Fore each item-id, retrieve all item-properties (API call).
3. Check if the retrieved item-type matches the desired types to display. If it does, then add it to a list of items. If it doesn't, then continue to step 4.
4. Check if the desired number of items has been retrieved. If so return the list of items retrieved. If not, repeat steps 2 to 4.
5. Retrieve all usernames from the retrieved items.
6. Fore each username, retrieve all user-properties (API call).
7. Match item and user, based on username.
8. Map all releavant properties in a single object.
9. Sort list based on item-score.
10. Return result.