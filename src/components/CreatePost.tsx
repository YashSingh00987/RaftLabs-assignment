import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import { graphqlClient } from "../lib/graphql-client";
import { CREATE_POST } from "../graphql/mutations";
import { CreatePostInput, Post, User } from "../types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase-client";
import { Combobox } from "@headlessui/react";

interface CreatePostResponse {
  insert_posts_one: Post;
}

const CreatePost: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch users for tagging
  const searchUsers = async (searchQuery: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("name", `%${searchQuery}%`)
      .limit(5);

    if (data) {
      setUsers(data);
    }
  };

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });

  const uploadImage = async (file: File): Promise<string> => {
    // Create unique filename
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${file.name
      .split(".")
      .pop()}`;

    // Upload with correct configuration
    const { data, error } = await supabase.storage
      .from("posts")
      .upload(`public/${fileName}`, file, {
        cacheControl: "0",
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(`public/${fileName}`);

    return publicUrl;
  };

  const createPostMutation = useMutation<
    CreatePostResponse,
    Error,
    CreatePostInput
  >(
    async (postData: CreatePostInput) => {
      return graphqlClient.request(CREATE_POST, postData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("newsFeed");
        navigate("/");
      },
    }
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }

      //   const postData: CreatePostInput = {
      //     content,
      //     user_id: 1, // Replace with actual user ID from auth
      //     tagged_users: selectedUsers.map((user) => user.id),
      //     image: imageUrl || null,
      //   };

      //   await createPostMutation.mutateAsync(postData);
      const postData: CreatePostInput = {
        objects: [
          {
            content,
            user_id: 1,
            tagged_users: selectedUsers.map((user) => user.id),
            image: imageUrl || null,
          },
        ],
      };

      await createPostMutation.mutateAsync(postData);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-20">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Create New Post</h2>
        </div>
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            placeholder="What's on your mind?"
            required
          />

          {/* User Tagging Component */}
          <div className="mb-4">
            <Combobox
              value={selectedUsers}
              onChange={setSelectedUsers}
              multiple
            >
              <Combobox.Input
                className="w-full p-2 border rounded-lg"
                placeholder="Tag people..."
                onChange={(event) => {
                  setQuery(event.target.value);
                  searchUsers(event.target.value);
                }}
              />
              <Combobox.Options className="mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg">
                {filteredUsers.map((user) => (
                  <Combobox.Option
                    key={user.id}
                    value={user}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? "bg-blue-600 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {user.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>

            {/* Display selected users */}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUsers(
                        selectedUsers.filter((u) => u.id !== user.id)
                      )
                    }
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isUploading || createPostMutation.isLoading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isUploading ? "Uploading..." : "Share Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
