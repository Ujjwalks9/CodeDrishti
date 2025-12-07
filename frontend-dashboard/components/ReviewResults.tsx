//This component takes the raw data from the backend, parses the JSON string, 
// and displays it aesthetically using Tabs and Cards.

"use client";

import { useEffect, useState, useRef } from "react"; // Added useRef
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackendReviewResponse, AIAnalysisResult } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { CheckCircle2, AlertTriangle, XCircle, FileText, Shield, Activity, Bot, Loader2 } from "lucide-react";
import { BACKEND_API_URL } from "@/lib/config";

// ... [Keep MarkdownRenderer, ResultsSkeleton, and SeverityBadge exactly as they were] ...
// (I am omitting them here to save space, but DO NOT delete them from your file)

// --- SUB-COMPONENT: Markdown Renderer ---
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="text-slate-700 text-sm leading-relaxed">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          code: ({node, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return !match ? (
               <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-blue-700 border border-slate-200" {...props}>
                 {children}
               </code>
            ) : (
              <code className={className} {...props}>{children}</code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// --- SUB-COMPONENT: The Loading Animation (Skeleton) ---
function ResultsSkeleton() {
    // ... [Paste your existing ResultsSkeleton code here] ...
    return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
           <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/3 bg-slate-200" />
              <Skeleton className="h-6 w-24 bg-slate-200 rounded-full" />
           </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full bg-slate-200 mb-2" />
          <Skeleton className="h-4 w-3/4 bg-slate-200" />
          <div className="grid grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-5 w-full bg-slate-200" />
              <Skeleton className="h-5 w-full bg-slate-200" />
              <Skeleton className="h-5 w-full bg-slate-200" />
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-10 bg-slate-200" />
            <Skeleton className="h-10 bg-slate-200" />
            <Skeleton className="h-10 bg-slate-200" />
        </div>
        <Card className="border-slate-200 h-64">
           <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-20 w-full bg-slate-200" />
              <Skeleton className="h-20 w-full bg-slate-200" />
           </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-2 text-slate-500 text-sm animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>AI Worker is analyzing code structure and generating tests...</span>
      </div>
    </div>
  );
}

// --- HELPER: Severity Badges ---
const SeverityBadge = ({ severity }: { severity: string }) => {
    const colorMap: Record<string, string> = {
      HIGH: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
      MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
      LOW: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    };
    return (
      <Badge variant="outline" className={`${colorMap[severity] || colorMap.LOW} font-semibold`}>
        {severity}
      </Badge>
    );
};


// --- MAIN COMPONENT ---
export default function ReviewResults({ prId }: { prId: string }) {
  const [results, setResults] = useState<BackendReviewResponse[]>([]);
  const [error, setError] = useState<string | null>(null); // Track connection errors

  useEffect(() => {
    if (!prId) return;

    let isMounted = true; // 1. Flag to track if component is still active
    setResults([]);       // Reset immediately
    setError(null);

    const fetchResults = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/pr/${prId}`);
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        
        // 2. Only update state if this effect is still the active one
        if (isMounted && data && data.length > 0) {
            setResults(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Only show error if we aren't just polling and failing silently
        if (isMounted && results.length === 0) {
             // Optional: setError("Connection failed"); 
        }
      }
    };

    // Initial fetch
    fetchResults();

    // Poll every 3 seconds
    const interval = setInterval(() => {
        if (isMounted) {
            // We use a functional update here to access the 'fresh' state without adding it to dependencies
            setResults((currentResults) => {
                // Stop polling if we already have data
                if (currentResults.length === 0) {
                    fetchResults();
                }
                return currentResults;
            });
        }
    }, 3000);

    // 3. Cleanup function: Runs when prId changes or component unmounts
    return () => {
        isMounted = false; // Mark this specific request cycle as "stale"
        clearInterval(interval);
    };
  }, [prId]); // Re-run ONLY if prId changes

  // ... [Rest of your render logic remains exactly the same] ...
  
  if (!prId) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
             <Bot className="h-12 w-12 mb-4 opacity-50" />
             <h3 className="font-semibold text-lg text-slate-600">Ready for Analysis</h3>
             <p className="text-center max-w-sm">Submit code on the left to see AI insights, documentation, and test cases generated here.</p>
        </div>
    )
  }

  // Show error state if fetch failed completely
  if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            Error: Cannot connect to backend. Is Spring Boot running?
        </div>
      );
  }

  if (results.length === 0) {
     return <ResultsSkeleton />;
  }

  const latestResult = results[0];
  const analysis: AIAnalysisResult = JSON.parse(latestResult.aiResultJson);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Overview Card */}
      <Card className="border-slate-200 shadow-md bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
           <CardTitle className="text-lg text-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>{latestResult.filename}</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 font-normal">Quality Score</span>
                  <div className={`text-lg font-bold px-3 py-1 rounded-md ${
                      analysis.quality_score.final_score > 80 ? 'bg-green-100 text-green-700' : 
                      analysis.quality_score.final_score > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {analysis.quality_score.final_score}/100
                  </div>
              </div>
           </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <MarkdownRenderer content={analysis.documentation.summary} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <Shield className="h-4 w-4 text-slate-500"/> 
                  <span className="text-slate-500">Security:</span> 
                  <span className="font-medium text-slate-800">{analysis.quality_score.security_risk}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <Activity className="h-4 w-4 text-slate-500"/> 
                  <span className="text-slate-500">Complexity:</span> 
                  <span className="font-medium text-slate-800">{analysis.quality_score.cyclomatic_complexity}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-slate-500"/> 
                  <span className="text-slate-500">Maintainability:</span> 
                  <span className="font-medium text-slate-800">{analysis.quality_score.maintainability_index}</span>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Tabs */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="issues" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Issues ({analysis.review.length})</TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Docs</TabsTrigger>
          <TabsTrigger value="tests" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">QA Tests</TabsTrigger>
        </TabsList>
        
        {/* Issues Tab */}
        <TabsContent value="issues" className="mt-4 space-y-4">
          {analysis.review.map((issue, index) => (
            <Card key={index} className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     {issue.severity === 'HIGH' ? <XCircle className="h-5 w-5 text-red-500"/> : <AlertTriangle className="h-5 w-5 text-yellow-500"/>}
                    <h3 className="font-semibold text-slate-800">{issue.type} <span className="text-slate-400 font-normal text-sm ml-2">Line {issue.line}</span></h3>
                  </div>
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div className="mb-3">
                   <MarkdownRenderer content={issue.description} />
                </div>
                
                <div className="bg-slate-900 text-slate-50 p-3 rounded-md font-mono text-xs overflow-x-auto">
                  <p className="text-blue-400 mb-1">// Suggested Fix:</p>
                  {issue.suggestion}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="mt-4">
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-blue-500"/> Generated Documentation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-2 text-sm text-slate-500 uppercase tracking-wider">Javadoc / Docstring</h4>
                    <pre className="bg-slate-50 p-4 rounded-md border border-slate-200 font-mono text-sm whitespace-pre-wrap text-slate-700">{analysis.documentation.function_docs}</pre>
                </div>
                <div>
                    <h4 className="font-medium mb-2 text-sm text-slate-500 uppercase tracking-wider">Technical Notes</h4>
                     <MarkdownRenderer content={analysis.documentation.developer_notes} />
                </div>
            </CardContent>
        </Card>
        </TabsContent>
        
        {/* Tests Tab */}
        <TabsContent value="tests" className="mt-4">
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="h-5 w-5 text-green-600"/> QA Automation</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-medium mb-2 text-sm text-slate-500 uppercase tracking-wider">Unit Test Suite</h4>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-md font-mono text-xs overflow-x-auto shadow-inner">
                        {analysis.test_cases.unit_tests}
                    </pre>
                </div>
                <div className="grid grid-cols-2 gap-4">
                 <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="font-medium mb-2 text-red-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Edge Cases</h4>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                        {analysis.test_cases.edge_cases.map((ec, i) => (
                           <li key={i}><MarkdownRenderer content={ec} /></li>
                        ))}
                    </ul>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                     <h4 className="font-medium mb-2 text-blue-800 flex items-center gap-2"><Shield className="h-4 w-4"/> Risk Analysis</h4>
                     <MarkdownRenderer content={analysis.test_cases.risk_assessment} />
                 </div>
                </div>
            </CardContent>
        </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}