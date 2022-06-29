// "type": "module" in package.json then, you can use "import"
import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "11",
  },
  {
    id: "2",
    text: "second",
    userId: "12",
  },
  {
    id: "3",
    text: "third",
    userId: "13",
  },
  {
    id: "4",
    text: "forth",
    userId: "11",
  },
];

let users = [
  {
    id: "11",
    firstName: "Mason",
    lastName: "Lee",
  },
  {
    id: "12",
    firstName: "Henry",
    lastName: "Kim",
  },
  {
    id: "13",
    firstName: "Taehong",
    lastName: "Kwon",
  },
];

// type Query{} <<< must be provided in a scheama
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!

    # """ mark, adding description to Apolo server, must be above of the target
    """
    is the sum of firstName + lastName as a string
    """
    fullName: String!
    myTweet: [Tweet!]!
    # [], values in ARRAY needed to results in ARRAY
  }

  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  # type Query is like GET request, only for read
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet!
    user(id: ID!): User!
    movie(id: ID!): Movie!
  }
  # type Mutation is like POST or PUT request, for add, edit or deleate whatever mutate
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    """
    if an user found, returns true, else false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      const tweetExists = tweets.find((tweet) => tweet.id === id);
      if (!tweetExists) {
        throw new Error("Id of the tweet must be exist");
      } else {
        return tweetExists;
      }
    },
    // tweet(root, arg) {
    //     return tweets.find((tweet) => tweet.id === arg.id)
    // }, (same as above)

    allUsers(root) {
      return users;
    },
    user(root, { id }) {
      const userExists = users.find((user) => user.id === id);
      if (!userExists) {
        throw new Error("Id of the user must be exist");
      } else {
        return userExists;
      }
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(root, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return;
      } else {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      }
    },
    deleteTweet(root, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) {
        return false;
      } else {
        tweets = tweets.filter((tweet) => tweet.id !== id);
        return true;
      }
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
    //     {
    //         fullName(root) {
    //             root.fullName === `${firstName} ${lastName}`
    //             return `${firstName} ${lastName}`
    //         } (same as above)
    myTweet({ id }) {
      return tweets.filter((tweet) => tweet.userId === id);
      //[], values in ARRAY needed to results in ARRAY
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Runing on ${url}`);
});
