import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, AlertTriangle, CheckCircle, Clock, Zap, Loader2 } from "lucide-react";

// Local imports using relative paths to avoid configuration errors
import { base44 } from "../api/base44Client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import PageHeader from "../components/shared/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import ScoreChart from "../components/dashboard/ScoreChart";
import RecentTicketsTable from "../components/dashboard/RecentTicketsTable";
import { runQCReview } from "../lib/qcEngine";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [reviewingId, setReviewingId] = useState(null);

  const { data: tickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => base44.entities.Ticket.list("-created_date", 100),
  });

  const { data: guidelines = [] } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => base44.entities.QCGuideline.list(),
  });

  const runAllPendingMutation = useMutation({
    mutationFn: async () => {
      const pending = tickets.filter(t => t.qc_status === "pending");
      for (const ticket of pending) {
        setReviewingId(ticket.id);
        const result = await runQCReview(ticket, guidelines);
        await base44.entities.QCReview.create({
          ticket_id: String(ticket.id),
          ...result,
          reviewed_by: "AI Auto-QC",
        });
        await base44.entities.Ticket.update(ticket.id, {
          qc_status: result.status,
          qc_score: result.overall_score,
        });
      }
      setReviewingId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("All pending tickets reviewed");
    },
    onError: (err) => {
      setReviewingId(null);
      toast.error("QC review failed: " + err.message);
    },
  });

  const pendingCount = tickets.filter(t => t.qc_status === "pending").length;
  const passedCount = tickets.filter(t => t.qc_status === "passed").length;
  const failedCount = tickets.filter(t => t.qc_status === "failed").length;
  const avgScore = tickets.filter(t => t.qc_score != null).length > 0
    ? Math.round(tickets.filter(t => t.qc_score != null).reduce((sum, t) => sum + t.qc_score, 0) / tickets.filter(t => t.qc_score != null).length)
    : "—";

  const recentReviewed = tickets
    .filter(t => t.qc_status !== "pending")
    .slice(0, 10);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <PageHeader
        title="QC Dashboard"
        description="Monitor quality control of customer service interactions"
      >
        {pendingCount > 0 && (
          <Button
            onClick={() => runAllPendingMutation.mutate()}
            disabled={runAllPendingMutation.isPending || guidelines.length === 0}
            className="gap-2"
          >
            {runAllPendingMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Review {pendingCount} Pending
          </Button>
        )}
      </PageHeader>

      {loadingTickets ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Tickets" value={tickets.length} icon={FileText} variant="info" />
            <StatCard label="Passed" value={passedCount} icon={CheckCircle} variant="success" />
            <StatCard label="Failed" value={failedCount} icon={AlertTriangle} variant="danger" />
            <StatCard label="Avg Score" value={avgScore} icon={Clock} variant="default" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 rounded-2xl border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="font-display text-xl font-light tracking-wide">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RecentTicketsTable tickets={recentReviewed} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="font-display text-xl font-light tracking-wide">Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreChart tickets={tickets} />
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  {[
                    { label: "Passed", color: "bg-green-400" },
                    { label: "Failed", color: "bg-rose-400" },
                    { label: "Warning", color: "bg-amber-400" },
                    { label: "Pending", color: "bg-stone-300" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {pendingCount > 0 && (
            <div className="border border-amber-300/50 bg-amber-50/60 px-5 py-4 flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs tracking-widest uppercase text-amber-700">
                <span className="font-medium">{pendingCount} ticket{pendingCount > 1 ? "s" : ""}</span>{" "}
                pending review.
                {reviewingId && <span className="text-amber-500/70 ml-1">Processing...</span>}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}