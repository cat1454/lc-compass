"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface TextToSpeechButtonProps {
  textToRead: string;
  className?: string;
  label?: string;
}

export function TextToSpeechButton({
  textToRead,
  className = "",
  label = "Đọc to",
}: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt hiện tại chưa hỗ trợ tính năng Text-to-Speech tự động. Bạn vui lòng sử dụng Google Chrome, Edge hoặc Safari để nghe đọc các bước.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Reset câu đang nói trước đó

    const cleanText = textToRead.replace(/[*_#`]/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95; // Tốc độ hơi chậm một chút để người lớn tuổi nghe rõ

    // Cố gắng chọn giọng đọc tiếng Việt nếu có
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find((v) => v.lang.includes("vi"));
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [isPlaying, textToRead]);

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={isPlaying ? "Dừng đọc" : "Nghe đọc to hướng dẫn"}
      aria-label={isPlaying ? "Dừng đọc âm thanh" : "Nghe đọc to bằng giọng nói"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs sm:text-sm font-medium transition-colors border ${
        isPlaying
          ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-700" />
          <span>Dừng đọc</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
