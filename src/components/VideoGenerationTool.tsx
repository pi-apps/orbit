// src/components/VideoGenerationTool.tsx
import { useState } from 'react';
import { Upload, Wand2, Video as VideoIcon } from 'lucide-react';
import orbitProvider from "../backend/OrbitProvider";

const VideoGenerationTool = () => {
    const [prompt, setPrompt] = useState('');
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideos, setGeneratedVideos] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setInputFile(file);
            // For video, we can't show a preview as easily as an image.
            // We'll just show the file name.
            setPreviewUrl(file.name);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("A prompt is required to generate a video.");
            return;
        }

        setIsGenerating(true);
        setGeneratedVideos([]);

        try {
            // The getVideosFromAI function in OrbitProvider supports an optional image file.
            const resultFiles = await orbitProvider.getVideosFromAI(prompt, inputFile || undefined);
            setGeneratedVideos(resultFiles);
        } catch (error) {
            console.error("Failed to generate video:", error);
            alert("Sorry, we couldn't generate the video. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                Video Generation
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Input Panel */}
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the video you want to create..."
                            className="w-full h-28 sm:h-32 p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload Image for Video (Optional)
                        </label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <p className="text-sm text-slate-500">{previewUrl}</p>
                                ) : (
                                    <VideoIcon className="mx-auto h-12 w-12 text-slate-400" />
                                )}
                                <div className="flex text-sm text-slate-600">
                                    <label
                                        htmlFor="video-file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload an image</span>
                                        <input id="video-file-upload" name="video-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">to animate</p>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          Generate Video
                        </>
                      )}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Generated Video</h3>
                    <div className="w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                        {isGenerating ? (
                             <div className="text-center text-slate-500">
                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                                <p>Generating your video...</p>
                            </div>
                        ) : generatedVideos.length > 0 ? (
                            <video src={URL.createObjectURL(generatedVideos[0])} controls className="max-w-full max-h-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-center text-slate-500">
                                <VideoIcon className="mx-auto h-16 w-16 opacity-50 mb-2"/>
                                <p>Your generated video will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoGenerationTool;
