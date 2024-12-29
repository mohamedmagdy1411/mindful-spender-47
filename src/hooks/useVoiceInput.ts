import { useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { toast } from "sonner";

export const useVoiceInput = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const conversation = useConversation({
    onMessage: (message: any) => {
      if (message.message && typeof message.message === 'string') {
        onTranscript(message.message);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast.error('فشل في المحادثة');
      setIsListening(false);
    }
  });

  useEffect(() => {
    return () => {
      if (isListening) {
        conversation.endSession();
      }
    };
  }, [isListening, conversation]);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      return false;
    }
  };

  const toggleVoiceInput = async () => {
    try {
      if (isListening) {
        await conversation.endSession();
        setIsListening(false);
        toast.success('تم إيقاف التسجيل');
      } else {
        const hasPermission = await checkMicrophonePermission();
        
        if (!hasPermission) {
          toast.error('يرجى السماح بالوصول إلى الميكروفون في إعدادات المتصفح');
          return;
        }

        await conversation.startSession({
          agentId: "21m00Tcm4TlvDq8ikWAM",
          overrides: {
            agent: {
              language: "ar"
            },
            tts: {
              voiceId: "21m00Tcm4TlvDq8ikWAM"
            }
          }
        });
        setIsListening(true);
        toast.success('جارٍ الاستماع...');
      }
    } catch (error) {
      console.error('Error toggling voice input:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error('يرجى السماح بالوصول إلى الميكروفون في إعدادات المتصفح');
      } else {
        toast.error('فشل في تشغيل الميكروفون. يرجى المحاولة مرة أخرى');
      }
      setIsListening(false);
    }
  };

  return {
    isListening,
    toggleVoiceInput,
    conversation
  };
};