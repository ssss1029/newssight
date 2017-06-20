# newssight
Node.js app, similar to Polisight. This is still in the works. 
I am trying to transfer most of the Meteor.js functionality in the polisight repo into Node.js, in order to get more control over the processing. Also adding wayy more features into this iteration, and making it more scalable

Technologies used: 
- Node.js
- React.js 
- MongoDB
- Redis 


To run (use different terminals):

```
$ sudo mongod
```

```
$ redis-server
```

```
$ npm install
```

Webpack will run continuously because this project is still in development. This will compile code for client-side JS and create distribution packages in /client/js/dist. This is required for the app to work.
```
$ npm run webpack
```

```
$ node serve
```

The app should be live at http://127.0.0.1:3000/

- - - -

API: 

/api/sources
 - Lists all the sources according to how they are stored in the db
