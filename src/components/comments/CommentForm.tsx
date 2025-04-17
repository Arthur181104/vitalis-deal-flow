
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
  FormMessage,
} from "@/components/ui/form";
import { commentService } from "@/lib/airtable";
import { toast } from "@/components/ui/sonner";

// Comment form schema
const commentFormSchema = z.object({
  Content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  companyId: string;
  onSuccess: () => void;
}

const CommentForm = ({ companyId, onSuccess }: CommentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      Content: "",
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Format the data for Airtable
      await commentService.createComment({
        Content: data.Content,
        CompanyId: [companyId],
        Author: "User", // In a real app, this would come from authentication
      });
      
      // Reset the form
      form.reset();
      
      // Call the success callback
      onSuccess();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="Content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add a comment or note..."
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
            {isSubmitting ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
