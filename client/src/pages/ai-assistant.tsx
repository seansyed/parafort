import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles, Code, HelpCircle, Wrench } from "lucide-react";

interface CodeAnalysisResult {
  analysis: string;
  fixedCode?: string;
  suggestions: string[];
  explanation: string;
}

interface CodeGenerationResult {
  code: string;
  explanation: string;
  usage: string;
  dependencies?: string[];
}

interface HelpResult {
  answer: string;
  relatedActions: string[];
  helpfulLinks: string[];
}

export default function AIAssistant() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("fix-code");

  // Code Fix Form State
  const [codeSnippet, setCodeSnippet] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const [filePath, setFilePath] = useState("");

  // Code Generation Form State
  const [requirements, setRequirements] = useState("");
  const [codeType, setCodeType] = useState("component");
  const [existingCode, setExistingCode] = useState("");
  const [framework, setFramework] = useState("React TypeScript");

  // Help Form State
  const [helpQuery, setHelpQuery] = useState("");

  // Results State
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [generationResult, setGenerationResult] = useState<CodeGenerationResult | null>(null);
  const [helpResult, setHelpResult] = useState<HelpResult | null>(null);

  const analyzeCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/ai/fix-code", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Code Analysis Complete",
        description: "AI has analyzed your code and provided suggestions.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/ai/generate-code", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGenerationResult(data);
      toast({
        title: "Code Generated",
        description: "AI has generated code based on your requirements.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getHelpMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/ai/help", data);
      return response.json();
    },
    onSuccess: (data) => {
      setHelpResult(data);
      toast({
        title: "Help Generated",
        description: "AI has provided assistance for your question.",
      });
    },
    onError: (error) => {
      toast({
        title: "Help Failed",
        description: "Failed to get help. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFixCode = () => {
    if (!description && !codeSnippet) {
      toast({
        title: "Missing Information",
        description: "Please provide either a description or code snippet.",
        variant: "destructive",
      });
      return;
    }

    analyzeCodeMutation.mutate({
      codeSnippet,
      errorMessage,
      description,
      filePath,
    });
  };

  const handleGenerateCode = () => {
    if (!requirements) {
      toast({
        title: "Missing Requirements",
        description: "Please describe what you want to build.",
        variant: "destructive",
      });
      return;
    }

    generateCodeMutation.mutate({
      requirements,
      codeType,
      existingCode,
      framework,
    });
  };

  const handleGetHelp = () => {
    if (!helpQuery) {
      toast({
        title: "Missing Query",
        description: "Please enter your question.",
        variant: "destructive",
      });
      return;
    }

    getHelpMutation.mutate({
      query: helpQuery,
      context: {
        currentPage: "ai-assistant",
        businessCount: 0,
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-orange-500" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Use Gemini AI to analyze code, generate solutions, and get contextual help for ParaFort development.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fix-code" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Fix Code
          </TabsTrigger>
          <TabsTrigger value="generate-code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Generate Code
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Get Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fix-code" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Analysis</CardTitle>
                <CardDescription>
                  Provide your code issues for AI analysis and fixes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Issue Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the problem you're facing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="errorMessage">Error Message</Label>
                  <Input
                    id="errorMessage"
                    placeholder="Type error or warning message..."
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="filePath">File Path</Label>
                  <Input
                    id="filePath"
                    placeholder="e.g., client/src/pages/settings.tsx"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="codeSnippet">Code Snippet</Label>
                  <Textarea
                    id="codeSnippet"
                    placeholder="Paste your problematic code here..."
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <Button 
                  onClick={handleFixCode} 
                  className="w-full"
                  disabled={analyzeCodeMutation.isPending}
                >
                  {analyzeCodeMutation.isPending ? "Analyzing..." : "Analyze Code"}
                </Button>
              </CardContent>
            </Card>

            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    AI Analysis Results
                    <Badge variant="secondary">Fixed</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Analysis</Label>
                    <p className="text-sm text-muted-foreground mt-1">{analysisResult.analysis}</p>
                  </div>

                  {analysisResult.fixedCode && (
                    <div>
                      <Label className="text-sm font-semibold flex items-center justify-between">
                        Fixed Code
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(analysisResult.fixedCode!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </Label>
                      <pre className="bg-muted p-3 rounded text-sm mt-1 overflow-x-auto">
                        <code>{analysisResult.fixedCode}</code>
                      </pre>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-semibold">Suggestions</Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Explanation</Label>
                    <p className="text-sm text-muted-foreground mt-1">{analysisResult.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generate-code" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Generation</CardTitle>
                <CardDescription>
                  Describe what you want to build and let AI generate the code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Describe what you want to build..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="codeType">Code Type</Label>
                  <select
                    id="codeType"
                    className="w-full p-2 border rounded-md"
                    value={codeType}
                    onChange={(e) => setCodeType(e.target.value)}
                  >
                    <option value="component">React Component</option>
                    <option value="hook">Custom Hook</option>
                    <option value="function">Function</option>
                    <option value="service">Service</option>
                    <option value="utility">Utility</option>
                    <option value="api">API Endpoint</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="framework">Framework</Label>
                  <Input
                    id="framework"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="existingCode">Existing Code Context</Label>
                  <Textarea
                    id="existingCode"
                    placeholder="Paste related existing code for context..."
                    value={existingCode}
                    onChange={(e) => setExistingCode(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <Button 
                  onClick={handleGenerateCode} 
                  className="w-full"
                  disabled={generateCodeMutation.isPending}
                >
                  {generateCodeMutation.isPending ? "Generating..." : "Generate Code"}
                </Button>
              </CardContent>
            </Card>

            {generationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated Code
                    <Badge variant="secondary">Ready</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold flex items-center justify-between">
                      Code
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generationResult.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </Label>
                    <pre className="bg-muted p-3 rounded text-sm mt-1 overflow-x-auto max-h-96">
                      <code>{generationResult.code}</code>
                    </pre>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-semibold">Explanation</Label>
                    <p className="text-sm text-muted-foreground mt-1">{generationResult.explanation}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Usage</Label>
                    <p className="text-sm text-muted-foreground mt-1">{generationResult.usage}</p>
                  </div>

                  {generationResult.dependencies && generationResult.dependencies.length > 0 && (
                    <div>
                      <Label className="text-sm font-semibold">Dependencies</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {generationResult.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline">{dep}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ask for Help</CardTitle>
                <CardDescription>
                  Get contextual assistance and guidance for ParaFort development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="helpQuery">Your Question *</Label>
                  <Textarea
                    id="helpQuery"
                    placeholder="Ask about business formation, compliance, platform features, or development..."
                    value={helpQuery}
                    onChange={(e) => setHelpQuery(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGetHelp} 
                  className="w-full"
                  disabled={getHelpMutation.isPending}
                >
                  {getHelpMutation.isPending ? "Getting Help..." : "Get Help"}
                </Button>
              </CardContent>
            </Card>

            {helpResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    AI Assistant Response
                    <Badge variant="secondary">Helpful</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Answer</Label>
                    <p className="text-sm text-muted-foreground mt-1">{helpResult.answer}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-semibold">Related Actions</Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                      {helpResult.relatedActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Helpful Links</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {helpResult.helpfulLinks.map((link, index) => (
                        <Badge key={index} variant="outline">{link}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Alert className="mt-8">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          This AI assistant is powered by Google Gemini and can help with code analysis, generation, and contextual guidance 
          for the ParaFort platform. Results are generated based on your input and project context.
        </AlertDescription>
      </Alert>
    </div>
  );
}