import React from "react";

const ImagesUpload = ({
  images,
  onInputChange,
  handleDrop,
  handleImageLoaded,
  removeImage,
}) => {
  return (
    <>
      {/* IMAGES */}
      <h2 className="text-lg font-medium mt-6 mb-3">
        Images
      </h2>

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
      >
        <input
          id="image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          className="hidden"
        />

        <label htmlFor="image-input" className="cursor-pointer">
          <div className="py-6">
            <div className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md">
              Browse Images
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Drag & drop or click to browse (max 10). JPG / PNG / WEBP / GIF
          </p>
        </label>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {images.map((it, idx) => (
            <div
              key={it.id}
              className="relative rounded-lg overflow-hidden img-zoom shadow-sm bg-white"
            >
              {/* Shimmer */}
              {!it.loaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}

              <img
                src={it.url}
                alt={`preview-${idx}`}
                onLoad={() => handleImageLoaded(it.id)}
                className={`w-full h-32 object-cover ${
                  it.loaded
                    ? "opacity-100 transition-opacity duration-300"
                    : "opacity-0"
                }`}
              />

              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImagesUpload;
