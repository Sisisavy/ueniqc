// This is the implementation your existing code expects
const API_URL = "https://qc-backend-rkgg.onrender.com";
const request = async (entity, method, options = {}) => {
  const url = `${API_URL}/${entity.toLowerCase()}${options.id ? `/${options.id}` : ""}`;
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: options.data ? JSON.stringify(options.data) : undefined,
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

export const base44 = {
  entities: {
    Ticket: {
      list: () => request("Tickets", "GET"),
      create: (data) => request("Tickets", "POST", { data }),
      update: (id, data) => request("Tickets", "PATCH", { id, data }),
      filter: (params) => request("Tickets", "GET"), // Simplified for now
    },
    QCGuideline: {
      list: () => request("QCGuidelines", "GET"),
      create: (data) => request("QCGuidelines", "POST", { data }),
      update: (id, data) => request("QCGuidelines", "PATCH", { id, data }),
      delete: (id) => request("QCGuidelines", "DELETE", { id }),
    },
    QCReview: {
      create: (data) => request("QCReviews", "POST", { data }),
      filter: (params) => request("QCReviews", "GET"),
    },
    Webhook: {
      list: () => request("Webhooks", "GET"),
      create: (data) => request("Webhooks", "POST", { data }),
      update: (id, data) => request("Webhooks", "PATCH", { id, data }),
      delete: (id) => request("Webhooks", "DELETE", { id }),
    }
  }
};