
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip, Star, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Email } from '@/types';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

const EmailList = ({ emails, selectedEmail, onSelectEmail }: EmailListProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visibleEmails, setVisibleEmails] = useState<Email[]>([]);
  
  // Progressive loading animation
  useEffect(() => {
    if (emails.length > 0) {
      const loadEmails = async () => {
        // Reset visible emails
        setVisibleEmails([]);
        
        // Add emails one by one with a small delay
        for (let i = 0; i < emails.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 20));
          setVisibleEmails(prev => [...prev, emails[i]]);
        }
      };
      
      loadEmails();
    }
  }, [emails]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const emailDate = new Date(date);
    
    // Today's date
    if (emailDate.toDateString() === now.toDateString()) {
      return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // This week
    if (now.getTime() - emailDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return emailDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // This year
    if (emailDate.getFullYear() === now.getFullYear()) {
      return emailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Older
    return emailDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'interested': return 'bg-category-interested';
      case 'spam': return 'bg-category-spam';
      case 'important': return 'bg-category-important';
      default: return 'bg-category-neutral';
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {emails.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center"
          >
            <Clock className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">No emails yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Connect your email accounts to start syncing your messages.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-border"
            >
              {visibleEmails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={cn(
                    "group relative px-4 py-3 transition-colors cursor-pointer",
                    selectedEmail?.id === email.id ? "bg-primary/5" : "hover:bg-secondary/50",
                    !email.isRead && "bg-secondary/30"
                  )}
                  onMouseEnter={() => setHoveredId(email.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelectEmail(email)}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle star logic would go here
                      }}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        )}
                      />
                    </Button>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center min-w-0">
                          <span className={cn(
                            "font-medium truncate",
                            email.isRead ? "text-foreground" : "text-foreground font-semibold"
                          )}>
                            {email.from.name || email.from.email}
                          </span>
                          {email.category && (
                            <div className="ml-2 flex-shrink-0">
                              <span className={cn(
                                "inline-block w-2 h-2 rounded-full",
                                getCategoryColor(email.category)
                              )} />
                            </div>
                          )}
                        </div>
                        <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      
                      <h4 className={cn(
                        "text-sm mb-1 truncate",
                        email.isRead ? "font-normal" : "font-medium"
                      )}>
                        {email.subject}
                      </h4>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <p className="truncate">{email.body.text.substring(0, 100)}</p>
                        
                        {email.attachments.length > 0 && (
                          <span className="ml-2 flex items-center">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {email.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-opacity",
                        hoveredId === email.id || selectedEmail?.id === email.id 
                          ? "opacity-100" 
                          : "opacity-0"
                      )} 
                    />
                  </div>
                  
                  {!email.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EmailList;
