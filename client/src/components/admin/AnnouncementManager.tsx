import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Announcement } from "@shared/schema";

interface AnnouncementFormData {
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string;
  status: string;
  scheduledDate?: string;
  expirationDate?: string;
  displayLocation: string;
  dismissible: boolean;
  hasCallToAction: boolean;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor: string;
  textColor: string;
  iconType: string;
}

const defaultFormData: AnnouncementFormData = {
  title: "",
  content: "",
  type: "general",
  priority: "normal",
  targetAudience: "all",
  status: "draft",
  scheduledDate: "",
  expirationDate: "",
  displayLocation: "dashboard",
  dismissible: true,
  hasCallToAction: false,
  ctaText: "",
  ctaUrl: "",
  backgroundColor: "#10b981",
  textColor: "#ffffff",
  iconType: "info"
};

export default function AnnouncementManager() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["/api/admin/announcements"],
    retry: false,
  });

  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const response = await apiRequest("POST", "/api/admin/announcements", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      setShowCreateDialog(false);
      setFormData(defaultFormData);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create announcement: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AnnouncementFormData> }) => {
      const response = await apiRequest("PUT", `/api/admin/announcements/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      setIsEditing(false);
      setSelectedAnnouncement(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update announcement: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/announcements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete announcement: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedAnnouncement) {
      updateMutation.mutate({ id: selectedAnnouncement.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      status: announcement.status,
      scheduledDate: announcement.scheduledDate ? new Date(announcement.scheduledDate).toISOString().slice(0, 16) : "",
      expirationDate: announcement.expirationDate ? new Date(announcement.expirationDate).toISOString().slice(0, 16) : "",
      displayLocation: announcement.displayLocation,
      dismissible: announcement.dismissible,
      hasCallToAction: announcement.hasCallToAction,
      ctaText: announcement.ctaText || "",
      ctaUrl: announcement.ctaUrl || "",
      backgroundColor: announcement.backgroundColor || "#10b981",
      textColor: announcement.textColor || "#ffffff",
      iconType: announcement.iconType || "info"
    });
    setIsEditing(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500";
      case "scheduled": return "bg-yellow-500";
      case "draft": return "bg-gray-500";
      case "paused": return "bg-orange-500";
      case "archived": return "bg-gray-400";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Announcement Management</h1>
          <p className="text-gray-600">Create and manage promotional announcements for users</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Compose a new announcement to engage with your users
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">All Announcements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <div className="grid gap-4">
            {announcements?.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p className="text-gray-500 mb-4">Create your first announcement to engage with users</p>
                    <Button 
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create First Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              announcements?.map((announcement: Announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                          <Badge className={getStatusColor(announcement.status)}>
                            {announcement.status}
                          </Badge>
                          <Badge variant="outline">
                            {announcement.targetAudience}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMutation.mutate(announcement.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Views:</span> {announcement.viewCount}
                      </div>
                      <div>
                        <span className="font-medium">Clicks:</span> {announcement.clickCount}
                      </div>
                      <div>
                        <span className="font-medium">Dismissals:</span> {announcement.dismissCount}
                      </div>
                    </div>
                    {announcement.scheduledDate && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Scheduled:</span> {new Date(announcement.scheduledDate).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Analytics</CardTitle>
              <CardDescription>Overview of announcement performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {announcements?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Announcements</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {announcements?.filter((a: Announcement) => a.status === 'published').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {announcements?.reduce((sum: number, a: Announcement) => sum + a.viewCount, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {announcements?.reduce((sum: number, a: Announcement) => sum + a.clickCount, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Clicks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update announcement details and settings
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Announcement Form Component
interface AnnouncementFormProps {
  formData: AnnouncementFormData;
  setFormData: (data: AnnouncementFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
}

function AnnouncementForm({ formData, setFormData, onSubmit, isLoading, isEditing }: AnnouncementFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter announcement title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="feature">New Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter announcement content"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Select value={formData.targetAudience} onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="clients">Clients Only</SelectItem>
              <SelectItem value="admins">Admins Only</SelectItem>
              <SelectItem value="specific_users">Specific Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Scheduled Date (Optional)</Label>
          <Input
            id="scheduledDate"
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
          <Input
            id="expirationDate"
            type="datetime-local"
            value={formData.expirationDate}
            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="dismissible"
            checked={formData.dismissible}
            onCheckedChange={(checked) => setFormData({ ...formData, dismissible: checked })}
          />
          <Label htmlFor="dismissible">Dismissible by users</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="hasCallToAction"
            checked={formData.hasCallToAction}
            onCheckedChange={(checked) => setFormData({ ...formData, hasCallToAction: checked })}
          />
          <Label htmlFor="hasCallToAction">Include call-to-action</Label>
        </div>
      </div>

      {formData.hasCallToAction && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ctaText">Call-to-Action Text</Label>
            <Input
              id="ctaText"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              placeholder="e.g., Learn More"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
            <Input
              id="ctaUrl"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => setFormData(defaultFormData)}>
          Reset
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
          {isLoading ? "Saving..." : (isEditing ? "Update Announcement" : "Create Announcement")}
        </Button>
      </div>
    </form>
  );
}