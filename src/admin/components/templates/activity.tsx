import { useAdminCustomQuery } from "medusa-react"
import { LineItem, Order } from "@medusajs/medusa"
import { Container, Heading, Button, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { getCustomerName } from "../../utils/common"
import ResourceView from "../../utils/resource-view"
import StatusMessage from "../atoms/status-message"
import UserAction from "../molecules/user-action"

const Activity = () => {
  const {
    data: activity,
    isLoading,
    isError,
  } = useAdminCustomQuery(`/dashboard/activity/`, ["activity"], {}, { keepPreviousData: true })

  const getItemDetails = (items: LineItem[]) => {
    return items.length === 1 ? items[0].title : `${items.length} items`
  }

  const Items = () => {
    return activity.orders.map((order: Order) => {
      const customerName = getCustomerName(order.customer)
      const itemDetails = getItemDetails(order.items)

      return (
        <UserAction
          key={order.id}
          username={customerName}
          action="bought"
          details={itemDetails}
          link={`/a/orders/${order.id}`}
          timestamp={order.created_at}
        />
      )
    })
  }

  return (
    <Container className="relative flex flex-col gap-2 overflow-hidden">
      <div className="flex justify-between">
        <Heading level="h1">Activity</Heading>

        <Link to={"/a/orders"}>
          <Button variant="transparent">View all orders</Button>
        </Link>
      </div>

      {activity?.orders.length === 0 ? (
        <Text size="xlarge" weight="plus" className="text-center text-ui-fg-muted">
          No activity found
        </Text>
      ) : (
        <ResourceView
          isLoading={isLoading}
          isError={isError}
          errorComponent={<StatusMessage message="Error loading activity" />}
        >
          <div className="columns-1 large:columns-2">
            <Items />
          </div>
        </ResourceView>
      )}
    </Container>
  )
}

export default Activity
