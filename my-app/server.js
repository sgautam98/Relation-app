const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/mdata';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;

let aboutMessage = "Issue Tracker API v1.0";


const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
    filterIssue,
  },
};

function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

async function issueList() {
  const issues = await db.collection('car').find({}).toArray();
  // console.log(issues);
  return issues;
}

async function filterIssue(_,{id}){
  // console.log(limit);
  const filter = {};
  filter._id=id;
  const filt = await db.collection('car').find(filter).toArray();
  return filt;
}



async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(4000, function () {
      console.log('App started on port 4000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
