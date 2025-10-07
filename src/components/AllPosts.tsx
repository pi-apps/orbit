import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { PostData } from "../types";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

const AllPosts: React.FC = () => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<string | undefined>(undefined);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMorePosts = useCallback(async () => {
    if (!userGlobalData?.workspace) return;
    setLoading(true);
    try {
      const newPosts = await orbitProvider.getPosts(
        userGlobalData.workspace.id,
        lastVisible
      );
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLastVisible(newPosts[newPosts.length - 1].id);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [userGlobalData?.workspace, lastVisible]);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMorePosts]
  );

  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  return (
    <div className="w-full min-h-0 overflow-hidden">
      <div className="pt-4 ">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
          All Posts
        </h2>

        {/* Grid container with proper mobile handling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-3">
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div
                  ref={lastPostElementRef}
                  key={post.id}
                  className="w-full min-w-0"
                >
                  <PostCard post={post} />
                </div>
              );
            } else {
              return (
                <div key={post.id} className="w-full min-w-0">
                  <PostCard post={post} />
                </div>
              );
            }
          })}
        </div>

        {loading && (
          <div className="flex justify-center my-6 sm:my-8">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-500 my-6 sm:my-8">
            No more posts to load.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
