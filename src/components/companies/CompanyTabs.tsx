
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
import { MapPin, Building2, DollarSign, Award, CheckCircle, Globe, TrendingUp, BarChart, FileText } from "lucide-react";
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
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Financial Valuation
              </CardTitle>
              <CardDescription>
                DCF and multiples analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">DCF Model</h4>
                <p className="text-muted-foreground text-sm">
                  {fields.Notes && fields.Notes.includes("DCF") 
                    ? fields.Notes
                    : "Enter DCF valuation data here. Include discount rate, growth assumptions, and terminal value."}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Multiple Analysis</h4>
                <p className="text-muted-foreground text-sm">
                  {fields.Notes && fields.Notes.includes("multiple") 
                    ? fields.Notes
                    : "Enter multiple-based valuation here. Include EV/EBITDA, P/E ratios, and comparable companies."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Growth KPIs
              </CardTitle>
              <CardDescription>
                Key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">MAU</h4>
                  <p className="text-muted-foreground text-sm">Not specified</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">ARPU</h4>
                  <p className="text-muted-foreground text-sm">Not specified</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">LTV</h4>
                  <p className="text-muted-foreground text-sm">Not specified</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">CAC</h4>
                  <p className="text-muted-foreground text-sm">Not specified</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Churn Rate</h4>
                  <p className="text-muted-foreground text-sm">Not specified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Financial Projections
              </CardTitle>
              <CardDescription>
                Three scenarios: pessimistic, neutral, optimistic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 bg-red-50/30 dark:bg-red-900/10">
                  <h4 className="font-medium">Pessimistic Scenario</h4>
                  <p className="text-muted-foreground text-sm mt-2">
                    {fields.Notes && fields.Notes.includes("pessimistic") 
                      ? fields.Notes
                      : "Enter pessimistic projections here. Include revenue growth, margins, and cash flow assumptions."}
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-blue-50/30 dark:bg-blue-900/10">
                  <h4 className="font-medium">Neutral Scenario</h4>
                  <p className="text-muted-foreground text-sm mt-2">
                    {fields.Notes && fields.Notes.includes("neutral") 
                      ? fields.Notes
                      : "Enter neutral projections here. Include revenue growth, margins, and cash flow assumptions."}
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-green-50/30 dark:bg-green-900/10">
                  <h4 className="font-medium">Optimistic Scenario</h4>
                  <p className="text-muted-foreground text-sm mt-2">
                    {fields.Notes && fields.Notes.includes("optimistic") 
                      ? fields.Notes
                      : "Enter optimistic projections here. Include revenue growth, margins, and cash flow assumptions."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="strategic" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Strategic Risk Analysis
            </CardTitle>
            <CardDescription>
              Competitive landscape and market position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Market Analysis</h3>
                <p className="whitespace-pre-line text-muted-foreground">
                  {fields.Notes && fields.Notes.includes("market") 
                    ? fields.Notes
                    : "Enter market analysis here. Include market size, growth trends, and competitive landscape."}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">SWOT Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 bg-blue-50/30 dark:bg-blue-900/10">
                    <h4 className="font-medium">Strengths</h4>
                    <p className="text-muted-foreground text-sm mt-2">
                      {fields.Notes && fields.Notes.includes("strengths") 
                        ? fields.Notes
                        : "Enter strengths here."}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-red-50/30 dark:bg-red-900/10">
                    <h4 className="font-medium">Weaknesses</h4>
                    <p className="text-muted-foreground text-sm mt-2">
                      {fields.Notes && fields.Notes.includes("weaknesses") 
                        ? fields.Notes
                        : "Enter weaknesses here."}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-green-50/30 dark:bg-green-900/10">
                    <h4 className="font-medium">Opportunities</h4>
                    <p className="text-muted-foreground text-sm mt-2">
                      {fields.Notes && fields.Notes.includes("opportunities") 
                        ? fields.Notes
                        : "Enter opportunities here."}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-yellow-50/30 dark:bg-yellow-900/10">
                    <h4 className="font-medium">Threats</h4>
                    <p className="text-muted-foreground text-sm mt-2">
                      {fields.Notes && fields.Notes.includes("threats") 
                        ? fields.Notes
                        : "Enter threats here."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Qualitative Insights</h3>
                <p className="whitespace-pre-line text-muted-foreground">
                  {fields.Notes && fields.Notes.includes("qualitative") 
                    ? fields.Notes
                    : "Enter qualitative insights here. Include management team assessment, company culture, and other non-financial factors."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CompanyTabs;
