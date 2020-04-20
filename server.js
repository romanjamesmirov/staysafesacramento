const app = require('express')()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
	console.log('a user has connected')

	socket.on('chat message', (msg) => {
		io.emit('chat message', msg)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

http.listen(5000, () => {
	console.log('Listening on port 5000')
})