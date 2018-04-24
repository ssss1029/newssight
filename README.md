# Newssight Overview
Node.js app, similar to Polisight. This is still in the works.
README coming soon!

# Setup

 - Create a new file, called `addons-process-env.js`. This file contains global variables that the app requires to run. Here is an example of what if should look like:

 ```js

module.exports = {
	/** ENVIRONMENT */
	NODE_ENV : 'development',
	DEBUG : 'newssight:*',
}
 ```

 - Make sure MySQL is up and running. Modify `/server/database-conns/connection.js` and the connection object in `/server/database-conns/db-setup.js` with the correct credentials. Right now, it tries to connect to `localhost` with the username and pass: `localhost` and `localhost`.

# Running
To run:

```
$ npm installl
$ npm run webpack
$ npm run nodemon
```

The app should be live at `http://127.0.0.1:3000/`

# Testing

```
$ npm test
```

# API 

POST `/api/sources/`
 - Lists all the sources according to how they are stored in the db

POST `/api/sources/batchUpdate`
 - Updates the sources table with new data about the sources. Overwrites existing entries and addes new ones. Expects the following JSON data:
 ```json
 {
     "sources" : [
         {sourceData}
         {sourceData}
         {sourceData}
     ]
 }
 ```
Where each `{sourceData}` Object is built as follows:
```json
{
    "id": STRING,
    "name": STRING,
    "desciption": STRING,
    "url": STRING,
    "category": STRING,
    "country" : STRING,
    "language": STRING,
    "topSortByAvailable": STRING,
    "latestSortByAvailable" : STRING,
    "popularSortByAvailable": STRING
}
```

POST `/api/user/make/`
 - Makes a user and then logs them in, given the following POST parameters: `givenUsername`, `givenEmail`, `givenPassword`, `confirmGivenPassword`. Ensures that `confirmGivenPassword = givenPassword` before proceeding.

POST `/api/user/removeAll`
 - Empty request -> removes all users from the database

POST `/api/user/login`
 - Looks for POST parameters: `username` and `password`. Login, cookie creation, and session handling are handled by Passport.js

GET `/api/articles/homepage`
 - Returns all the top articles that belong on the homepage organized by entities and sorted by mmost salient.
    ```json
    [
        [
            4.82423319,
            {
                "entity": "Donald J. Trump",
                "salience": 4.82423319,
                "articles": {
                    "salience": 4.82423319,
                    "articles" : [ {articleObject} , {articleObject} , {articleObject} ]
                }
            }
        ],[
            2.0992683,
            {
                "entity": "Michael Cohen",
                "salience": 2.0992683,
                "articles": {
                    "salience": 2.0992683,
                    "articles" : [ {articleObject} , {articleObject} , {articleObject} ]
                }
            }
        ],
    ] 
    ```
Where each articleObect looks like the following:
```json
     {
        "id": 10,
        "title": "The Latest: Barbara Bush funeral procession underway",
        "author": "",
        "sourceId": "associated-press",
        "description": "HOUSTON (AP) — The Latest on the funeral and burial of former first lady Barbara Bush (all times local): 2:45 p.m. A funeral procession is making its way to Texas A&amp;M University for the burial of former first lady Barbara Bush. Roughly 1,500 people attend…",
        "url": "https://apnews.com/cc49955ee09e43a2bfe56d5ea7fe9b35",
        "urlToImage": "https://storage.googleapis.com/afs-prod/media/media:c7e8fa53e17c489e9b1d9a4eb141415e/3000.jpeg",
        "publishedAt": "2018-04-21T19:52:24Z",
        "savedAt": "Sun Apr 22 2018 19:34:39 GMT-0700 (Pacific Daylight Time (Mexico))"
    }
```

# User endpoints
 `/logout`
 - Loggs out the current logged in passport user. 

 `/`
 - Landing page for the app. Contains some pretty pictures and a catchy tagline about the future. 

 `/login`
 - User-facing form for logging in. Also contains form for signing up for an account. Signup functionality is not implemented yet in the backend.

 `/home`
 - The News Home. Contains trending articles organized by what entities they are about.

 `/article?article=<articleId>`
 - Provides information about the article with id `articleId`. Contains Title, picture, link, source, description, and entities. Will also contains comments in the future (separated out into positive and negative ones?)

# Data

Data is not being updated day-to-day right now. The data that the app is working off of is currently in `/data`. 
 - `/data/articles.csv` contains metadata about each article
 - `/data/articledata/<ID>.txt` contains data about article `<ID>` and its full scraped contents
 - `/data/entityanalysis/<ID>.txt` contains GCP's entity analysis data for article `<ID>`
