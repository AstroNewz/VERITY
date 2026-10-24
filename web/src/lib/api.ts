const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_URL = `${API_BASE}/api/v1`;

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("verity_token");
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errDetail = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errDetail = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch (_) {}
      throw new Error(errDetail);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API Call failed [${options.method || "GET"} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  auth: {
    demoLogin: (role: string) =>
      request<{ access_token: string; user: any }>("/auth/demo-login", {
        method: "POST",
        body: JSON.stringify({ role }),
      }),
    getMe: () => request<any>("/auth/me"),
    resetDemo: () => request<{ status: string; message: string }>("/auth/reset-demo", { method: "POST" }),
    getDemoPosts: () => request<any[]>("/auth/demo-posts"),
  },
  rules: {
    list: () => request<any[]>("/rules"),
    get: (id: string) => request<any>(`/rules/${id}`),
    create: (data: any) => request<any>("/rules", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/rules/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },
  ledger: {
    list: () => request<any[]>("/ledger"),
    create: (data: any) => request<any>("/ledger", { method: "POST", body: JSON.stringify(data) }),
  },
  confidential: {
    list: () => request<any[]>("/confidential-terms"),
    create: (data: any) => request<any>("/confidential-terms", { method: "POST", body: JSON.stringify(data) }),
  },
  submissions: {
    create: (data: { title: string; original_text: string; input_type?: string }) =>
      request<any>("/submissions", { method: "POST", body: JSON.stringify(data) }),
    get: (id: string) => request<any>(`/submissions/${id}`),
    analyze: (id: string) => request<any>(`/submissions/${id}/analyze`, { method: "POST" }),
    updateFinding: (findingId: string, decision: "accept" | "reject") =>
      request<any>(`/findings/${findingId}`, { method: "PATCH", body: JSON.stringify({ decision }) }),
    revise: (id: string, revised_text?: string) =>
      request<any>(`/submissions/${id}/revise`, { method: "POST", body: JSON.stringify({ revised_text }) }),
    submit: (id: string) => request<any>(`/submissions/${id}/submit`, { method: "POST" }),
    listApprovals: () => request<any[]>("/submissions/approvals"),
    review: (id: string, action: "approve" | "changes", comment?: string) =>
      request<any>(`/submissions/${id}/review`, { method: "POST", body: JSON.stringify({ action, comment }) }),
    addComment: (id: string, text: string) =>
      request<any>(`/submissions/${id}/comments`, { method: "POST", body: JSON.stringify({ text }) }),
  },
  passports: {
    get: (id: string) => request<any>(`/passports/${id}`),
    verify: (id: string) => request<any>(`/passports/${id}/verify`),
  },
  radar: {
    get: () => request<any[]>("/radar"),
    draftClause: (ruleId: string) => request<any>(`/radar/${ruleId}/draft-clause`, { method: "POST" }),
    approve: (ruleId: string) => request<any>(`/radar/${ruleId}/approve`, { method: "POST" }),
  },
  insights: {
    get: () => request<any>("/insights"),
  },
  aiLogs: {
    list: () => request<any[]>("/ai-logs"),
  },
};
