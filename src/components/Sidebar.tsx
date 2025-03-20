
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  Star,
  Send,
  Trash2,
  Tag,
  Settings,
  Mail,
  AlertCircle,
  ArchiveX,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: () => void;
  onSync: () => void;
  accounts: { id: string; email: string; unread: number }[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string | null) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  onAddAccount,
  onSync,
  accounts,
  selectedAccount,
  onSelectAccount,
}: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isSyncing, setIsSyncing] = useState(false);
  
  
  const sidebarVariants = {
    hidden: { x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const handleSync = () => {
    setIsSyncing(true);
    onSync();
    // Simulate sync completion after 2 seconds
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const navItems = [
    { icon: Inbox, label: 'Inbox', count: 12 },
    { icon: Star, label: 'Starred', count: 3 },
    { icon: Send, label: 'Sent', count: 0 },
    { icon: AlertCircle, label: 'Important', count: 5 },
    { icon: ArchiveX, label: 'Spam', count: 8 },
    { icon: Trash2, label: 'Trash', count: 0 },
  ];

  const categories = [
    { label: 'Interested', color: 'bg-category-interested', count: 7 },
    { label: 'Important', color: 'bg-category-important', count: 4 },
    { label: 'Neutral', color: 'bg-category-neutral', count: 15 },
    { label: 'Spam', color: 'bg-category-spam', count: 3 },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed top-0 left-0 h-full z-50 w-64 bg-white dark:bg-slate-950 shadow-subtle",
              "flex flex-col border-r border-border",
              isMobile ? "pt-4" : "pt-20"
            )}
          >
            {/* Close button that's always visible, not just on mobile */}
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">
                  <span className="font-semibold text-sm">OB</span>
                </div>
                <h1 className="text-lg font-semibold text-foreground">Onebox</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {/* Accounts section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-muted-foreground">Accounts</h2>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={handleSync}
                      disabled={isSyncing}
                    >
                      <RefreshCw className={cn(
                        "h-4 w-4", 
                        isSyncing && "animate-spin-slow"
                      )} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={onAddAccount}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Button
                    variant={selectedAccount === null ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onSelectAccount(null)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>All accounts</span>
                  </Button>
                  
                  {accounts.map((account) => (
                    <Button
                      key={account.id}
                      variant={selectedAccount === account.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onSelectAccount(account.id)}
                    >
                      <div className="flex-1 flex items-center overflow-hidden">
                        <Mail className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{account.email}</span>
                      </div>
                      {account.unread > 0 && (
                        <Badge variant="outline" className="ml-auto">
                          {account.unread}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Main navigation */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Folders
                </h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span className="flex-1">{item.label}</span>
                      {item.count > 0 && (
                        <Badge variant="outline">{item.count}</Badge>
                      )}
                    </Button>
                  ))}
                </nav>
              </div>
              
              {/* Categories */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Categories
                </h2>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Button
                      key={category.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <span className={cn("w-2 h-2 rounded-full mr-2", category.color)} />
                      <span className="flex-1">{category.label}</span>
                      {category.count > 0 && (
                        <Badge variant="outline">{category.count}</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar footer */}
            <div className="border-t border-border p-3">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
