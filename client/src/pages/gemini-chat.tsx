import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, User, Bot, Copy, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code';
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Gemini AI assistant for ParaFort development. I can help you with:\n\n• Debugging code issues\n• Generating React/TypeScript components\n• Fixing form logic and state management\n• Database queries and schema design\n• UI/UX improvements\n• Business logic implementation\n\nWhat would you like help with today?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', {
        message,
        context: {
          projectType: 'ParaFort Business Formation Platform',
          tech: 'React, TypeScript, Express, PostgreSQL, Drizzle ORM, Tailwind CSS',
          currentIssue: 'Form state management and price conversion'
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || data.answer || 'I apologize, but I couldn\'t process your request properly.',
        timestamp: new Date(),
        type: data.response?.includes('```') ? 'code' : 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try rephrasing your question.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  });

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(input);
    setInput('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  const formatMessage = (content: string) => {
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // Code block
          return (
            <div key={index} className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2 mb-2 overflow-x-auto text-sm">
                <code>{part}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(part)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          );
        } else {
          // Regular text
          return <div key={index} className="whitespace-pre-wrap">{part}</div>;
        }
      });
    }
    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-orange-500" />
          Gemini AI Chat
        </h1>
        <p className="text-muted-foreground">
          Conversational AI assistant for ParaFort development and debugging.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-sm">
                      {formatMessage(message.content)}
                    </div>
                    <div className={`text-xs mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your code, forms, or development issues..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={chatMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={chatMutation.isPending || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("My bookkeeping form isn't converting price values from cents to dollars when editing. The form shows large numbers instead of the actual dollar amounts.")}
            >
              <Code className="h-3 w-3 mr-1" />
              Price Conversion Issue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("How can I debug React form state management issues?")}
            >
              Form Debugging
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Generate a utility function to convert between cents and dollars")}
            >
              Generate Helper
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}