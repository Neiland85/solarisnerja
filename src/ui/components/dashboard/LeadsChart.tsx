export default function LeadsChart({ data }: { data: any }) {
  return (
    <div className="bg-white border border-[var(--sn-border)] p-8">
      <p className="editorial-label mb-2">leads últimas 24h</p>
      <pre className="text-sm text-[var(--sn-muted)]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
