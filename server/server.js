//Import required packages and files
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require("./schemas");

//Start the express server 
const app = express();
const PORT = process.env.PORT || 3001;

//Implement ApolloServer
const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: authMiddleware
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("*", (req, res) => res.sendFile(path.join(_dirname, "../client/build/index.html")));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') app.use(express.static(path.join(__dirname, '../client/build')));

//Listen to the port
db.once('open', () => app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`)));