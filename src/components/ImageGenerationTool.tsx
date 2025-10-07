// src/components/ImageGenerationTool.tsx
import { useState } from 'react';
import { Upload, Wand2, Image as ImageIcon } from 'lucide-react';
import orbitProvider from "../backend/OrbitProvider";

const ImageGenerationTool = () => {
    const [prompt, setPrompt] = useState('');
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setInputFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            // If there's an image, prompt is mandatory. If no image, still need a prompt.
            alert("A prompt is required to generate an image.");
            return;
        }

        setIsGenerating(true);
        setGeneratedImages([]);

        try {
            let resultFiles: File[] = [];
            if (inputFile) {
                // Editing an existing image
                const editedImage = await orbitProvider.editImageWithAI(inputFile, prompt);
                resultFiles = [editedImage];
            } else {
                // Generating a new image
                resultFiles = await orbitProvider.getImagesFromAI(prompt, 1);
            }
            setGeneratedImages(resultFiles);
        } catch (error) {
            console.error("Failed to generate image:", error);
            alert("Sorry, we couldn't generate the image. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                Image Generation
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
                            placeholder="Describe the image you want to create or the edits you want to make..."
                            className="w-full h-28 sm:h-32 p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload Image (Optional)
                        </label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto" />
                                ) : (
                                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                                )}
                                <div className="flex text-sm text-slate-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
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
                          Generate Image
                        </>
                      )}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Generated Image</h3>
                    <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                        {isGenerating ? (
                             <div className="text-center text-slate-500">
                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                                <p>Generating your image...</p>
                            </div>
                        ) : generatedImages.length > 0 ? (
                            <img src={URL.createObjectURL(generatedImages[0])} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-center text-slate-500">
                                <ImageIcon className="mx-auto h-16 w-16 opacity-50 mb-2"/>
                                <p>Your generated image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationTool;
