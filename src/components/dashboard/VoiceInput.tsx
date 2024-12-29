import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  isListening: boolean;
  onToggle: () => void;
}

export const VoiceInput = ({ isListening, onToggle }: VoiceInputProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-2 bottom-2"
      onClick={onToggle}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4 text-gray-500" />
      )}
    </Button>
  );
};