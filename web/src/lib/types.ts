export type Role = 'creator' | 'reviewer' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  org_id?: string;
  created_at: string;
}

export interface Rule {
  id: string;
  type: 'terminology' | 'voice' | 'accessibility' | 'claims' | 'privacy';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  source_ref: string;
  owner: string;
  active: boolean;
  version: string;
  examples_allowed: string[];
  examples_banned: string[];
  created_at: string;
}

export interface ClaimLedgerItem {
  id: string;
  claim_text: string;
  source: string;
  owner: string;
  valid_until: string;
  status: 'verified' | 'expires_soon' | 'expired';
  days_until_expiry: number;
  created_at: string;
}

export interface ConfidentialTerm {
  id: string;
  term: string;
  replacement_hint: string;
  created_at: string;
}

export interface IntentLock {
  goal: string;
  audience: string;
  key_message: string;
  tone: string;
  must_keep_phrases: string[];
  call_to_action: string;
  status: 'locked' | 'at_risk';
  reason?: string;
}

export interface Finding {
  id: string;
  submission_id: string;
  rule_id?: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  span_start: number;
  span_end: number;
  quote: string;
  message: string;
  source_cited: string;
  suggestion: string;
  confidence: number;
  origin: 'deterministic' | 'ai';
  decision?: 'accept' | 'reject' | null;
  decided_by?: string;
  decided_at?: string;
}

export interface Comment {
  id: string;
  submission_id: string;
  user_id: string;
  user_name?: string;
  text: string;
  created_at: string;
}

export interface Passport {
  id: string;
  submission_id: string;
  content_hash: string;
  rules_version: string;
  approver_id: string;
  approver_name?: string;
  ai_used: boolean;
  ai_model: string;
  redactions_count: number;
  summary_json: {
    total_findings: number;
    accepted_fixes: number;
    rejected_fixes: number;
    claims_cited: string[];
    rules_cited: string[];
    issued_at_iso?: string;
  };
  issued_at: string;
}

export interface Submission {
  id: string;
  creator_id: string;
  creator_name?: string;
  title: string;
  original_text: string;
  revised_text: string;
  input_type: string;
  intent?: IntentLock;
  status: 'draft' | 'analyzed' | 'pending_approval' | 'approved' | 'changes_requested';
  ai_status?: 'active' | 'offline_fallback' | 'daily_cap_exceeded' | string;
  ai_model?: string;
  ai_notice?: string;
  findings: Finding[];
  comments: Comment[];
  passport?: Passport;
  created_at: string;
  updated_at: string;
}

export interface DemoPost {
  id: string;
  title: string;
  description: string;
  text: string;
}

export interface HealthRadarItem {
  rule_id: string;
  title: string;
  type: string;
  reject_rate: number;
  total_decisions: number;
  is_unclear: boolean;
  clarified_clause?: string;
  example_allowed?: string;
  example_banned?: string;
}

export interface InsightsData {
  total_submissions: number;
  total_approved: number;
  total_findings_caught: number;
  avg_approval_time_hours: number;
  repeated_mistakes: Array<{
    rule_id: string;
    title: string;
    count: number;
    severity: string;
  }>;
  most_overridden_rules: Array<{
    rule_id: string;
    title: string;
    overrides: number;
    override_rate: string;
  }>;
  findings_by_type: Record<string, number>;
  drift_by_category: Array<{
    week: string;
    terminology: number;
    claims: number;
    tone: number;
  }>;
}

export interface AIUsageLogItem {
  id: string;
  submission_id?: string;
  model: string;
  purpose: string;
  redactions_count: number;
  created_at: string;
}
