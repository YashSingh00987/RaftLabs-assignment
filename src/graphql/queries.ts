import { gql } from "graphql-request";

export const GET_NEWS_FEED = gql`
  query GetNewsFeed($limit: Int!, $offset: Int!) {
    postsCollection {
      edges {
        node {
          id
          content
          user_id
          image
          created_at
          tagged_users
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    usersCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          id
          name
          email
          profile_picture
          postsCollection {
            edges {
              node {
                id
                content
                image
                created_at
                tagged_users
              }
            }
          }
          followsCollection {
            edges {
              node {
                id
                follower_id
                following_id
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_FOLLOW_STATUS = gql`
  query GetFollowStatus() {
    followsCollection() {
      edges {
        node {
          id
          
        }
      }
    }
  }
`;
