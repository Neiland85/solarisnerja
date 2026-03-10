<div align="center">

# ⚡ Next.js OSS Contributions

<svg width="100%" height="120" viewBox="0 0 800 120">
  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="#00f2ff">
        <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#ff00c8">
        <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect x="0" y="40" width="800" height="40" fill="url(#grad)" opacity="0.6"/>
</svg>

Contributions to **Next.js core** focused on:

• caching internals  
• serialization safety  
• performance improvements  
• runtime correctness  

</div>

---

# Overview

This repository documents experiments and contributions related to the **Next.js core runtime**, especially around caching and serialization safety.

---

# Key Contribution

### Cache Invocation Key Fix

Original code:

\`\`\`ts
JSON.stringify(args)
\`\`\`

Problem:

\`\`\`
undefined → null
\`\`\`

This could collapse cache keys.

Solution:

\`\`\`ts
JSON.stringify(
  args,
  (_, value) => (value === undefined ? "__undefined__" : value)
)
\`\`\`

---

# Performance Improvement

Original implementation:

\`\`\`ts
for (const tag of tags) {
  if (!collectedTags.includes(tag)) {
    collectedTags.push(tag)
  }
}
\`\`\`

Complexity:

\`\`\`
O(n²)
\`\`\`

Optimized implementation:

\`\`\`ts
const tagSet = new Set(collectedTags)

for (const tag of tags) {
  tagSet.add(tag)
}

workUnitStore.tags = Array.from(tagSet)
\`\`\`

Complexity:

\`\`\`
O(n)
\`\`\`

---

# Tech Stack

- TypeScript
- Next.js internals
- Incremental Cache
- AsyncLocalStorage
- Turbopack

---

# Author

Neil Muñoz Lago  
Senior Backend Architect — Distributed Systems

