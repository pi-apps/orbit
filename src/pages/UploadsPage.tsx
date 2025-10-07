import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import {
  addMedia,
  setLastVisibleMedia,
  setHasMoreMedia,
  selectMedia,
  selectLastVisibleMedia,
  selectHasMoreMedia,
  clearMedia,
} from "../store/uploadsSlice";
import orbitProvider from "../backend/OrbitProvider";
import { AppDispatch } from "../store/store";
import { Upload, Image, AlertCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";

const UploadsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const media = useSelector(selectMedia);
  const lastVisible = useSelector(selectLastVisibleMedia);
  const hasMore = useSelector(selectHasMoreMedia);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchMedia = useCallback(
    async (isNew = false) => {
      if ((loading || !hasMore || !userGlobalData?.workspace?.id) && !isNew)
        return;

      setLoading(true);
      try {
        if (!userGlobalData?.workspace?.id) return;
        const { media: newMedia, lastVisible: newLastVisible } =
          await orbitProvider.getMedia(
            userGlobalData.workspace.id,
            isNew ? null : lastVisible
          );
        if (isNew) dispatch(clearMedia());
        dispatch(addMedia(newMedia));
        dispatch(setLastVisibleMedia(newLastVisible));
        if (newMedia.length < 10) {
          dispatch(setHasMoreMedia(false));
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        setError("Failed to fetch media.");
        dispatch(setLastVisibleMedia(null));
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, userGlobalData?.workspace?.id, lastVisible]
  );

  useEffect(() => {
    if (inView && hasMore) {
      fetchMedia();
    }
  }, [inView, hasMore]);

  useEffect(() => {
    if (!media.length) {
      fetchMedia();
    }
  }, [media.length]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !userGlobalData?.user?.uid || !userGlobalData?.workspace?.id)
      return;

    setUploading(true);
    setError(null);
    try {
      await orbitProvider.uploadMedia(
        userGlobalData.user.uid,
        userGlobalData.workspace.id,
        file
      );
      // Refresh the media list
      dispatch(setLastVisibleMedia(null));
      dispatch(setHasMoreMedia(true));
      fetchMedia(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Uploads</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your media assets
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <label className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-700 transition-colors flex items-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload Image"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item, index) => (
            <div
              key={item.id || index}
              className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm text-center p-2">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <p>Loading more media...</p>
          </div>
        )}

        {!hasMore && media.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">You've reached the end.</p>
          </div>
        )}

        {!loading && media.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
            <Image className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No media found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload your first image to get started.
            </p>
          </div>
        )}

        <div ref={ref} />
      </div>
    </div>
  );
};

export default UploadsPage;
