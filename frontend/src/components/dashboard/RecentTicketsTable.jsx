import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import QCStatusBadge from "../shared/QCStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function RecentTicketsTable({ tickets }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No tickets reviewed yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticket</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>
              <p className="font-medium">{ticket.subject}</p>
              <p className="text-xs text-muted-foreground">{ticket.ticket_id}</p>
            </TableCell>
            <TableCell>{ticket.agent_name}</TableCell>
            <TableCell className="capitalize">{ticket.category?.replace("_", " ") || "—"}</TableCell>
            <TableCell className="font-mono">{ticket.qc_score != null ? ticket.qc_score : "—"}</TableCell>
            <TableCell>
              <QCStatusBadge status={ticket.qc_status || "pending"} />
            </TableCell>
            <TableCell>
              <Link to={`/tickets/${ticket.id}`} className="hover:text-primary">
                <ExternalLink className="w-4 h-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}