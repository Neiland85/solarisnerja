export interface SurgePrediction {
  surge: boolean
  probability: number
}

export function predictTrafficSurge(
  currentRequests: number,
  historicalAverage: number
): SurgePrediction {

  if (historicalAverage === 0) {
    return { surge: false, probability: 0 }
  }

  const ratio = currentRequests / historicalAverage

  if (ratio > 2) {
    return { surge: true, probability: 0.9 }
  }

  if (ratio > 1.5) {
    return { surge: true, probability: 0.6 }
  }

  return { surge: false, probability: 0.1 }

}
