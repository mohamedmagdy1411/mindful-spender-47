import { useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { toast } from "sonner";

export const useVoiceInput = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const conversation = useConversation({
    overrides: {
      tts: {
        voiceId: "21m00Tcm4TlvDq8ikWAM" // Using Arabic voice
      },
      agent: {
        language: "ar"
      }
    },
    onMessage: (message) => {
      if (message.message && typeof message.message === 'string') {
        onTranscript(message.message);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast.error('حدث خطأ في المحادثة');
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

  const toggleVoiceInput = async () => {
    try {
      if (isListening) {
        await conversation.endSession();
        setIsListening(false);
      } else {
        // First check if microphone permission is already granted
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMicrophonePermission = devices.some(device => device.kind === 'audioinput' && device.label);
        
        if (!hasMicrophonePermission) {
          // Request microphone permission explicitly
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we just needed the permission
          stream.getTracks().forEach(track => track.stop());
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
        toast.error('يرجى السماح بالوصول إلى الميكروفون');
      } else {
        toast.error('فشل في تشغيل الميكروفون');
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