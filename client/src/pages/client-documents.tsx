import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Folder, FolderOpen, File, Plus, Edit, Trash2, ChevronRight, Users, Building2 } from "lucide-react";

interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}

interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
  level: number;
}

export default function ClientDocuments() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState<number | null>(null);

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/folders"],
    enabled: isAuthenticated,
  });

  // Build folder tree
  const folderTree = buildFolderTree(folders);

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderData: { name: string; parentId: number | null }) => {
      return await apiRequest("POST", "/api/folders", folderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setIsCreateDialogOpen(false);
      setNewFolderName("");
      setNewFolderParent(null);
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  // Update folder mutation
  const updateFolderMutation = useMutation({
    mutationFn: async (folderData: { id: number; name: string; parentId: number | null }) => {
      const { id, ...data } = folderData;
      return await apiRequest("PUT", `/api/folders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setIsEditDialogOpen(false);
      setEditingFolder(null);
      toast({
        title: "Success",
        description: "Folder updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update folder",
        variant: "destructive",
      });
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: number) => {
      return await apiRequest("DELETE", `/api/folders/${folderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete folder",
        variant: "destructive",
      });
    },
  });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    createFolderMutation.mutate({
      name: newFolderName.trim(),
      parentId: newFolderParent,
    });
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderParent(folder.parentId);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFolder = () => {
    if (!editingFolder || !newFolderName.trim()) return;
    
    updateFolderMutation.mutate({
      id: editingFolder.id,
      name: newFolderName.trim(),
      parentId: newFolderParent,
    });
  };

  const handleDeleteFolder = (folderId: number) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      deleteFolderMutation.mutate(folderId);
    }
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  };

  const renderFolderTree = (nodes: FolderTreeNode[]) => {
    return nodes.map((folder) => (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
            selectedFolder === folder.id ? "bg-blue-50 border border-blue-200" : ""
          }`}
          style={{ paddingLeft: `${folder.level * 20 + 8}px` }}
          onClick={() => setSelectedFolder(folder.id)}
        >
          {folder.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  expandedFolders.has(folder.id) ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          
          {folder.children.length === 0 && <div className="w-5" />}
          
          {expandedFolders.has(folder.id) ? (
            <FolderOpen className="h-4 w-4 text-blue-600" />
          ) : (
            <Folder className="h-4 w-4 text-blue-600" />
          )}
          
          <span className="flex-1 text-sm font-medium">{folder.name}</span>
          
          {user?.role === 'admin' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditFolder(folder);
                }}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.id);
                }}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {expandedFolders.has(folder.id) && folder.children.length > 0 && (
          <div>{renderFolderTree(folder.children)}</div>
        )}
      </div>
    ));
  };

  const getFolderPath = (folderId: number | null): string => {
    if (!folderId) return "Root";
    
    const findPath = (folders: Folder[], targetId: number, path: string[] = []): string[] | null => {
      for (const folder of folders) {
        if (folder.id === targetId) {
          return [...path, folder.name];
        }
      }
      
      for (const folder of folders) {
        if (folders.some(f => f.parentId === folder.id)) {
          const result = findPath(folders, targetId, [...path, folder.name]);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    const path = findPath(folders, folderId);
    return path ? path.join(" > ") : "Unknown";
  };

  if (foldersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-36 pb-6 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Directory</h1>
          <p className="text-gray-600 mt-1">Browse services organized by department and category</p>
        </div>
        
        {user?.role === 'admin' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div>
                  <Label htmlFor="parentFolder">Parent Folder</Label>
                  <Select value={newFolderParent?.toString() || "root"} onValueChange={(value) => setNewFolderParent(value === "root" ? null : parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Root (No Parent)</SelectItem>
                      {folders.map((folder: Folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {getFolderPath(folder.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateFolder}
                    disabled={createFolderMutation.isPending || !newFolderName.trim()}
                  >
                    {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Folder Tree */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 group">
                {folderTree.length > 0 ? (
                  renderFolderTree(folderTree)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No folders created yet</p>
                    {user?.role === 'admin' && (
                      <p className="text-sm">Create your first folder to get started</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedFolder ? getFolderPath(selectedFolder) : "All Services"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFolder ? (
                <div className="text-center py-8 text-gray-500">
                  <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Services and documents for this department will appear here</p>
                  <p className="text-sm mt-1">Integration with document management coming soon</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a department from the left to view available services</p>
                  <p className="text-sm mt-1">Navigate through the folder structure to find what you need</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFolderName">Folder Name</Label>
              <Input
                id="editFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div>
              <Label htmlFor="editParentFolder">Parent Folder</Label>
              <Select value={newFolderParent?.toString() || "root"} onValueChange={(value) => setNewFolderParent(value === "root" ? null : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root (No Parent)</SelectItem>
                  {folders.filter((folder: Folder) => folder.id !== editingFolder?.id).map((folder: Folder) => (
                    <SelectItem key={folder.id} value={folder.id.toString()}>
                      {getFolderPath(folder.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateFolder}
                disabled={updateFolderMutation.isPending || !newFolderName.trim()}
              >
                {updateFolderMutation.isPending ? "Updating..." : "Update Folder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildFolderTree(folders: Folder[]): FolderTreeNode[] {
  const folderMap = new Map<number, FolderTreeNode>();
  const rootFolders: FolderTreeNode[] = [];

  // Create nodes
  folders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      children: [],
      level: 0,
    });
  });

  // Build tree structure
  folders.forEach(folder => {
    const node = folderMap.get(folder.id)!;
    
    if (folder.parentId === null) {
      rootFolders.push(node);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        node.level = parent.level + 1;
        parent.children.push(node);
      }
    }
  });

  // Sort folders alphabetically at each level
  const sortFolders = (folders: FolderTreeNode[]) => {
    folders.sort((a, b) => a.name.localeCompare(b.name));
    folders.forEach(folder => {
      if (folder.children.length > 0) {
        sortFolders(folder.children);
      }
    });
  };

  sortFolders(rootFolders);
  return rootFolders;
}