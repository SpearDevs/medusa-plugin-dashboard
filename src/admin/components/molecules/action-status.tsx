import { Text, clx } from "@medusajs/ui"
import { Check } from "@medusajs/icons"

const ActionStatus = ({ action, description, complete, onClick, Icon, className = "" }) => {
  return (
    <div
      onClick={() => !complete && onClick()}
      className={clx(
        "flex gap-4 rounded-lg px-4 py-2 transition-all",
        { "cursor-pointer hover:bg-gray-50": !complete },
        className
      )}
    >
      <div
        className={clx(
          "flex aspect-[4/3] h-full items-center justify-center rounded-lg bg-gray-100",
          { "bg-emerald-400": complete }
        )}
      >
        {complete ? <Check className="text-white" /> : <Icon />}
      </div>

      <div className="flex flex-col">
        <Text weight="plus">{action}</Text>
        <Text size="small" className="text-gray-500">
          {description}
        </Text>
      </div>
    </div>
  )
}

export default ActionStatus
