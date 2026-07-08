"use client";

import { useState, useEffect } from "react";
import { vapi } from "@/lib/vapi";
//DO DODANIA/ AKTUALNIE OFF//
export const useVapi = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallStart = () => {
      setIsCallActive(true);
      setIsLoading(false);
      setError(null);
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      setIsLoading(false);
    };

    const handleError = (error: any) => {
      setError(error.message || "An error occurred");
      setIsLoading(false);
      setIsCallActive(false);
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
    };
  }, []);

  const startCall = async (assistantId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await vapi.start(assistantId);
    } catch (err: any) {
      setError(err.message || "Failed to start call");
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    try {
      await vapi.stop();
    } catch (err: any) {
      setError(err.message || "Failed to end call");
    }
  };

  return {
    isCallActive,
    isLoading,
    error,
    startCall,
    endCall,
  };
};
