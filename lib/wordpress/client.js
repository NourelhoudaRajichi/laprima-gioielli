import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

if (!endpoint) {
  console.warn("NEXT_PUBLIC_WP_GRAPHQL_URL is not set in .env.local");
}

export const wpClient = new GraphQLClient(endpoint || "", {
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchWP(query, variables = {}) {
  try {
    return await wpClient.request(query, variables);
  } catch (error) {
    console.error("WPGraphQL Error:", error?.response?.errors || error.message);
    throw error;
  }
}
