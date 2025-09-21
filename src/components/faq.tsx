import { FileUp, Bot, Search, ShieldCheck, CalendarClock, Languages, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollAnimation } from './ui/scroll-animation';

type FaqProps = {
    onStartSession: () => void;
};

const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Plain English Translation",
      description: "We cut through the jargon to tell you what your document actually says."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Risk Detection",
      description: "Our AI proactively flags unfair clauses, hidden fees, and potential red flags so you can protect yourself."
    },
    {
      icon: <CalendarClock className="h-8 w-8 text-primary" />,
      title: "Obligation Tracker",
      description: "Never miss a deadline again. Vidhik extracts all key dates and duties into a simple, actionable checklist."
    },
    {
      icon: <Languages className="h-8 w-8 text-primary" />,
      title: "Vernacular Language Support",
      description: "Upload documents in regional Indian languages and get clarity in the language you're most comfortable with."
    }
  ];

  const faqItems = [
    {
        question: "What is Vidhik AI?",
        answer: "Vidhik AI is a smart legal assistant designed to help you understand complex legal documents. You can upload a document, and our AI will provide a simple summary, explain confusing jargon, identify key obligations, perform a risk analysis, and even answer specific questions you have about the content."
    },
    {
        question: "What are the main features?",
        answer: `Vidhik AI offers several powerful features:

*   **AI Document Helper**: Upload a document (or paste its text) to get a complete breakdown. This includes a high-level summary, a 'jargon buster' for complex terms, a proactive risk analysis, and a list of key dates and obligations. You can then chat with the AI to ask specific questions about the document.
*   **Compare Documents**: Upload two different versions of a document to see a detailed report on what has changed. The AI will highlight new clauses, modified terms, and anything that has been removed, giving you a clear picture of the differences.
*   **My Documents**: A central place to view all the documents you've previously analyzed or compared. You can quickly select a past document to continue your analysis in the AI Document Helper.`
    },
    {
        question: "How does the ‘AI Document Helper’ work?",
        answer: `When you upload a document, our AI reads and analyzes the entire text. It then generates a structured report with several tabs:

*   **Feature Summary**: A high-level overview of the document's most important clauses and purpose, formatted for easy reading.
*   **Risk Analysis**: Highlights potentially unfavorable or risky clauses, categorizing them as High, Medium, or Low risk.
*   **Jargon Buster**: An alphabetized list of complex legal terms with simple, easy-to-understand definitions.
*   **Obligations & Deadlines**: Extracts key dates and deadlines, which you can even export to your calendar.

After this initial analysis, the chat window becomes active, allowing you to ask follow-up questions about any part of the document.`
    },
    {
        question: "How does the ‘Compare Documents’ feature work?",
        answer: `This feature is designed to make version control simple. You upload an 'original' document (Document A) and a 'revised' document (Document B). The AI performs a detailed, clause-by-clause comparison and generates a report with three main sections:

*   **New Clauses**: Clauses present in Document B but not in Document A.
*   **Changed Terms**: Clauses that exist in both but have been modified. You'll see the old text and the new text side-by-side.
*   **Deleted Clauses**: Clauses that were in Document A but have been removed from Document B.`
    },
    {
        question: "What types of documents can I upload?",
        answer: "You can upload common text-based file types like .txt, .pdf, and .docx. You can also paste text directly into the application. The AI is capable of understanding documents in both English and major Indian regional languages."
    },
    {
        question: "Is my data secure and private?",
        answer: "Yes. We prioritize your privacy. The content of your documents is processed to provide the analysis and is not stored long-term or used for any other purpose. Your session history is stored locally in your browser, giving you full control over your data."
    }
]


export default function Faq({ onStartSession }: FaqProps) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <ScrollAnimation>
        <section className="text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Finally, Understand Any Legal Document in Seconds.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Stop drowning in complex legal jargon. Vidhik uses the power of AI to translate complicated contracts, agreements, and policies into simple, clear language you can actually understand. Your personal legal companion is here.
            </p>
            <div className="mt-8">
                <Button size="lg" onClick={onStartSession}>Try Vidhik Now</Button>
            </div>
        </section>
      </ScrollAnimation>

      {/* How It Works Section */}
      <ScrollAnimation>
      <section>
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold">Clarity in Three Simple Steps</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
            <ScrollAnimation delay={0.1}>
            <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                    <FileUp className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">1. Upload Your Document</h3>
                <p className="mt-2 text-muted-foreground">
                    Securely upload any legal document—a rental agreement, a freelance contract, or terms of service. Our platform is safe, private, and confidential.
                </p>
            </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
            <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                    <Bot className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">2. AI-Powered Analysis</h3>
                <p className="mt-2 text-muted-foreground">
                    Vidhik's intelligent AI instantly analyzes your document, identifying key clauses, potential risks, and your personal obligations.
                </p>
            </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.3}>
            <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                    <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">3. Ask Anything</h3>
                <p className="mt-2 text-muted-foreground">
                    Use our simple chat interface to ask specific questions about the document in plain English (or even Hinglish!). Get instant answers and make decisions with confidence.
                </p>
            </div>
            </ScrollAnimation>
        </div>
      </section>
      </ScrollAnimation>
      
      {/* Features Section */}
      <ScrollAnimation>
      <section>
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold">Go Beyond Just a Summary</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
            <ScrollAnimation key={feature.title} delay={index * 0.1}>
            <Card className="bg-secondary/50 h-full">
                <CardHeader>
                    {feature.icon}
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
            </Card>
            </ScrollAnimation>
            ))}
        </div>
      </section>
      </ScrollAnimation>

      {/* FAQ Section */}
      <ScrollAnimation>
      <section>
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                     <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                {item.answer}
                            </ReactMarkdown>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
      </ScrollAnimation>

      {/* Final CTA Section */}
      <ScrollAnimation>
      <section className="text-center bg-secondary py-12 rounded-lg">
        <h2 className="font-headline text-3xl font-bold">
            Don't Sign Another Document You Don't Understand.
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
            Ready to take control of your legal and financial future? Get the clarity you deserve.
        </p>
        <div className="mt-8">
            <Button size="lg" onClick={onStartSession}>Get Started</Button>
        </div>
      </section>
      </ScrollAnimation>
    </div>
  )
}
