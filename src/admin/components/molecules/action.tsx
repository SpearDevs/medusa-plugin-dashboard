import { Text, Avatar } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { FormattedSince } from "../atoms/time"

const Action = ({ username, action, details, href, timestamp }) => {
  const firstLetter = username.charAt(0).toUpperCase()

  return (
    <Link
      to={href}
      className="py-1.5 rounded-rounded flex text-grey-50 hover:bg-grey-10 items-center gap-2 px-2"
    >
      <Avatar fallback={firstLetter} size="xsmall" ></Avatar>

      <div className="flex justify-between flex-grow">
        <Text size="small">
          <b className="font-medium">{username}</b>
          {` ${action} `}
          <b className="font-medium">{details}</b>
        </Text>

        <Text size="small">
          <FormattedSince value={timestamp} />
        </Text>
      </div>
    </Link>
  )
}

export default Action
