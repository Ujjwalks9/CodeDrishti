// This component handles user input and calls the Spring Boot /manual endpoint.

"use client"; // This component requires user interaction

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Code } from "lucide-react";
import { BACKEND_API_URL } from "@/lib/config";

export default function ReviewForm({ onReviewComplete }: { onReviewComplete: (prId: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    filename: "",
    language: "java",
    prId: "",
    code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Trigger the parent component to fetch results using this PR ID
        onReviewComplete(formData.prId);
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">New Review</h2>
        <p className="text-sm text-slate-500">Submit code manually or link a PR.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Filename</label>
            <Input
              placeholder="UserService.java"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              className="bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ref ID</label>
            <Input
              placeholder="PR-123"
              value={formData.prId}
              onChange={(e) => setFormData({ ...formData, prId: e.target.value })}
              className="bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, language: value })}
            defaultValue={formData.language}
          >
            <SelectTrigger className="bg-slate-50">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript/TypeScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Source Code</label>
          <Textarea
            placeholder="Paste your code here..."
            className="min-h-[300px] font-mono text-xs bg-slate-50 resize-none focus:ring-blue-500" // Made taller for real work
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !formData.code} 
            className="w-full bg-blue-600 hover:bg-blue-700 h-10 shadow-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Analyze Code"
          )}
        </Button>
      </div>
    </div>
  );
}