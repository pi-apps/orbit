import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orbitProvider from "../backend/OrbitProvider";
import { PostData as Post } from "../types";
import {
  Heart,
  MessageCircle,
  Repeat,
  Eye,
  BarChart2,
  Calendar,
  User,
} from "lucide-react";

const PostDetailsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const postData = await orbitProvider.getPost(postId);
          setPost(postData);
          setError(null);
        } catch (err) {
          setError("Failed to fetch post data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">Post not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-slate-500 mr-4" />
            <div>
              <p className="font-semibold text-slate-900">{post.authorId}</p>
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Date not available"}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-800 text-lg whitespace-pre-wrap mb-6">
            {post.text}
          </p>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
              Post Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-100 p-4 rounded-lg">
                <Heart className="w-6 h-6 mx-auto text-red-500 mb-1" />
                <p className="text-xl font-bold text-slate-900">
                  {post.publicMetrics?.likes || 0}
                </p>
                <p className="text-sm text-slate-600">Likes</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <MessageCircle className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <p className="text-xl font-bold text-slate-900">
                  {post.publicMetrics?.comments || 0}
                </p>
                <p className="text-sm text-slate-600">Comments</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <Repeat className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <p className="text-xl font-bold text-slate-900">
                  {post.publicMetrics?.shares || 0}
                </p>
                <p className="text-sm text-slate-600">Shares</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <Eye className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
                <p className="text-xl font-bold text-slate-900">
                  {post.publicMetrics?.views || 0}
                </p>
                <p className="text-sm text-slate-600">Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
