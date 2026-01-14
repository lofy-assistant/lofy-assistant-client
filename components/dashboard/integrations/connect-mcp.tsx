"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Server, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface MCPServer {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
}

export function ConnectMCP() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newServer, setNewServer] = useState({
    name: "",
    url: "",
  });

  const handleAddServer = () => {
    if (!newServer.name.trim() || !newServer.url.trim()) return;

    const server: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: newServer.name,
      url: newServer.url,
      enabled: false,
      status: "disconnected",
    };

    setServers((prev) => [...prev, server]);
    setNewServer({ name: "", url: "" });
    setIsDialogOpen(false);
  };

  const handleToggle = (id: string) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === id
          ? {
              ...server,
              enabled: !server.enabled,
              status: !server.enabled ? "connected" : "disconnected",
            }
          : server
      )
    );
  };

  const handleDeleteServer = (id: string) => {
    setServers((prev) => prev.filter((server) => server.id !== id));
  };

  const getStatusBadge = (status: MCPServer["status"]) => {
    switch (status) {
      case "connected":
        return <Badge variant="emerald">Connected</Badge>;
      case "disconnected":
        return <Badge variant="default">Disconnected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">MCP Servers</h3>
          <p className="text-sm text-muted-foreground">Add your own Model Context Protocol servers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add MCP Server</DialogTitle>
              <DialogDescription>Connect a custom Model Context Protocol server to extend functionality.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="server-name">Server Name</Label>
                <Input id="server-name" placeholder="My Custom Server" value={newServer.name} onChange={(e) => setNewServer({ ...newServer, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-url">Server URL</Label>
                <Input id="server-url" placeholder="https://api.example.com/mcp" value={newServer.url} onChange={(e) => setNewServer({ ...newServer, url: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServer}>Add Server</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {servers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">No MCP servers added yet. Click &quot;Add Server&quot; to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {servers.map((server) => (
            <Card key={server.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Server className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{server.url}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(server.status)}
                    <Switch checked={server.enabled} onCheckedChange={() => handleToggle(server.id)} />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteServer(server.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
