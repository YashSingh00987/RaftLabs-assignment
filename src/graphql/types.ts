import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Post, User, Follow } from "../types";

export interface QueryVariables {
  limit?: number;
  offset?: number;
  userId?: number;
  followerId?: number;
  followingId?: number;
}

export type PostsQuery = TypedDocumentNode<{ posts: Post[] }, QueryVariables>;
export type UserQuery = TypedDocumentNode<
  { users_by_pk: User },
  { userId: number }
>;
export type FollowMutation = TypedDocumentNode<
  { follows: Follow },
  { followerId: number; followingId: number }
>;
