
import { Interaction } from "@/lib/supabase";
import { formatDate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Users, HelpCircle, Calendar } from "lucide-react";

interface InteractionListProps {
  interactions: Interaction[];
}

const InteractionList = ({ interactions }: InteractionListProps) => {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <p>No interactions recorded yet.</p>
      </div>
    );
  }

  // Helper function to get the appropriate icon for interaction type
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "Call":
        return <Phone className="h-4 w-4" />;
      case "Email":
        return <Mail className="h-4 w-4" />;
      case "Meeting":
        return <Users className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <Card key={interaction.id} className="hover:shadow-sm transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getInteractionIcon(interaction.fields.Type)}
                </div>
                <CardTitle className="text-sm font-medium">
                  {interaction.fields.Type}
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(interaction.fields.Date)}
              </span>
            </div>
          </CardHeader>
          {interaction.fields.Notes && (
            <CardContent className="pt-2">
              <p className="text-sm whitespace-pre-line">{interaction.fields.Notes}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default InteractionList;
