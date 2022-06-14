// "type": "module" in package.json then, you can use "import"
import { ApolloServer, gql } from "apollo-server"

const server = new ApolloServer({})

// server.listen().then(({ url }) => {
//     console.log(`Runing on ${url}`)
// })