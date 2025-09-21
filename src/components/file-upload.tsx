'use client';

import { UploadCloud, FileText } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Document } from '@/app/page';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

type FileUploadProps = {
  onDocumentSelect: (document: Document) => void;
};

export default function FileUpload({ onDocumentSelect }: FileUploadProps) {
  const { toast } = useToast();
  const [pastedText, setPastedText] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      onDocumentSelect({ name: file.name, content });
    };

    reader.onerror = () => {
      toast({
        title: 'Read Error',
        description: 'Failed to read the file.',
        variant: 'destructive',
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = () => {
    if (!pastedText.trim()) {
        toast({
            title: 'Empty Content',
            description: 'Please paste some text to analyze.',
            variant: 'destructive',
        });
        return;
    }
    // Convert plain text to a data URI to match file upload format, correctly handling unicode.
    const textDataUri = `data:text/plain;base64,${Buffer.from(pastedText).toString('base64')}`;
    onDocumentSelect({ name: 'Pasted Content', content: textDataUri });
  };


  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
       <Tabs defaultValue="upload" className="w-full max-w-lg">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
                <UploadCloud className="mr-2 h-4 w-4"/>
                Upload File
            </TabsTrigger>
            <TabsTrigger value="paste">
                <FileText className="mr-2 h-4 w-4"/>
                Paste Text
            </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
            <Card className="border-t-0 rounded-t-none">
                <CardContent className="p-0">
                     <label htmlFor="file-upload" className="w-full cursor-pointer rounded-b-lg border-2 border-dashed border-border p-12 text-center transition-colors hover:border-primary/50 flex flex-col items-center justify-center h-[288px]">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-headline text-lg font-semibold">
                        Click to upload a document
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                        Supported formats: .txt, .pdf, .docx, .json
                        </p>
                    </label>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx,.json,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf" />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="paste">
             <Card className="border-t-0 rounded-t-none">
                <CardContent className="p-6 space-y-4">
                     <Textarea
                        placeholder="Paste your document content here..."
                        className="h-64"
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                    />
                    <Button onClick={handleTextSubmit} className="w-full">
                        Demystify Text
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
       </Tabs>
    </div>
  );
}
