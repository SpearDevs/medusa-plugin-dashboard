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
  amount,
  currency,
  amountToCompare,
  title,
  onClick,
  selected = false,
}: InfoTileProps) => {
  let valueChange: number = 0

  if (amountToCompare !== 0) {
    valueChange = ((amount - amountToCompare) / amountToCompare) * 100
  }

  return (
    <div
      className={clx("rounded-md p-8 cursor-pointer hover:bg-gray-50", {
        "bg-gray-50": selected,
      })}
      onClick={onClick}
    >
      <div className="flex items-baseline gap-1">
        {currency ? (
          <>
            <Text className="text-xl font-medium">
              <FormattedPrice amount={amount} currency={currency} />
            </Text>
            <Text className="font-medium text-gray-500 uppercase">
              {currency}
            </Text>
          </>
        ) : (
          <Text className="text-xl font-medium">{amount}</Text>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Text className="txt-small text-gray-500">{title}</Text>

        {amountToCompare !== 0 && (
          <Text
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
