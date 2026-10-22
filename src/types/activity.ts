export type ActivityEventType =
  | "payment_received"
  | "status_change"
  | "comment"
<<<<<<< HEAD
  | "co_creator_action";
=======
  | "co_creator_action"
  | "milestone_condition_met"
  | "milestone_released"
  | "dispute_opened"
  | "dispute_evidence_submitted"
  | "dispute_resolved"
  | "dispute_enforced";
>>>>>>> upstream/main

export interface ActivityEvent {
  eventId: string;
  invoiceId: string;
  type: ActivityEventType;
  actor: string;
  timestamp: number;
  meta: Record<string, string | number | boolean>;
}

export interface ActivityEventMessage {
  type: "event";
  event: ActivityEvent;
}

export interface ActivityEventSnapshot {
  type: "snapshot";
  events: ActivityEvent[];
}

<<<<<<< HEAD
export type ActivityFeedMessage = ActivityEventMessage | ActivityEventSnapshot;
=======
export type ActivityFeedMessage = ActivityEventMessage | ActivityEventSnapshot;
>>>>>>> upstream/main
