let failures = 0
let openUntil = 0

const MAX_FAILURES = 5
const COOLDOWN = 10000

export function dbAvailable() {

  if (Date.now() < openUntil) {
    return false
  }

  return true
}

export function registerFailure() {

  failures++

  if (failures >= MAX_FAILURES) {
    openUntil = Date.now() + COOLDOWN
    failures = 0
  }

}

export function registerSuccess() {
  failures = 0
}
