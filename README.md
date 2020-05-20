# Stay Safe, Sacramento

Alright. I've redone this project entirely many times and I need to write down the major assumptions and the backend architecture. 

## Questions

Q1. Do we want users that were created since the last time the current user visited the Home tab to show up when the current user clicks on the Home tab again? Or should it take a full reload of the page? 

Why not both? Just make a request for the users that were created after the time this session requested for all users. So I need to add a route for batch user requesting. 

Q2. Do we need sockets? Can't we use good old CRUD over HTTPS-protected routes? 

Problem is, how does the recipient know when to fetch for new messages? We need sockets so that the recipient doesn't have to do an interval fetch for new messages from the current user (and other users sending messages to that recipient). 

Q3. Why keep chat operations separate from Express routes? Why do we need to do operations like fetching chat history in socket.io? 

Of course, it would be simple to use a token-protected route. However, socket.io needs to authorize connections because sending messages is a protected operation, too. We don't want to fetch the chat _id, encrypt it, send it to the client, and pass it back up to socket.io in our handshake. We could just grab the _id in socket.io. 

## Backend 

Enough questions. What does the backend look like? First off, I'm a JavaScript programmer full-stack. So I used:

- Mongoose for data persistence
- Express for client auth and communication between clients and the DB. Express works with:
	- Bcrypt for hashing passwords before pushing them to the DB
	- JWT for auth
- Socket.io for real time chat and also to do what Express does but just for the Chat model
- React and plain CSS for the client interface

So it's a MERN app running on Heroku. 

Registering the client just means creating a new user before logging them it. It's a type of login. So login talks to Express for validation, which then pulls from (or pushes to) Mongoose, and sends back a res with a JWT token (and user data if not registering). 

After that, React redirects to either the home, connections, user profile page, or a chat with another user. If it's home, we request for all users. If it's connections, we batch request for those users. If it's chat, we request for that single user. If it's the profile page... we do nothing since the session user doesn't change and so we don't need to request for fresh user data. It's all stored in redux. 

Before we do any requests, though, we open up a socket.io connection so that we can start receiving notifications if there's a new chat message. 

## References (by file)

server
- [redirect to https](https://developer.ibm.com/technologies/node-js/tutorials/make-https-the-defacto-standard) 
- [react deployment docs](https://create-react-app.dev/docs/deployment)
- (don't do) using https in dev – [resource one](https://create-react-app.dev/docs/using-https-in-development) and [two](github.com/dakshshah96/local-cert-generator)

api/message
- [$all operator](https://docs.mongodb.com/manual/reference/operator/query/all/#op._S_all)

auth/token
- [try-catch jwt.verify syntax](https://npmjs.com/package/jsonwebtoken)

src/redux/actions
- [access redux store outside component](https://daveceddia.com/access-redux-store-outside-react/)
- [Why didn't I prepend "http://localhost:5000/" to my URLs? I set "proxy" in package.json. It's http in development and https in production... Since in production, React is built in /build and served by Express, so the server and client are of the same origin in Heroku.](https://create-react-app.dev/docs/proxying-api-requests-in-development)
- [Access redux state outside component](https://daveceddia.com/access-redux-store-outside-react)

src/components/Home
- [<Link>'s with props](https://tylermcginnis.com/react-router-pass-props-to-link)
- [mapState](https://react-redux.js.org/using-react-redux/connect-mapstate)

src/components/Register
- [Conditional redirect in render(). I just combined it with redux](https://tylermcginnis.com/react-router-programmatically-navigate)
- [I get it now. Reducers are the middleman between state and actions. Actions have the goal of changing state, like setState. But the store is read-only. Neither actions nor reducers update state. Instead, reducers return a new state based on the current state and the action's payload. So the app isn't based on state. It's based on the reducers.](https://freecodecamp.org/news/9d9551ff4b3c)

## Notes

- I'm wondering about my future dev flow. I should storyboard. I should completely map out the app on paper so that I can design the entire backend without going back to it after starting the frontend. Models first. Then routes. Then redux actions and reducers. By now you have the data, the communication of data between the server and client, and the storage of data from the server in the redux store. Now you can design the interface to call these actions when a button is clicked and display the information in store. In terms of packages, it's mongoose, then express, then redux, then react and css.
- Don't publish your IP next time. It's already too late since it's sprinkled in the commits history... Use your .env. And add /build to .gitignore in case that the .env variable ends up hard-coded in build. 