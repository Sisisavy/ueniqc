import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ShieldCheck, Scale, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "../api/base44Client";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import PageHeader from "../components/shared/PageHeader";

export default function GuidelinesPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newG, setNewG] = useState({ name: "", description: "", weight: 5 });

  // 1. Fetch existing guidelines
  const { data: guidelines = [], isLoading } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => base44.entities.QCGuideline.list(),
  });

  // 2. Create Mutation
  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.QCGuideline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      setIsAdding(false);
      setNewG({ name: "", description: "", weight: 5 });
      toast.success("Guideline added!");
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.QCGuideline.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      toast.success("Guideline removed");
    },
  });

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <PageHeader 
        title="QC Guidelines" 
        description="Define the criteria the AI uses to grade your support tickets"
      >
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Criteria
        </Button>
      </PageHeader>

      <div className="grid gap-4">
        {isAdding && (
          <Card className="border-sidebar-primary/30 bg-sidebar-primary/5">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Criteria Name (e.g. Professionalism)"
                  className="bg-white border p-2 rounded-md text-sm"
                  value={newG.name}
                  onChange={(e) => setNewG({ ...newG, name: e.target.value })}
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Weight: {newG.weight}</span>
                  <input
                    type="range" min="1" max="10"
                    className="flex-1"
                    value={newG.weight}
                    onChange={(e) => setNewG({ ...newG, weight: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <textarea
                placeholder="Describe exactly what the AI should look for..."
                className="w-full bg-white border p-2 rounded-md text-sm h-20"
                value={newG.description}
                onChange={(e) => setNewG({ ...newG, description: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={() => addMutation.mutate(newG)} disabled={!newG.name}>Save Guideline</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />
        ) : (
          guidelines.map((g) => (
            <Card key={g.id} className="group hover:border-sidebar-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-sidebar-primary/10 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-sidebar-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium">{g.name}</h3>
                    <p className="text-sm text-muted-foreground max-w-xl">{g.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Scale className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                        Impact Weight: {g.weight}/10
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate(g.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        {guidelines.length === 0 && !isAdding && (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-muted-foreground">No guidelines set. The AI won't know how to grade!</p>
          </div>
        )}
      </div>
    </div>
  );
}