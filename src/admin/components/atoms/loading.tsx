import { Spinner } from "@medusajs/icons"

const Loading = () => (
  <span className="pointer-events-none">
    <div className="flex items-center justify-center rounded-md">
      <Spinner className="animate-spin" />
    </div>
  </span>
)

export default Loading
