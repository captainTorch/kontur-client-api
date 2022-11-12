import { ActivityEventType } from "./ActivityEventType"

export type ActivityEvent = {
    type: ActivityEventType,
    timestamp: Date,
    payload: Record<string, unknown>
}