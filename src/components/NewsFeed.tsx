import React, { useState } from "react";
import { useInfiniteQuery, QueryFunctionContext, QueryKey } from "react-query";
import { graphqlClient } from "../lib/graphql-client";
import { GET_NEWS_FEED } from "../graphql/queries";
import { Post, User, FeedQueryResponse } from "../types";
import PostCard from "./PostCard";
import InfiniteScroll from "react-infinite-scroll-component";

interface PostWithUser extends Post {
  user: User;
}

interface PageData {
  posts: PostWithUser[];
}

const NewsFeed: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const limit: number = 10;

  const fetchPosts = async ({
    pageParam = 0,
  }: QueryFunctionContext<QueryKey, number>): Promise<PageData> => {
    const response = await graphqlClient.request<FeedQueryResponse>(
      GET_NEWS_FEED,
      {
        limit,
        offset: pageParam * limit,
      }
    );

    const posts = response.postsCollection.edges.map((edge) => {
      //   if (!edge.node.user) {
      //     throw new Error("Post user data is missing");
      //   }

      return {
        ...edge.node,
      } as PostWithUser;
    });
    console.log("postss", posts);

    return { posts };
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    PageData,
    Error
  >("newsFeed", fetchPosts, {
    getNextPageParam: (lastPage, pages): number | undefined => {
      return lastPage.posts.length === limit ? pages.length : undefined;
    },
  });

  const posts: PostWithUser[] = data?.pages.flatMap((page) => page.posts) || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<div>Loading more posts...</div>}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default NewsFeed;
