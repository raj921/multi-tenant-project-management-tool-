'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Plus, 
  Users, 
  Settings, 
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  User
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Organization {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  createdAt: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function OrganizationsPage() {
  const { toast } = useToast();
  
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Tech Corp',
      description: 'Leading technology company specializing in software development',
      memberCount: 12,
      role: 'owner',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Design Studio',
      description: 'Creative design agency for digital products',
      memberCount: 8,
      role: 'admin',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Startup Inc',
      description: 'Early-stage startup building innovative solutions',
      memberCount: 5,
      role: 'member',
      createdAt: '2024-03-10'
    }
  ]);

  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'owner',
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'admin',
      joinedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'member',
      joinedAt: '2024-02-01'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);

  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    description: ''
  });

  const [newMemberForm, setNewMemberForm] = useState({
    email: '',
    role: 'member' as 'owner' | 'admin' | 'member'
  });

  const handleCreateOrganization = async () => {
    if (!newOrgForm.name.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: newOrgForm.name,
        description: newOrgForm.description,
        memberCount: 1,
        role: 'owner',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setOrganizations([newOrg, ...organizations]);
      setNewOrgForm({ name: '', description: '' });
      setIsCreateDialogOpen(false);
      setLoading(false);
      
      toast({
        title: "Organization created",
        description: "Your organization has been created successfully.",
      });
    }, 1000);
  };

  const handleAddMember = async () => {
    if (!newMemberForm.email.trim()) {
      toast({
        title: "Error",
        description: "Member email is required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberForm.email.split('@')[0], // Generate name from email
        email: newMemberForm.email,
        role: newMemberForm.role,
        joinedAt: new Date().toISOString().split('T')[0]
      };

      setMembers([...members, newMember]);
      setNewMemberForm({ email: '', role: 'member' });
      
      // Update organization member count
      if (selectedOrg) {
        setOrganizations(organizations.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, memberCount: org.memberCount + 1 }
            : org
        ));
      }
      
      setLoading(false);
      
      toast({
        title: "Member added",
        description: "New member has been added to the organization.",
      });
    }, 1000);
  };

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      setOrganizations(organizations.filter(org => org.id !== orgId));
      toast({
        title: "Organization deleted",
        description: "The organization has been deleted successfully.",
      });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(member => member.id !== memberId));
      
      // Update organization member count
      if (selectedOrg) {
        setOrganizations(organizations.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, memberCount: Math.max(1, org.memberCount - 1) }
            : org
        ));
      }
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the organization.",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground">
              Manage your organizations and team members
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>
                  Create a new organization to collaborate with your team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    placeholder="Enter organization name"
                    value={newOrgForm.name}
                    onChange={(e) => setNewOrgForm({...newOrgForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="orgDescription">Description (Optional)</Label>
                  <Textarea
                    id="orgDescription"
                    placeholder="Describe your organization"
                    value={newOrgForm.description}
                    onChange={(e) => setNewOrgForm({...newOrgForm, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrganization} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Organization'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card key={org.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {org.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedOrg(org);
                        setIsManageMembersOpen(true);
                      }}>
                        <Users className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      {org.role === 'owner' && (
                        <>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Organization
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Organization
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{org.memberCount} members</span>
                  </div>
                  <Badge variant={getRoleBadgeVariant(org.role)} className="capitalize">
                    {org.role}
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Created {formatDate(org.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Manage Members Dialog */}
        <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Members - {selectedOrg?.name}
              </DialogTitle>
              <DialogDescription>
                Add or remove members from your organization
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Add Member Form */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Member</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({...newMemberForm, email: e.target.value})}
                    className="flex-1"
                  />
                  <Select value={newMemberForm.role} onValueChange={(value: any) => setNewMemberForm({...newMemberForm, role: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddMember} disabled={loading}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                <h4 className="font-medium">Current Members</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getRoleIcon(member.role)}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize">
                          {member.role}
                        </Badge>
                        {member.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsManageMembersOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}