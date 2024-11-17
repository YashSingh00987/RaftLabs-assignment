import { gql } from "graphql-request";

export const CREATE_POST = `
  mutation CreatePost(
    $objects: [posts_insert_input!]!
  ) {
    insertIntopostsCollection(
      objects: $objects
    ) {
      records {
        id
        content
        image
        created_at
        tagged_users
        user_id
      }
      affectedCount
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: Int!, $followingId: Int!) {
    insert_follows_one(
      object: { follower_id: $followerId, following_id: $followingId }
    ) {
      id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: Int!, $followingId: Int!) {
    delete_follows(
      where: {
        follower_id: { _eq: $followerId }
        following_id: { _eq: $followingId }
      }
    ) {
      affected_rows
    }
  }
`;
