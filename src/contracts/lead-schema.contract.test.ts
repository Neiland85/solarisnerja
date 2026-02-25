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
      eventId: "music"
    })

    expect(ok).toBe(true)
  })

  it("rejects invalid payload", () => {
    const ajv = new Ajv2020()
    addFormats(ajv)

    const validate = ajv.compile(schema)

    const ok = validate({
      email: "not-an-email",
      eventId: ""
    })

    expect(ok).toBe(false)
  })
})
