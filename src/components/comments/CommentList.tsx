
import { Comment } from "@/lib/supabase";
import { formatDate } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-white">
                  {comment.fields.Author ? comment.fields.Author.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {comment.fields.Author || "User"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.fields.CreatedTime)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">
                  {comment.fields.Content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;
