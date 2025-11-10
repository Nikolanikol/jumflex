"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    // Проверка на максимальное количество
    if (images.length + files.length > maxImages) {
      alert(`Максимум ${maxImages} изображений`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Ошибка загрузки");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Ошибка загрузки изображений");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-dark hover:border-primary/50 bg-lighter"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {uploading ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload size={28} className="text-primary" />
            )}
          </div>

          <div>
            <p className="text-white font-semibold mb-1">
              {uploading
                ? "Загрузка..."
                : "Перетащите изображения или нажмите для выбора"}
            </p>
            <p className="text-sm text-secondary">
              JPG, PNG, WEBP до 5MB (макс. {maxImages} изображений)
            </p>
          </div>

          {images.length > 0 && (
            <p className="text-xs text-muted">
              Загружено: {images.length} / {maxImages}
            </p>
          )}
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-lighter border-2 border-dark"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-dark/80 hover:bg-dark rounded-lg transition-all"
                    title="Переместить влево"
                  >
                    <span className="text-white">←</span>
                  </button>
                )}

                {/* Remove */}
                <button
                  onClick={() => removeImage(index)}
                  className="p-2 bg-accent/80 hover:bg-accent rounded-lg transition-all"
                  title="Удалить"
                >
                  <X size={18} className="text-white" />
                </button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-dark/80 hover:bg-dark rounded-lg transition-all"
                    title="Переместить вправо"
                  >
                    <span className="text-white">→</span>
                  </button>
                )}
              </div>

              {/* Main Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 rounded text-xs font-semibold text-black">
                  Главное
                </div>
              )}

              {/* Order Badge */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-dark/80 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-lighter rounded-lg">
        <p className="text-xs text-secondary leading-relaxed">
          💡 <strong>Совет:</strong> Первое изображение будет главным в карточке
          товара. Вы можете изменить порядок изображений с помощью стрелок при
          наведении.
        </p>
      </div>
    </div>
  );
}
