export function GoldDivider({ symbol = '✦' }: { symbol?: string }) {
  return (
    <div className="divider" aria-hidden="true">
      {symbol}
    </div>
  )
}
