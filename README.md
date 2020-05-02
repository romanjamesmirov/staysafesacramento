### Stay Safe, Sacramento

I'm a JavaScript programmer full-stack. The technologies I used: 
- Socket.io for real time chat
- Mongoose (MongoDB) for data storage
- Express for the server
- React for the interface
- Bcrypt for password hashing
- JWT for authorizing requests
- Plain old CSS for styling the React

CURRENT OBJECTIVE: 
- [ ] Refresh tokens so I don't have to sign in after refreshing. Will require some work with the httponly cookie. 
- [x] Socket.io chat between two logged in users
- [ ] Save the chats to /models/Chat.js and load when logged-in user clicks on a person they've been chatting with
- [ ] Check if recipient is logged out in /api/chat/:username and if they are, push newMsg to the recipient's updates array. 
- [ ] Add a bell icon button to the right of the radio buttons in the index component. It will change the list of users to those that the logged-in user has chatted with. Then you can display the above updates array for the logged-in user in this list. The radio buttons are now replaced with a back button to show all users. 

TODO: 

- [ ] Protect /api/users/:username and change sender = await User.findOne... to jwt.verify(token...)
- [ ] In rooms.js, if the request user is the same as the recipient (meaning a user tried to be sneaky and send a chat to himself), abort. In PeopleList.js, I made it so that the user doesn't show up in the list of users so that they can't click on themselves to chat with themselves. 
- [ ] Don't just redirect to /register but also pass state.nextPage so that when the user does register or log in, they go back to the page they wanted to see. 
- [ ] Not important but I'd like to change express and react servers from running on localhost to [my IP address]. I tried it and the https failed for the react app for some reason. Reason why I want it is so that the site is accessible on my local network and thus via other devices (iPhone).

NOTES:

- I'm wondering about my future dev flow. I should storyboard. I should completely map out the app on paper so that I can design the entire backend without going back to it after starting the frontend. Models first. Then routes. Then redux actions and reducers. By now you have the data, the communication of data between the server and client, and the storage of data from the server in the redux store. Now you can design the interface to call these actions when a button is clicked and display the information in store. In terms of packages, it's mongoose, then express (and jsonwebtoken and bcrypt...), then redux, then create-react-app.
- Don't publish your IP next time. It's already too late since it's sprinkled in the code over multiple commits... in react fetch() calls, in server.js... Use your .env. And include /build in .gitignore in case that the .env variable ends up hard-coded in build. 