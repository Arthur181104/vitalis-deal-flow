
import React from "react";
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
import { MapPin, Building2, DollarSign, Award, CheckCircle, Globe } from "lucide-react";
import { formatCurrency } from "@/lib/types";
import { Company } from "@/lib/supabase";
import RatingBadge from "@/components/shared/RatingBadge";
import ApprovalBadge from "@/components/shared/ApprovalBadge";

interface CompanyTabsProps {
  company: Company;
}

const CompanyTabs = ({ company }: CompanyTabsProps) => {
  const { fields } = company;

  return (
    <Tabs defaultValue="general" className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General Info</TabsTrigger>
        <TabsTrigger value="financial">Financials</TabsTrigger>
        <TabsTrigger value="strategic">Strategic Analysis</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <RatingBadge rating={fields.Rating} className="text-base px-3 py-1" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {fields.Rating === "A" && "Excellent opportunity"}
                  {fields.Rating === "B" && "Good potential"}
                  {fields.Rating === "C" && "Average fit"}
                  {fields.Rating === "D" && "Poor match"}
                  {(!fields.Rating || fields.Rating === "Not Rated") && "Not yet rated"}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approval Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ApprovalBadge status={fields.ApprovalStatus} className="text-base px-3 py-1" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {fields.ApprovalStatus === "Approved" && "Ready to proceed"}
                  {fields.ApprovalStatus === "Not Approved" && "Not suitable for acquisition"}
                  {fields.ApprovalStatus === "Under Review" && "Currently being evaluated"}
                  {!fields.ApprovalStatus && "Pending review"}
                </span>
              </div>
            </CardContent>
          </Card>
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fields.Sector}
            </CardContent>
          </Card>

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
      </TabsContent>
      
      <TabsContent value="financial" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Valuation</CardTitle>
              <CardDescription>
                DCF and multiples analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {fields.Notes && fields.Notes.includes("financial") 
                  ? fields.Notes
                  : "No financial valuation data available yet. Update the company to add this information."}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Growth KPIs</CardTitle>
              <CardDescription>
                MAU, ARPU, LTV, CAC, Churn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {fields.Notes && fields.Notes.includes("KPI") 
                  ? fields.Notes
                  : "No growth KPI data available yet. Update the company to add this information."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Financial Projections</CardTitle>
              <CardDescription>
                Three scenarios: pessimistic, neutral, optimistic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {fields.Notes && fields.Notes.includes("projection") 
                  ? fields.Notes
                  : "No financial projections available yet. Update the company to add this information."}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="strategic" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Risk Analysis</CardTitle>
            <CardDescription>
              Competitive landscape and market position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">
              {fields.Notes && fields.Notes.includes("strategic") 
                ? fields.Notes
                : "No strategic risk analysis available yet. Update the company to add this information."}
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CompanyTabs;
