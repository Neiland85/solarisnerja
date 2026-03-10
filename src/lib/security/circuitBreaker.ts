let failureCount = 0
let lastFailure = 0
let state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"

const FAILURE_THRESHOLD = 5
const RECOVERY_TIME = 10000

export function circuitAllow(): boolean {

  if (state === "OPEN") {
    const now = Date.now()

    if (now - lastFailure > RECOVERY_TIME) {
      state = "HALF_OPEN"
      return true
    }

    return false
  }

  return true
}

export function circuitSuccess() {
  failureCount = 0
  state = "CLOSED"
}

export function circuitFailure() {
  failureCount++
  lastFailure = Date.now()

  if (failureCount >= FAILURE_THRESHOLD) {
    state = "OPEN"
  }
}

export function circuitStatus() {
  return {
    state,
    failures: failureCount
  }
}
