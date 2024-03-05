import { Text } from "@medusajs/ui"

const StatusMessage = ({ message }) => {
  return (
    <Text
      size="xlarge"
      weight="plus"
      className="my-auto flex items-center justify-center text-ui-fg-muted"
    >
      {message}
    </Text>
  )
}

export default StatusMessage
