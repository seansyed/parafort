import LeftNavigation from "@/components/left-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnnualReportsTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeftNavigation />
      <div className="ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-6 space-y-6 mt-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Annual Reports - Test Page
            </h1>
            <p className="text-xl text-gray-600">
              This is a test to see if the page renders correctly.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
              <CardDescription>Testing if components render</CardDescription>
            </CardHeader>
            <CardContent>
              <p>If you can see this, the page structure is working.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}