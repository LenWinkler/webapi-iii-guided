const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function clientLogger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next();
}

function gateKeeper(req, res, next) {
  const password = req.headers.password;

  if (password.toLowerCase() === 'mellon') {
    next();
  } else if (password.toLowerCase() === ''){
    res.status(400).json({ message: "Please provide a password" })
  } else {
    res.status(401).json({ you: "cannot pass!" })
  }
}

// global middleware
server.use(gateKeeper)
server.use(helmet()); // third party
server.use(express.json()); // built in
server.use(clientLogger) // custom middleware
server.use(morgan('dev'));

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
