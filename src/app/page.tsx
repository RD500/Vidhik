'use client';

import { useState, useMemo } from 'react';
import Chat from '@/components/chat';
import DocumentViewer from '@/components/document-viewer';
import FileUpload from '@/components/file-upload';
import DocumentComparison from '@/components/document-comparison';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  FileText,
  LayoutGrid,
  Settings,
  HelpCircle,
  LogOut,
  Scale,
  Trash2,
  PlusSquare,
  GitCompareArrows,
  History as HistoryIcon,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeDocument } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DemystifyDocumentOutput } from '@/ai/flows/demystify-document';
import { CompareDocumentsOutput } from '@/ai/flows/compare-documents';
import type { Message } from '@/components/chat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { GradientCard } from '@/components/ui/gradient-card';
import { Input } from '@/components/ui/input';
import Logo from '@/components/logo';
import Faq from '@/components/faq';


export type Document = {
  name: string;
  content: string;
};

export type DisplayDocument = Document & {
    summary?: string;
};

export type AnalysisResult = DemystifyDocumentOutput;
export type ComparisonResult = CompareDocumentsOutput;

type ChatHistoryItem = {
    type: 'chat';
    id: number;
    document: Document;
    analysis: AnalysisResult | null;
    messages: Message[];
};

type CompareHistoryItem = {
    type: 'compare';
    id: number;
    documentA: Document;
    documentB: Document;
    comparison: ComparisonResult | null;
};

export type HistoryItem = ChatHistoryItem | CompareHistoryItem;

type AppMode = 'chat' | 'compare' | 'my-documents' | 'faq';


function AppSidebar({ onSwitchMode, activeMode, onNewSession, searchQuery, setSearchQuery }: { onSwitchMode: (mode: AppMode) => void, activeMode: AppMode, onNewSession: () => void, searchQuery: string, setSearchQuery: (query: string) => void }) {
    return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <div className="flex h-full flex-col bg-[#111317] text-gray-300">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-700 px-4">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-xl font-semibold text-white">
            Vidhik
          </h1>
        </div>
        <div className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search..."
                    className="pl-9 bg-gray-800 border-gray-700 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-2 p-4 pt-0">
            <Button
              variant="ghost"
              className={cn(`justify-start gap-3`, activeMode === 'chat' ? 'bg-gray-700/50 text-white' : '')}
              onClick={() => onSwitchMode('chat')}
            >
              <FileText className={cn("h-5 w-5", activeMode === 'chat' && 'text-primary')} />
              <span>AI Document Helper</span>
            </Button>
            <Button
              variant="ghost"
              className={cn(`justify-start gap-3`, activeMode === 'compare' ? 'bg-gray-700/50 text-white' : '')}
              onClick={() => onSwitchMode('compare')}
            >
              <GitCompareArrows className={cn("h-5 w-5", activeMode === 'compare' && 'text-primary')} />
              <span>Compare Documents</span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3"
              onClick={onNewSession}
            >
              <PlusSquare className="h-5 w-5" />
              <span>New Session</span>
            </Button>
            <Button
              variant="ghost"
              className={cn(`justify-start gap-3`, activeMode === 'my-documents' ? 'bg-gray-700/50 text-white' : '')}
              onClick={() => onSwitchMode('my-documents')}>
              <LayoutGrid className={cn("h-5 w-5", activeMode === 'my-documents' && 'text-primary')} />
              <span>My Documents</span>
            </Button>
            <Button
              variant="ghost"
              className={cn(`justify-start gap-3`, activeMode === 'faq' ? 'bg-gray-700/50 text-white' : '')}
              onClick={() => onSwitchMode('faq')}>
              <HelpCircle className={cn("h-5 w-5", activeMode === 'faq' && 'text-primary')} />
              <span>Info & FAQ</span>
            </Button>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-3">
                <Scale />
                <h3 className="text-lg font-semibold">Demystifying Legal Documents</h3>
              </div>
              <p className="text-sm text-orange-100">
                Upload a document to get a simple explanation of complex legal terms.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="border-t border-gray-700 p-4">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}

type HistoryPanelProps = {
    history: HistoryItem[];
    activeSessionId: number | null;
    onSelectSession: (id: number) => void;
    onClearHistory: () => void;
    searchQuery: string;
};

function HistoryPanel({ history, activeSessionId, onSelectSession, onClearHistory, searchQuery }: HistoryPanelProps) {
    const filteredHistory = history.filter(item => {
        const query = searchQuery.toLowerCase();
        if (item.type === 'chat') {
            return item.document.name.toLowerCase().includes(query);
        } else {
            return item.documentA.name.toLowerCase().includes(query) || item.documentB.name.toLowerCase().includes(query);
        }
    });

    return (
      <aside className="hidden w-80 flex-col border-l bg-card p-4 lg:flex">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">History</h2>
          <span className="text-sm text-muted-foreground">{filteredHistory.length}/{history.length}</span>
        </div>
        <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {filteredHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSession(item.id)}
              className={`flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted ${
                item.id === activeSessionId ? 'bg-muted' : ''
              }`}
            >
              {item.type === 'chat' ? <FileText className="mt-1 h-4 w-4 shrink-0" /> : <GitCompareArrows className="mt-1 h-4 w-4 shrink-0" />}
              <div>
                <p className="font-medium truncate">
                    {item.type === 'chat'
                        ? item.document.name
                        : `Compare: ${item.documentA.name} vs ${item.documentB.name}`
                    }
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.type === 'chat'
                    ? (item.analysis?.summary ? item.analysis.summary.substring(0, 70) + '...' : 'Awaiting analysis...')
                    : (item.comparison?.summary ? item.comparison.summary.substring(0, 70) + '...' : 'Awaiting comparison...')
                  }
                </p>
              </div>
            </button>
          ))}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="outline" className="mt-4 w-full" disabled={history.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearHistory}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </aside>
    );
  }

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('chat');
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const activeSession = history.find((item) => item.id === activeSessionId) || null;

  const allDocuments = useMemo(() => {
    const docs = new Map<string, DisplayDocument>();
    history.forEach(item => {
        if (item.type === 'chat') {
            const key = `${item.document.name}-${item.document.content}`;
            if (!docs.has(key) || (docs.has(key) && !docs.get(key)?.summary && item.analysis?.summary)) {
                docs.set(key, { ...item.document, summary: item.analysis?.summary });
            }
        } else {
            const keyA = `${item.documentA.name}-${item.documentA.content}`;
            // For comparison docs, we don't have a direct summary, so we add a generic note
            if (!docs.has(keyA)) {
                docs.set(keyA, { ...item.documentA, summary: 'This document was used in a comparison.' });
            }
            const keyB = `${item.documentB.name}-${item.documentB.content}`;
            if (!docs.has(keyB)) {
                docs.set(keyB, { ...item.documentB, summary: 'This document was used in a comparison.' });
            }
        }
    });
    return Array.from(docs.values());
  }, [history]);

  const handleDocumentSelect = (document: Document) => {
    const newSession: ChatHistoryItem = {
        id: Date.now(),
        type: 'chat',
        document,
        analysis: null,
        messages: [],
    };
    setMode('chat');
    setHistory(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsChatVisible(false); // Reset chat visibility on new document
  };

  const handleDemystify = async () => {
    if (!activeSession || activeSession.type !== 'chat') return;
    setIsLoading(true);

    const result = await analyzeDocument(activeSession.document.content);

    if (result.error) {
      toast({
        title: 'Analysis Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
        setHistory(prev => prev.map(item =>
            item.id === activeSessionId
            ? { ...item, analysis: result.analysis! }
            : item
        ));
    }
    setIsLoading(false);
  };

  const handleComparisonComplete = (documentA: Document, documentB: Document, comparison: ComparisonResult) => {
    const newSession: CompareHistoryItem = {
      id: Date.now(),
      type: 'compare',
      documentA,
      documentB,
      comparison,
    };
    setHistory(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveSessionId(null);
    toast({
        title: 'History Cleared',
        description: 'Your session history has been deleted.',
    });
  };

  const handleSwitchMode = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode !== 'chat' && newMode !== 'compare') {
      setActiveSessionId(null);
    }
    setIsChatVisible(false); // Hide chat when switching modes
  };

  const handleSelectSession = (id: number) => {
    const session = history.find(s => s.id === id);
    if (session) {
        setMode(session.type);
        setActiveSessionId(id);
        setIsChatVisible(session.type === 'chat'); // Show chat if it's a chat session
    }
  }

  const handleNewSession = () => {
    setIsNewSessionDialogOpen(true);
  };

  const handleStartNewSession = (newMode: AppMode) => {
    setMode(newMode);
    setActiveSessionId(null);
    setIsNewSessionDialogOpen(false);
    setIsChatVisible(false);
  };

  const handleSelectDocumentFromList = (doc: Document) => {
    handleDocumentSelect(doc);
  };


  const AnalysisLoadingSkeleton = () => (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-1/4 mt-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );


  const ChatView = () => (
    <div className='flex flex-1'>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">AI Document Helper</h1>
          <div className="flex items-center gap-2">
            {activeSession?.type === 'chat' && activeSession.analysis && (
              <Button variant="ghost" size="icon" onClick={() => setIsChatVisible(!isChatVisible)}>
                  <MessageSquare className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
              <HistoryIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className={cn("grid flex-1 gap-4 overflow-hidden p-4", isChatVisible ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
          <GradientCard className="h-full min-h-0 flex flex-col">
            {!activeSession && <FileUpload onDocumentSelect={handleDocumentSelect} />}
            {activeSession?.type === 'chat' && !activeSession.analysis && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-headline text-lg font-semibold">
                  {activeSession.document.name}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ready to be demystified.
                </p>
                <Button onClick={handleDemystify} className="mt-6">
                  Demystify Document
                </Button>
              </div>
            )}
            {isLoading && (
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Analyzing...</h2>
                    <AnalysisLoadingSkeleton />
                </div>
            )}
            {activeSession?.type === 'chat' && activeSession.analysis && !isLoading && (
              <DocumentViewer document={activeSession.document} analysis={activeSession.analysis} />
            )}
          </GradientCard>
          {isChatVisible && (
            <GradientCard className="h-full min-h-0 flex-col hidden md:flex">
              <Chat
                  key={activeSessionId} // Add key to force re-mount on session change
                  session={activeSession?.type === 'chat' ? activeSession : null}
                  searchQuery={searchQuery}
                  onMessagesChange={(messages) => {
                      if (activeSessionId !== null && activeSession?.type === 'chat') {
                          setHistory(prev => prev.map(item =>
                              item.id === activeSessionId
                              ? { ...item, messages }
                              : item
                          ));
                      }
                  }}
              />
            </GradientCard>
          )}
        </main>
      </div>
      {isHistoryVisible && (
        <HistoryPanel
            history={history}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onClearHistory={handleClearHistory}
            searchQuery={searchQuery}
        />
      )}
    </div>
  );

  const CompareView = () => (
    <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center justify-between border-b px-6">
                <h1 className="text-lg font-semibold">Compare Documents</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
                    <HistoryIcon className="h-5 w-5" />
                </Button>
            </header>
            <main className="flex-1 overflow-auto p-4">
                <DocumentComparison
                    key={activeSessionId}
                    session={activeSession?.type === 'compare' ? activeSession : null}
                    onComparisonComplete={handleComparisonComplete}
                />
            </main>
        </div>
        {isHistoryVisible && (
            <HistoryPanel
                history={history}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onClearHistory={handleClearHistory}
                searchQuery={searchQuery}
            />
        )}
    </div>
  );

  const MyDocumentsView = () => {
    const filteredDocuments = allDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center justify-between border-b px-6">
                <h1 className="text-lg font-semibold">My Documents</h1>
            </header>
            <main className="flex-1 overflow-auto p-6">
                {filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDocuments.map((doc, index) => (
                            <Card
                                key={index}
                                className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleSelectDocumentFromList(doc)}
                            >
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <CardTitle className="text-base font-medium truncate" title={doc.name}>
                                        {doc.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 text-sm text-muted-foreground">
                                    <p className="line-clamp-3">
                                        {doc.summary || "Click to open this document in the AI Document Helper."}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <LayoutGrid className="h-12 w-12" />
                        <h2 className="mt-6 text-xl font-semibold">
                            {searchQuery ? 'No Matching Documents' : 'No Documents Found'}
                        </h2>
                        <p className="mt-2">
                            {searchQuery
                                ? 'Try a different search term.'
                                : 'Start by uploading a document in the "AI Document Helper" to see it here.'
                            }
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
  };
  
  const FaqView = () => (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-lg font-semibold">Information & FAQ</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
            <Faq onStartSession={handleNewSession} />
        </div>
      </main>
    </div>
  );

  const renderContent = () => {
    switch(mode) {
        case 'chat':
            return <ChatView />;
        case 'compare':
            return <CompareView />;
        case 'my-documents':
            return <MyDocumentsView />;
        case 'faq':
            return <FaqView />;
        default:
            return <ChatView />;
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background text-foreground">
        <AppSidebar
            onSwitchMode={handleSwitchMode}
            activeMode={mode}
            onNewSession={handleNewSession}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
        <SidebarInset>
            {renderContent()}
        </SidebarInset>
        <Dialog open={isNewSessionDialogOpen} onOpenChange={setIsNewSessionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a new session</DialogTitle>
              <DialogDescription>
                Choose the type of session you would like to begin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
                <Button variant="outline" className="h-20 flex-col" onClick={() => handleStartNewSession('chat')}>
                    <FileText className="h-6 w-6 mb-2" />
                    AI Document Helper
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => handleStartNewSession('compare')}>
                    <GitCompareArrows className="h-6 w-6 mb-2" />
                    Compare Documents
                </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}
