
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import InteractionForm from "@/components/interactions/InteractionForm";
import InteractionList from "@/components/interactions/InteractionList";
import CommentForm from "@/components/comments/CommentForm";
import CommentList from "@/components/comments/CommentList";
import { companyService, interactionService, commentService } from "@/lib/airtable";
import { formatCurrency, STATUS_OPTIONS } from "@/lib/types";
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
  Globe,
  MapPin,
  Building2,
  DollarSign,
  Pencil,
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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

  // Fetch interactions for the company
  const {
    data: interactions,
    isLoading: isLoadingInteractions,
    refetch: refetchInteractions,
  } = useQuery({
    queryKey: ["interactions", id],
    queryFn: () => interactionService.getInteractionsByCompany(id!),
    enabled: !!id,
  });

  // Fetch comments for the company
  const {
    data: comments,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentService.getCommentsByCompany(id!),
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{fields.Name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={fields.Status} />
            {fields.Sector && (
              <span className="text-sm text-muted-foreground">{fields.Sector}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={fields.Status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
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
          
          <Button variant="outline" asChild>
            <a href={`/companies/edit/${id}`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {fields.Website && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={fields.Website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {fields.Website}
              </a>
            </CardContent>
          </Card>
        )}
        
        {fields.Location && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fields.Location}
            </CardContent>
          </Card>
        )}
        
        {fields["Estimated Revenue"] !== undefined && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Estimated Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formatCurrency(fields["Estimated Revenue"])}
            </CardContent>
          </Card>
        )}
      </div>

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
    </Layout>
  );
};

export default CompanyDetails;
