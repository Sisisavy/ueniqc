import { useState, useRef } from "react"; // added useRef
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, AlertTriangle, CheckCircle, Clock, Zap, Loader2, Upload } from "lucide-react"; // added Upload
import Papa from "papaparse"; // added Papa

// Local imports
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
  const fileInputRef = useRef(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: tickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => base44.entities.Ticket.list("-created_date", 100),
  });

  const { data: guidelines = [] } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => base44.entities.QCGuideline.list(),
  });

  // --- CSV UPLOAD LOGIC ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // We loop through each row of the CSV and create a ticket
          for (const row of results.data) {
            await base44.entities.Ticket.create({
              customer_name: row.customer_name || "Unknown",
              subject: row.subject || "No Subject",
              content: row.content || row.message || "", // matches common CSV headers
              qc_status: "pending",
              created_date: new Date().toISOString()
            });
          }
          toast.success(`Successfully uploaded ${results.data.length} tickets`);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        } catch (error) {
          toast.error("Failed to upload tickets: " + error.message);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    });
  };

  // --- QC REVIEW LOGIC ---
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
        <div className="flex gap-3">
          {/* Hidden File Input */}
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload CSV
          </Button>

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
        </div>
      </PageHeader>

      {/* ... (rest of your existing UI remains the same) */}
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