const express = require('express');
const server = express();
const projRouter = require('./projects/projects-router');
const actRouter = require('./actions/actions-router.js');

// Configure your server here
server.use(express.json());

// Build your actions router in /api/actions/actions-router.js
server.use('/api/actions', actRouter)
// Build your projects router in /api/projects/projects-router.js
server.use('/api/projects', projRouter);


// Do NOT `server.listen()` inside this file!
server.get('/', (_, res)=>{
    res.send(`<h2>Let's Do This!</h2>`)
})

module.exports = server;
