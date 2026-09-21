"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  className = "",
  disabled = false,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech =
        "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      setIsSupported(hasSpeech);
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    // @ts-expect-error - WebkitSpeechRecognition vendor prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt hiện tại chưa hỗ trợ Web Speech API. Bạn vui lòng sử dụng Google Chrome hoặc Microsoft Edge để nói trực tiếp vào ô tìm kiếm!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        if (err.error === "not-allowed") {
          alert("Vui lòng cho phép quyền Microphone trên trình duyệt để sử dụng tìm kiếm bằng giọng nói.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech recognition could not be started", e);
      setIsListening(false);
    }
  }, [onTranscript]);

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={disabled || isListening}
      title={isListening ? "Đang lắng nghe..." : "Nói để tìm kiếm (Hỗ trợ giọng Quảng - Đà Nẵng)"}
      aria-label={isListening ? "Đang lắng nghe..." : "Nói để tìm kiếm"}
      className={`relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isListening
          ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-200"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 border border-blue-200"
      } ${className}`}
    >
      {isListening ? (
        <span className="flex items-center gap-1.5 px-2 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang nghe...</span>
        </span>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
