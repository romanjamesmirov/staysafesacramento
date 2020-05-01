### Stay Safe, Sacramento

I'm a JavaScript programmer full-stack. The technologies I used: 
- Socket.io for real time chat
- Mongoose (MongoDB) for data storage
- Express for the server
- React for the interface
- Bcrypt for password hashing
- JWT for authorizing requests
- Plain old CSS for styling the React

TODO: 

- [ ] Protect /api/users/:username
- [ ] In rooms.js, if the request user is the same as the recipient (meaning a user tried to be sneaky and send a chat to himself), abort. In PeopleList.js, I made it so that the user doesn't show up in the list of users so that they can't click on themselves to chat with themselves. 
- [ ] Don't just redirect to /register but also pass state.nextPage so that when the user does register or log in, they go back to the page they wanted to see. 
- [ ] Change _Show people who need/have supplies_ to two radio buttons. Show people who have supplies. Show people who need supplies. Two sentences. And then on the right of this stacked pair of radio options is an icon button that's grey when the user has no new messages and lit up with a number on it showing how many new messages they have if they do have any new ones. 
- [ ] Not important but I'd like to change express and react servers from running on localhost to 192.168.1.37. I tried it and the https failed for the react app for some reason. Reason why I want it is so that the site is accessible on my local network and thus via other devices (iPhone).

NOTES:

- I'm wondering about my future dev flow. I should storyboard. I should completely map out the app on paper so that I can design the entire backend without going back to it after starting the frontend. Models first. Then routes. Then redux actions and reducers. By now you have the data, the communication of data between the server and client, and the storage of data from the server in the redux store. Now you can design the interface to call these actions when a button is clicked and display the information in store. In terms of packages, it's mongoose, then express (and jsonwebtoken and bcrypt...), then redux, then create-react-app.