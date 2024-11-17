import { GraphQLClient } from "graphql-request";

export const createGraphQLClient = (
  url: string,
  headers: Record<string, string>
) => {
  return new GraphQLClient(url, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
};

export const handleGraphQLError = (error: any): string => {
  if (error.response) {
    return error.response.errors?.[0]?.message || "GraphQL Error";
  }
  return error.message || "Unknown Error";
};
