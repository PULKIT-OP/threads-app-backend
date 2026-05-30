import express from 'express';
import createApolloGraphqlServer from './graphql';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());  // to parse incoming JSON data in request body

    app.get("/", (req, res) => {
        res.json({ message: "Server is Up and Running" });
    });
    app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));  // graphql server will start on this /graphql route

    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`);
    })
}

init();