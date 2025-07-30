
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatResponse } from '@/app/actions/chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getChatResponse({ message: inputValue });
      const botMessage: Message = { text: response.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { text: 'Sorry, something went wrong.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-[28rem] bg-card rounded-2xl shadow-xl flex flex-col glassmorphism overflow-hidden mb-4"
          >
            <header className="p-4 flex items-center justify-between border-b border-border">
              <h3 className="font-bold text-lg text-card-foreground">Support Chat</h3>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </header>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.sender === 'bot' && (
                       <Avatar className="h-8 w-8">
                         <AvatarFallback><Bot /></AvatarFallback>
                       </Avatar>
                    )}
                    <div className={cn("max-w-[80%] rounded-xl px-3 py-2 text-sm", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      {msg.text}
                    </div>
                     {msg.sender === 'user' && (
                       <Avatar className="h-8 w-8">
                         <AvatarFallback><User /></AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                ))}
                 {isLoading && (
                  <div className="flex items-end gap-2 justify-start">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                     </Avatar>
                     <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm bg-muted">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-0"></span>
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150"></span>
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-300"></span>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <footer className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
        </Button>
      </motion.div>
    </div>
  );
}
