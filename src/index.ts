import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());  // to parse incoming JSON data in request body

    // Create GraphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        
        `,
        resolvers: {
            Query: {
                hello: () => "Hey there! I am GraphQL Server",
                say: (_, { name }: { name: String }) => `Hey ${name}, How are you buddy?`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName, lastName, email, password, salt: "Aditi Goyal"
                        },
                    });
                    return true;
                }
            }
        }
    })

    // Start the gqlServer 
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is Up and Running" });
    });
    app.use("/graphql", expressMiddleware(gqlServer));  // graphql server will start on this /graphql route


    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`);
    })
}

init();