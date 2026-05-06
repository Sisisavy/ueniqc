export async function runQCReview(ticket, guidelines) {
  // This sends the ticket and guidelines to your backend to be analyzed by OpenAI
  const response = await fetch("https://qc-backend-rkgg.onrender.com/run-qc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket, guidelines }),
  });
  
  if (!response.ok) throw new Error("Failed to run QC review");
  return response.json();
}