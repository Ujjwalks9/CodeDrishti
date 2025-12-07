//This is the homepage where we assemble the two components side-by-side.

"use client";

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import ReviewResults from "@/components/ReviewResults";
import { Bot, Github } from "lucide-react";

export default function Home() {
  const [currentPrId, setCurrentPrId] = useState<string>("");

  return (
    // 'h-screen' forces the app to take up the full browser window height
    // 'overflow-hidden' prevents scrolling on the main body
    <main className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Header: Fixed height (e.g., 64px) */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
             <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI Code Review <span className="text-slate-500 font-normal">Assistant</span>
          </h1>
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium ml-2">
            Enterprise
          </span>
        </div>
        
        {/* Optional: Add a profile or settings placeholder */}
        <div className="flex items-center gap-4">
             <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Documentation</button>
             <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
        </div>
      </header>

      {/* Main Layout: Flex Row to split Left and Right panels */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Review Form (Fixed Width or Percentage) */}
        {/* 'w-[400px]' or 'w-1/3' defines the width. 'overflow-y-auto' allows scrolling ONLY inside this panel if needed */}
        <aside className="w-[450px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
          <div className="p-6">
            <ReviewForm onReviewComplete={(prId) => setCurrentPrId(prId)} />
          </div>
          
          <div className="mt-auto p-6 border-t border-slate-100">
             <div className="text-xs text-slate-400 text-center">
                Powered by Gemini 2.0 Flash • Spring Boot • Next.js
             </div>
          </div>
        </aside>

        {/* Right Panel: Results Display (Flex-1 takes remaining space) */}
        {/* 'bg-slate-50' distinguishes the result area from the form */}
        <section className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="max-w-5xl mx-auto"> 
            {/* The max-w-5xl here keeps the readable content centered in the large right panel, but the panel itself is full width */}
             <ReviewResults prId={currentPrId} />
          </div>
        </section>

      </div>
    </main>
  );
}