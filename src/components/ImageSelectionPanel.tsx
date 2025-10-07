import React, { useState, useCallback, useEffect } from "react";
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
import { X, Check } from "lucide-react";
import eventBus from "../utils/eventBus";

interface ImageSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (images: string[]) => void;
  selectedImages: string[];
}

const ImageSelectionPanel: React.FC<ImageSelectionPanelProps> = ({
  isOpen,
  onClose,
  onSelectImages,
  selectedImages: initialSelectedImages,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const media = useSelector(selectMedia);
  const lastVisible = useSelector(selectLastVisibleMedia);
  const hasMore = useSelector(selectHasMoreMedia);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(initialSelectedImages);

  const fetchMedia = useCallback(async () => {
    if (loading || !hasMore || !userGlobalData?.workspace?.id) return;

    setLoading(true);
    setError(null);
    try {
      const { media: newMedia, lastVisible: newLastVisible } =
        await orbitProvider.getMedia(userGlobalData.workspace.id, lastVisible);
      dispatch(addMedia(newMedia));
      dispatch(setLastVisibleMedia(newLastVisible));
      if (newMedia.length < 10) {
        dispatch(setHasMoreMedia(false));
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      setError("Failed to fetch media.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, hasMore, userGlobalData?.workspace?.id, lastVisible]);

  useEffect(() => {
    if (isOpen) {
      eventBus.emit("fullscreen:enter");
      dispatch(clearMedia());
      dispatch(setLastVisibleMedia(null));
      dispatch(setHasMoreMedia(true));
      fetchMedia();
    }
    return () => {
      if (isOpen) {
        eventBus.emit("fullscreen:exit");
      }
    };
  }, [isOpen, dispatch, fetchMedia]);

  const handleSelect = (url: string) => {
    if (selected.includes(url)) {
      setSelected(selected.filter((item) => item !== url));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, url]);
      }
    }
  };

  const handleDone = () => {
    onSelectImages(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Select Images</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 h-[calc(100%-128px)] overflow-y-auto">
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-3 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="relative cursor-pointer"
                onClick={() => handleSelect(item.url)}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {selected.includes(item.url) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {loading && <p>Loading...</p>}
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionPanel;
