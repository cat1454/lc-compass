/**
 * Navigation Engine Types for LC Compass
 * Ported from design/compass/simulate.py
 */

export type Domain =
  | "cu_tru"
  | "kinh_doanh"
  | "hoc_tap"
  | "y_te"
  | "an_sinh"
  | "viec_lam"
  | "moi_truong"
  | "dia_diem"
  | "van_hoa"
  | "du_lich_su_kien";

export interface Intent {
  id: string;
  domain: Domain;
  goal: string;
  benefit: string;
}

export type ProfileMode =
  | "self"
  | "low_literacy"
  | "no_device"
  | "shift"
  | "shared"
  | "mobility"
  | "proxy_yes"
  | "proxy_no"
  | "language"
  | "returning";

export interface Profile {
  id: string;
  name: string;
  mode: ProfileMode;
  adaptation: string;
}

export type StressFlag =
  | "clean"
  | "unknown_area"
  | "outside"
  | "stale"
  | "conflict"
  | "missing_fact"
  | "sensitive"
  | "offline"
  | "ai_down"
  | "urgent";

export interface Stress {
  id: string;
  name: string;
  flag: StressFlag;
  hazard: string;
}

export type ActionType =
  | "PREPARE"
  | "ASK_AREA"
  | "OUTSIDE"
  | "REVIEW_SOURCE"
  | "ASK_FACT"
  | "REMOVE_SENSITIVE"
  | "OFFLINE_VIEW"
  | "URGENT_HELP"
  | "GENERAL_ONLY"
  | "LANGUAGE_HELP"
  | "OFFICIAL_REDIRECT";

export type OutputType = "SERVICE" | "PLACE" | "DISCOVER" | "OUT_OF_SCOPE";

export interface NavigationDecideInput {
  intentId: string;
  profileMode: ProfileMode;
  flags: Set<StressFlag> | StressFlag[];
  supportedIntentIds?: Set<string>;
}

export interface NavigationResult {
  action: ActionType;
  reason: string;
  actionText: string;
  outputType: OutputType;
  targetCardIds: string[];
}
