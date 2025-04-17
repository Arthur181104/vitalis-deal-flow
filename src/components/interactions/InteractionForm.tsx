
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { interactionService } from "@/lib/airtable";
import { INTERACTION_TYPE_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

// Interaction form schema
const interactionFormSchema = z.object({
  Date: z.date({ required_error: "Date is required" }),
  Type: z.string().min(1, "Interaction type is required"),
  Notes: z.string().optional(),
});

type InteractionFormData = z.infer<typeof interactionFormSchema>;

interface InteractionFormProps {
  companyId: string;
  onSuccess: () => void;
}

const InteractionForm = ({ companyId, onSuccess }: InteractionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InteractionFormData>({
    resolver: zodResolver(interactionFormSchema),
    defaultValues: {
      Date: new Date(),
      Type: "",
      Notes: "",
    },
  });

  const onSubmit = async (data: InteractionFormData) => {
    try {
      setIsSubmitting(true);
      
      // Format the data for Airtable
      await interactionService.createInteraction({
        Date: format(data.Date, "yyyy-MM-dd"),
        Type: data.Type as any,
        Notes: data.Notes,
        CompanyId: [companyId],
      });
      
      // Reset the form
      form.reset({
        Date: new Date(),
        Type: "",
        Notes: "",
      });
      
      // Call the success callback
      onSuccess();
    } catch (error) {
      console.error("Error submitting interaction:", error);
      toast.error("Failed to log interaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="Date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Interaction*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interaction type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INTERACTION_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Enter details about the interaction"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Interaction"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InteractionForm;
