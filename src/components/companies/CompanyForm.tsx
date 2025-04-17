
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company, companyService } from "@/lib/airtable";
import { SECTOR_OPTIONS, STATUS_OPTIONS, CompanyStatus } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

// Company form schema
const companyFormSchema = z.object({
  Name: z.string().min(1, "Company name is required"),
  Sector: z.string().min(1, "Sector is required"),
  "Estimated Revenue": z.string().optional(),
  Location: z.string().optional(),
  Status: z.enum([
    "Contacted", 
    "In Analysis", 
    "LOI Sent", 
    "Due Diligence", 
    "Closed", 
    "Archived"
  ], {
    required_error: "Status is required"
  }),
  Website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  Notes: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company;
  onSuccess?: (company: Company) => void;
}

const CompanyForm = ({ company, onSuccess }: CompanyFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!company;

  // Initialize form with existing data if editing
  const defaultValues: Partial<CompanyFormData> = {
    Name: company?.fields.Name || "",
    Sector: company?.fields.Sector || "",
    "Estimated Revenue": company?.fields["Estimated Revenue"]?.toString() || "",
    Location: company?.fields.Location || "",
    Status: company?.fields.Status || "Contacted",
    Website: company?.fields.Website || "",
    Notes: company?.fields.Notes || "",
  };

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert estimated revenue to number if provided
      const formattedData = {
        ...data,
        "Estimated Revenue": data["Estimated Revenue"] 
          ? parseInt(data["Estimated Revenue"], 10) 
          : undefined,
        Status: data.Status as CompanyStatus
      };

      let result;
      if (isEditing && company) {
        result = await companyService.updateCompany(company.id, formattedData);
      } else {
        result = await companyService.createCompany(formattedData);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate(`/companies/${result.id}`);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to save company`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sector*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SECTOR_OPTIONS.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Estimated Revenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Revenue ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter estimated revenue" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State/Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="Notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes about this company"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Company" : "Add Company"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
