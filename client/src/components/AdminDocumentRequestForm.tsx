import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { FileText, Send, Users } from "lucide-react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminDocumentRequestForm() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch all clients for admin to select from
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/admin/clients'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId || !documentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a client and enter a document name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/admin/request-document', {
        clientId: selectedClientId,
        documentName: documentName.trim(),
        description: description.trim() || null,
      });

      toast({
        title: "Document Request Sent",
        description: "The client has been notified of the document request.",
      });

      // Reset form
      setSelectedClientId("");
      setDocumentName("");
      setDescription("");
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send document request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.find((client: Client) => client.id === selectedClientId);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Request Client Documents
        </CardTitle>
        <p className="text-sm text-gray-600">
          Send a document request to a specific client for their business formation or compliance needs.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client-select" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Select Client
            </Label>
            <Select 
              value={selectedClientId} 
              onValueChange={setSelectedClientId}
              disabled={clientsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Choose a client"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client: Client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Client Info */}
          {selectedClient && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Requesting document from:</p>
              <p className="font-medium">
                {selectedClient.firstName} {selectedClient.lastName}
              </p>
              <p className="text-sm text-gray-500">{selectedClient.email}</p>
            </div>
          )}

          {/* Document Name */}
          <div className="space-y-2">
            <Label htmlFor="document-name">
              Document Name *
            </Label>
            <Input
              id="document-name"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., EIN Confirmation Letter, Bank Statement, Operating Agreement"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about the document request..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || !selectedClientId || !documentName.trim()}
            className="w-full bg-green-500 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Sending Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Document Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}