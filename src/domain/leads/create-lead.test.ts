import { describe, it, expect } from "vitest"
import { createLead } from "./create-lead"

describe("createLead", () => {
  it("normalizes email to lowercase and sets createdAt", () => {
    const lead = createLead({
      email: "TEST@EXAMPLE.COM",
      eventId: "music",
      ipAddress: "192.168.1.1",
      consentGiven: true,
    })
    expect(lead.email).toBe("test@example.com")
    expect(lead.eventId).toBe("music")
    expect(lead.ipAddress).toBe("192.168.1.1")
    expect(lead.consentGiven).toBe(true)
    expect(lead.createdAt).toBeInstanceOf(Date)
    expect(typeof lead.id).toBe("string")
    expect(lead.id.length).toBeGreaterThan(10)
  })
})
