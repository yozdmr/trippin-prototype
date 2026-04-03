import type { CSSProperties } from 'react'

interface BudgetPanelProps {
  total: number
  budget: number
  collaboratorCount: number
  share: number
  spendColor: string
}

export const BudgetPanel = ({
  total,
  budget,
  collaboratorCount,
  share,
  spendColor,
}: BudgetPanelProps) => {
  const spendStyle: CSSProperties = { ['--trip-spend-color' as string]: spendColor }

  return (
    <div className="mx-4 mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-zinc-400">Expenses</p>
        <p className="text-budget-spend text-lg font-semibold tabular-nums" style={spendStyle}>
          ${total.toFixed(2)}
          {budget > 0 ? (
            <span className="text-sm font-normal text-zinc-500"> / ${budget.toFixed(2)}</span>
          ) : null}
        </p>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Per person ({collaboratorCount}):{' '}
        <span className="tabular-nums text-zinc-300">${share.toFixed(2)}</span>
      </p>
    </div>
  )
}
