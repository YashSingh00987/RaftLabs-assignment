export interface GraphQLCollection<T> {
  edges: {
    node: T;
  }[];
}

export interface FeedQueryResponse {
  postsCollection: GraphQLCollection<Post>;
}

export interface UserProfileResponse {
  usersCollection: GraphQLCollection<User>;
}

export interface FollowResponse {
  followsCollection: GraphQLCollection<Follow>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  postsCollection: {
    edges: {
      node: Post;
    }[];
  };
  followsCollection: {
    edges: {
      node: Follow;
    }[];
  };
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  image: string | null;
  tagged_users: number[];
  created_at: string;
}

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
}

export interface CreatePostInput {
  objects: {
    content: string;
    image?: string | null;
    tagged_users?: number[];
    user_id: number;
  }[];
}

export interface FeedQueryResponse {
  posts: Post[];
}

export interface UserProfileResponse {
  users_by_pk: User;
}

export interface FollowResponse {
  follows: Follow[];
}
