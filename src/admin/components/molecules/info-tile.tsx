import { Text, clx } from "@medusajs/ui"
import { ArrowUpMini, ArrowDownMini } from "@medusajs/icons"

import { FormattedPrice } from "../atoms/price"

interface InfoTileProps {
  title: string
  amount: number
  amountToCompare: number
  currency?: string
  onClick?: () => void
  selected?: boolean
}

const InfoTile = ({
  title,
  amount,
  amountToCompare,
  currency,
  onClick,
  selected = false,
}: InfoTileProps) => {
  let valueChange: number = 0

  if (amount && amountToCompare) {
    valueChange = ((amount - amountToCompare) / amountToCompare) * 100
  }

  return (
    <div
      className={clx("cursor-pointer rounded-lg p-8 transition-all hover:bg-gray-50", {
        "bg-gray-50": selected,
      })}
      onClick={onClick}
    >
      <div className="flex items-baseline gap-1">
        {currency ? (
          <>
            <Text weight="plus" className="text-xl">
              <FormattedPrice amount={amount} currency={currency} />
            </Text>

            <Text weight="plus" className="uppercase text-gray-500">
              {currency}
            </Text>
          </>
        ) : (
          <Text weight="plus" className="text-xl">
            {amount}
          </Text>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Text size="small" className="text-gray-500">
          {title}
        </Text>

        {valueChange !== 0 && (
          <Text
            size="small"
            className={clx("flex items-center", {
              "text-emerald-500": valueChange > 0,
              "text-rose-500": valueChange < 0,
            })}
          >
            {valueChange > 0 ? <ArrowUpMini /> : <ArrowDownMini />}
            {Math.abs(valueChange).toFixed(2)}%
          </Text>
        )}
      </div>
    </div>
  )
}

export default InfoTile
