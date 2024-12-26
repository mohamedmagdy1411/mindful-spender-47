import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { BaseProps } from "@/types/props";
import { useConversation } from "@11labs/react";

interface AIAssistantProps extends BaseProps {
  onAddTransaction: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => void;
}

export const AIAssistant = ({ className, onAddTransaction }: AIAssistantProps) => {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const conversation = useConversation();

  const processActivity = async (activity: string) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are a financial assistant that helps users track their expenses and income. 
              Extract financial transactions from the user's daily activities.
              Respond in JSON format with an array of transactions, each containing:
              - type: "income" or "expense"
              - amount: number (in USD)
              - category: string
              Example: {"transactions": [{"type": "expense", "amount": 25, "category": "Food"}]}`
            },
            {
              role: 'user',
              content: activity
            }
          ],
          temperature: 0.2
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process activity');
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);
      
      if (aiResponse.transactions && aiResponse.transactions.length > 0) {
        aiResponse.transactions.forEach((transaction: any) => {
          onAddTransaction(transaction);
        });
        toast.success("Transactions added successfully!");
      } else {
        toast.info("No financial transactions found in the activity");
      }
    } catch (error) {
      console.error('Error processing activity:', error);
      toast.error("Failed to process activity. Please try again.");
    } finally {
      setIsProcessing(false);
      setText("");
    }
  };

  const startVoiceRecording = async () => {
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    try {
      await conversation.startSession({
        agentId: "default", // Replace with your ElevenLabs agent ID
        overrides: {
          agent: {
            prompt: {
              prompt: "You are a helpful financial assistant. Listen to the user's daily activities and respond with relevant financial transactions.",
            },
            firstMessage: "Hi! Tell me about your financial activities today.",
            language: "ar",
          },
          tts: {
            voiceId: "21m00Tcm4TlvDq8ikWAM" // Arabic voice
          },
        },
      });
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast.error("Failed to start voice recording");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">AI Financial Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tell me about your day</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: I went to the supermarket and spent $50 on groceries, then received my salary of $3000"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => processActivity(text)}
              disabled={isProcessing || !text || !apiKey}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Process Text
            </Button>
            
            {conversation.status !== "connected" ? (
              <Button
                onClick={startVoiceRecording}
                disabled={isProcessing || !apiKey}
                variant="secondary"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Voice
              </Button>
            ) : (
              <Button
                onClick={() => conversation.endSession()}
                variant="destructive"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Voice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};