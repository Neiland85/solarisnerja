import { describe, it, expect } from "vitest"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"

describe("contracts: lead.create.json", () => {
  it("compiles under AJV 2020 and accepts valid payload", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "user@example.com",
      eventId: "music",
    })

    expect(ok).toBe(true)
  })

  it("rejects invalid payload", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "not-an-email",
      eventId: "",
    })

    expect(ok).toBe(false)
  })

  it("accepts valid payload with honeypot company field set", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "user@example.com",
      eventId: "music",
      company: "some value",
    })

    expect(ok).toBe(true)
  })

  it("rejects various invalid email formats", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const invalidEmails = [
      "plainaddress",
      "@no-local-part.com",
      "no-at-symbol.com",
      "user@",
      "user@domain",
      "user@domain..com",
    ]

    for (const email of invalidEmails) {
      const ok = validate({
        email,
        eventId: "music",
      })

      expect(ok).toBe(false)
    }
  })

  it("rejects payload with empty eventId", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "user@example.com",
      eventId: "",
    })

    expect(ok).toBe(false)
  })

  it("rejects payload missing email", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      // email is intentionally omitted
      eventId: "music",
    } as Record<string, unknown>)

    expect(ok).toBe(false)
  })

  it("rejects payload missing eventId", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "user@example.com",
      // eventId is intentionally omitted
    } as Record<string, unknown>)

    expect(ok).toBe(false)
  })

  it("rejects payload with additional properties", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "user@example.com",
      eventId: "music",
      extraField: "should not be allowed",
    } as Record<string, unknown>)

    expect(ok).toBe(false)
  })
})
