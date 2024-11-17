import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { graphqlClient } from "../lib/graphql-client";
import { GET_USER_PROFILE, GET_FOLLOW_STATUS } from "../graphql/queries";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations";
import {
  UserProfileResponse,
  FollowResponse,
  Post,
  User,
  Follow,
} from "../types";
import PostCard from "./PostCard";

interface RouteParams extends Record<string, string> {
  userId: string;
}

interface PostWithUser extends Post {
  user: User;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<RouteParams>();
  const queryClient = useQueryClient();
  const numericUserId = parseInt(userId!, 10);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<{ users_by_pk: User }, Error>(
    ["userProfile", numericUserId],
    async () => {
      const response = await graphqlClient.request<UserProfileResponse>(
        GET_USER_PROFILE,
        { userId: numericUserId }
      );
      const user = response.usersCollection.edges[0].node;
      return {
        users_by_pk: user,
      };
    }
  );

  const { data: followData } = useQuery<{ follows: Follow[] }, Error>(
    ["followStatus", numericUserId],
    async () => {
      const response = await graphqlClient.request<FollowResponse>(
        GET_FOLLOW_STATUS,
        {
          follower_id: 1,
          following_id: numericUserId,
        }
      );
      return {
        follows: response.followsCollection.edges.map((edge) => edge.node),
      };
    }
  );

  const followMutation = useMutation<FollowResponse>(
    () =>
      graphqlClient.request(FOLLOW_USER, {
        followerId: 1,
        followingId: numericUserId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["followStatus", numericUserId]);
      },
    }
  );

  const unfollowMutation = useMutation(
    () =>
      graphqlClient.request(UNFOLLOW_USER, {
        followerId: 1,
        followingId: numericUserId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["followStatus", numericUserId]);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !userData) return <div>Error loading profile</div>;

  const user = userData.users_by_pk;
  const isFollowing = Boolean(followData?.follows?.length);

  // Transform posts to include user data
  const postsWithUser: PostWithUser[] =
    user.postsCollection?.edges?.map((edge: any) => ({
      ...edge.node,
      user: user,
    })) || [];

  return (
    <div className="max-w-xl mx-auto px-4 pt-20">
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <img
              src={user.profile_picture || "/default-avatar.png"}
              alt={user.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 md:mb-0 md:mr-8"
            />
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center mb-4">
                <h1 className="text-xl font-bold mb-2 md:mb-0 md:mr-4">
                  {user.name}
                </h1>
                <button
                  onClick={() =>
                    isFollowing
                      ? unfollowMutation.mutate()
                      : followMutation.mutate()
                  }
                  disabled={
                    followMutation.isLoading || unfollowMutation.isLoading
                  }
                  className={`px-6 py-1.5 rounded-lg text-sm font-medium ${
                    isFollowing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <span className="font-bold">{postsWithUser.length}</span>
                  <p className="text-gray-600 text-sm">posts</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">
                    {user.followsCollection?.edges?.length || 0}
                  </span>
                  <p className="text-gray-600 text-sm">followers</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">0</span>
                  <p className="text-gray-600 text-sm">following</p>
                </div>
              </div>

              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {postsWithUser.map((post) => (
          <div key={post.id} className="relative pt-[100%]">
            {post.image && (
              <img
                src={post.image}
                alt="Post thumbnail"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
