import { Text, Avatar } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { FormattedSince } from "../atoms/time"

const UserAction = ({ username, action, details, href, timestamp }) => {
  const firstLetter = username.charAt(0).toUpperCase()

  return (
    <Link
      to={href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-500 transition-all hover:bg-gray-50"
    >
      <Avatar fallback={firstLetter} size="xsmall"></Avatar>

      <div className="flex flex-grow justify-between">
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

export default UserAction
