import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Search, CheckCircle, XCircle, Globe, Star, Copy, RefreshCw, Sparkles, Target, TrendingUp, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NameSuggestion {
  name: string;
  domain: string;
  available: boolean;
  rating: number;
  category: string;
  reasoning: string;
}

interface NameCheckResult {
  businessName: string;
  available: boolean;
  suggestions: string[];
  trademarked: boolean;
  domainAvailable: boolean;
}

export default function BusinessNameGenerator() {
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("generator");
  const [checkName, setCheckName] = useState("");
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkResult, setCheckResult] = useState<NameCheckResult | null>(null);
  const { toast } = useToast();

  const industries = [
    "Technology", "Healthcare", "Finance", "E-commerce", "Real Estate", 
    "Food & Beverage", "Professional Services", "Education", "Manufacturing", 
    "Entertainment", "Fitness & Wellness", "Automotive", "Fashion", "Travel"
  ];

  const styles = [
    "Professional", "Creative", "Modern", "Traditional", "Playful", 
    "Luxury", "Minimalist", "Bold", "Friendly", "Innovative"
  ];

  const generateNamesMutation = useMutation({
    mutationFn: async (data: { keywords: string; industry: string; style: string; description: string }) => {
      const response = await apiRequest("POST", "/api/business-names/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
      setIsGenerating(false);
      toast({
        title: "Names Generated!",
        description: `Generated ${data.suggestions?.length || 0} creative business name suggestions`,
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Unable to generate names. Please try again.",
        variant: "destructive",
      });
    }
  });

  const checkNameMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/business-names/check", { businessName: name });
      return response.json();
    },
    onSuccess: (data) => {
      setCheckResult(data);
    }
  });

  const handleGenerateNames = () => {
    if (!keywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter keywords to generate business names",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateNamesMutation.mutate({
      keywords: keywords.trim(),
      industry,
      style,
      description
    });
  };

  const handleCheckName = () => {
    if (!checkName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a business name to check",
        variant: "destructive",
      });
      return;
    }

    checkNameMutation.mutate(checkName.trim());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Business name copied to clipboard",
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Creative': 'bg-purple-100 text-purple-800',
      'Professional': 'bg-blue-100 text-blue-800', 
      'Modern': 'bg-green-100 text-green-800',
      'Brandable': 'bg-orange-100 text-orange-800',
      'Descriptive': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Business Name Generator
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect Business Name
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate creative, memorable, and brandable business names using advanced AI. 
            Check availability and get domain suggestions instantly.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="checker" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Name Checker
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Naming Tips
            </TabsTrigger>
          </TabsList>

          {/* Name Generator Tab */}
          <TabsContent value="generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    Generate Business Names
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="keywords">Keywords *</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., coffee, tech, design, consulting"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter words that describe your business
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind.toLowerCase()}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((st) => (
                          <SelectItem key={st} value={st.toLowerCase()}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your business does..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateNames}
                    disabled={isGenerating || !keywords.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Names...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Names
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Generated Names
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Enter your keywords and click "Generate Names" to see AI-powered suggestions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(suggestion.name)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{getRatingStars(suggestion.rating)}</div>
                            <Badge className={getCategoryColor(suggestion.category)}>
                              {suggestion.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{suggestion.reasoning}</p>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{suggestion.domain}</span>
                              {suggestion.available ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Name Checker Tab */}
          <TabsContent value="checker">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Check Business Name Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Box for Check Results */}
                {checkResult && (
                  <div className={`p-4 rounded-lg border-l-4 ${
                    checkResult.available 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-red-50 border-red-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {checkResult.available ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className={`font-semibold ${
                        checkResult.available ? 'text-green-800' : 'text-red-800'
                      }`}>
                        Name Check Complete
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      checkResult.available ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {checkResult.available ? 'Name appears available!' : 'Name may have conflicts'}
                    </p>
                    {checkResult.suggestions && checkResult.suggestions.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Alternative suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {checkResult.suggestions.slice(0, 3).map((suggestion, index) => (
                            <span key={index} className="px-2 py-1 bg-white rounded text-xs border">
                              {suggestion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="checkName">Business Name</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="checkName"
                      placeholder="Enter business name to check"
                      value={checkName}
                      onChange={(e) => setCheckName(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleCheckName}
                      disabled={checkNameMutation.isPending || !checkName.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {checkNameMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>


              </CardContent>
            </Card>
          </TabsContent>

          {/* Naming Tips Tab */}
          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-red-500" />
                    Keep It Simple
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Short and memorable (2-3 words max)</li>
                    <li>• Easy to spell and pronounce</li>
                    <li>• Avoid complex abbreviations</li>
                    <li>• Test with friends and family</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Make It Memorable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use alliteration or rhyming</li>
                    <li>• Create emotional connection</li>
                    <li>• Tell a story or convey meaning</li>
                    <li>• Avoid generic terms</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Think Future
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Allow for business expansion</li>
                    <li>• Avoid limiting geographic terms</li>
                    <li>• Consider international markets</li>
                    <li>• Check social media availability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Domain & Legal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Secure matching domain name</li>
                    <li>• Check trademark databases</li>
                    <li>• Verify state business registrations</li>
                    <li>• Consider .com extensions first</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-5 w-5 text-purple-500" />
                    SEO Friendly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Include relevant keywords</li>
                    <li>• Avoid hyphens and numbers</li>
                    <li>• Consider search engine optimization</li>
                    <li>• Think about local search terms</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Brand Identity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Reflect your company values</li>
                    <li>• Match your target audience</li>
                    <li>• Consider logo potential</li>
                    <li>• Ensure cultural sensitivity</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="text-center py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Business?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Once you've found the perfect name, let ParaFort help you form your business entity, 
                  register your name, and get all the legal documentation you need.
                </p>
                <button 
                  style={{
                    backgroundColor: '#34de73',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#34de73';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => window.location.href = '/formation-workflow'}
                >
                  Start Business Formation
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}