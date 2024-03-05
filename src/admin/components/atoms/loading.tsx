import { Spinner } from "@medusajs/icons"

const Loading = () => (
  <div role="status" className="pointer-events-none my-auto flex items-center justify-center">
    <Spinner className="animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
)

export default Loading
