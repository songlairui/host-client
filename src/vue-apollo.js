import Vue from "vue";
import VueApollo from "vue-apollo";
import {
  createApolloClient,
  restartWebsockets
} from "vue-cli-plugin-apollo/graphql-client";

import clientStateDefaults from "./state/defaults";
import clientStateResolvers from "./state/resolvers";
import clientStateTypeDefs from "./state/typeDefs";

// GraphQL documents
// import CURRENT_STATE from "@/graphql/current.gql";
import CONNECTED_SET from "@/graphql/connected/connectedSet.gql";

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = "apollo-token";

// Http endpoint
const httpEndpoint =
  localStorage.getItem("VUE_APP_GRAPHQL_HTTP") ||
  process.env.VUE_APP_GRAPHQL_HTTP ||
  "http://localhost:4000/graphql";

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint:
    localStorage.getItem("VUE_APP_GRAPHQL_WS") ||
    process.env.VUE_APP_GRAPHQL_WS ||
    "ws://localhost:4000/graphql",
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: true,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }

  // inMemoryCacheOptions: {},
  typeDefs: clientStateTypeDefs,
  resolvers: clientStateResolvers,
  onCacheInit: cache => {
    cache.writeData({ data: clientStateDefaults() });
  }
};

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  });
  apolloClient.wsClient = wsClient;

  async function resetApollo() {
    console.log("[UI] Apollo store reset");

    try {
      // await apolloClient.resetStore();
    } catch (e) {
      // Potential errors
    }

    // await apolloClient.query({
    //   query: CURRENT_STATE,
    //   variables: { force: true },
    //   fetchPolicy: "network-only"
    // });
    // await apolloClient.query({
    //   query: CURRENT_STATE,
    //   fetchPolicy: "network-only"
    // });
  }

  /* Connected state */

  function setConnected(value) {
    apolloClient.mutate({
      mutation: CONNECTED_SET,
      variables: {
        value
      }
    });
  }

  wsClient.on("connected", () => setConnected(true));
  wsClient.on("reconnected", async () => {
    await resetApollo();
    setConnected(true);
  });
  // Offline
  wsClient.on("disconnected", () => setConnected(false));
  wsClient.on("error", () => setConnected(false));

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all"
      }
    },
    errorHandler(error) {
      console.log(
        "%cAn error occurred",
        "background: red; color: white; padding: 4px; border-radius: 4px;font-weight: bold;"
      );
      console.log(error.message);
      if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
      if (error.networkError) {
        console.log(error.networkError);
      }
    }
  });

  return apolloProvider;
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== "undefined" && token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (login)", "color: orange;", e.message);
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}
