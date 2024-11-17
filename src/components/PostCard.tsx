import React from "react";
import { Link } from "react-router-dom";
import { Post, User } from "../types";

interface PostCardProps {
  post: Post & { user: User };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 max-w-xl mx-auto">
      <div className="flex items-center p-3 border-b">
        <Link
          to={`/profile/${post.user_id}`}
          className="flex items-center flex-1"
        >
          {/* <img
            src={post.user.profile_picture || "/default-avatar.png"}
            alt={post.user.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold text-sm hover:underline">
            {post.user.name}
          </span> */}
        </Link>
        <button className="text-gray-600 hover:text-gray-800">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {post.image && (
        <div className="relative pt-[100%] bg-gray-100">
          <img
            src={post.image}
            alt="Post content"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-3">
        <div className="flex space-x-4 mb-2">
          <button className="text-gray-800 hover:text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button className="text-gray-800 hover:text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm mb-2">
          {/* <span className="font-semibold mr-2">{post.user.name}</span> */}
          {post.content}
        </p>

        {post.tagged_users.length > 0 && (
          <div className="text-xs text-blue-600 mb-1">
            Tagged: {post.tagged_users.join(", ")}
          </div>
        )}

        <div className="text-xs text-gray-500">
          {formatDate(post.created_at)}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
