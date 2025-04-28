
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import RatingBadge from "@/components/shared/RatingBadge";
import ApprovalBadge from "@/components/shared/ApprovalBadge";
import InteractionForm from "@/components/interactions/InteractionForm";
import InteractionList from "@/components/interactions/InteractionList";
import CommentForm from "@/components/comments/CommentForm";
import CommentList from "@/components/comments/CommentList";
import CompanyTabs from "@/components/companies/CompanyTabs";
import { companyService } from "@/lib/supabase";
import { formatDate, STATUS_OPTIONS, RATING_OPTIONS, APPROVAL_STATUS_OPTIONS } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch company details
  const { 
    data: company, 
    isLoading: isLoadingCompany, 
    error: companyError 
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getCompanyById(id!),
    enabled: !!id,
  });

  // Declare interactions and comments queries
  const {
    data: interactions = [],
    isLoading: isLoadingInteractions,
    refetch: refetchInteractions
  } = useQuery({
    queryKey: ["interactions", id],
    queryFn: async () => {
      // This function will need to be implemented in the interactions service
      return [];
    },
    enabled: !!id,
  });

  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      // This function will need to be implemented in the comments service
      return [];
    },
    enabled: !!id,
  });

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    if (!id || !company) return;
    try {
      await companyService.updateCompany(id, { 
        Status: newStatus as any 
      });
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle rating update
  const handleRatingChange = async (newRating: string) => {
    if (!id || !company) return;
    try {
      await companyService.updateCompany(id, { 
        Rating: newRating as any 
      });
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success(`Rating updated to ${newRating}`);
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Failed to update rating");
    }
  };

  // Handle approval status update
  const handleApprovalStatusChange = async (newStatus: string) => {
    if (!id || !company) return;
    try {
      await companyService.updateCompany(id, { 
        ApprovalStatus: newStatus as any 
      });
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success(`Approval status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Failed to update approval status");
    }
  };

  // Handle company deletion
  const handleDeleteCompany = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await companyService.deleteCompany(id);
      setIsDeleteDialogOpen(false);
      toast.success("Company deleted successfully");
      navigate("/companies");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingCompany) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-[400px] w-full mt-6" />
        </div>
      </Layout>
    );
  }

  if (companyError || !company) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Company not found</h2>
          <p className="text-muted-foreground mb-6">The company you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/companies")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>
      </Layout>
    );
  }

  const { fields } = company;
  const lastUpdated = fields.CreatedTime 
    ? new Date(fields.CreatedTime)
    : new Date();

  return (
    <Layout>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/companies")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Companies
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{fields.Name}</h1>
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <StatusBadge status={fields.Status} />
            <RatingBadge rating={fields.Rating} />
            <ApprovalBadge status={fields.ApprovalStatus} />
            {fields.Sector && (
              <span className="text-sm text-muted-foreground">{fields.Sector}</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Last updated: {formatDate(lastUpdated.toISOString())}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={fields.Status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={fields.Rating || "Not Rated"} 
            onValueChange={handleRatingChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Change Rating" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating.value} value={rating.value}>
                  {rating.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={fields.ApprovalStatus || "Under Review"} 
            onValueChange={handleApprovalStatusChange}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Change Approval Status" />
            </SelectTrigger>
            <SelectContent>
              {APPROVAL_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" asChild>
            <a href={`/companies/edit/${id}`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </a>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Company Tabs Component */}
      <CompanyTabs company={company} />

      {fields.Notes && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Company Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{fields.Notes}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="interactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments & Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="interactions" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Log New Interaction</CardTitle>
              <CardDescription>
                Record calls, emails, meetings, or other interactions with this company.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractionForm 
                companyId={id!} 
                onSuccess={() => refetchInteractions()} 
              />
            </CardContent>
          </Card>
          
          <h3 className="font-medium text-lg mt-8 mb-4">Interaction History</h3>
          {isLoadingInteractions ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <InteractionList interactions={interactions || []} />
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
              <CardDescription>
                Add internal notes or comments for the team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentForm 
                companyId={id!} 
                onSuccess={() => refetchComments()} 
              />
            </CardContent>
          </Card>
          
          <h3 className="font-medium text-lg mt-8 mb-4">Comments & Notes</h3>
          {isLoadingComments ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <CommentList comments={comments || []} />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this company?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company
              record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCompany();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CompanyDetails;
