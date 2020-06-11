import withApollo from "next-with-apollo";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { endpoint } from "../config";
import { getDataFromTree } from "@apollo/react-ssr";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
});

function createClient({ headers }) {
  return new ApolloClient({
    // Provide required constructor fields
    cache: cache,
    link: link,

    // Provide some optional constructor fields
    name: "react-web-client",
    version: "1.3",
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

export default withApollo(createClient, { getDataFromTree });
