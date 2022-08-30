import { ActivityEventType } from "./ActivityEventType"

export type ActivityEventDto = {
    type: ActivityEventType,
    timestamp: Date,
    payload: Record<string, unknown>
}