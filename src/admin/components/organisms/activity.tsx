import { useAdminCustomQuery } from "medusa-react"
import { Container, Heading, Button } from "@medusajs/ui"
import { Link } from "react-router-dom"
import Loading from "../atoms/loading"
import Action from "../molecules/action"

const Activity = () => {
  const { data: activity, isLoading } = useAdminCustomQuery(
    `/dashboard/activity/`,
    ["activity"],
    {},
    { keepPreviousData: true }
  )

  const getCustomerName = (customer) => {
    return customer.first_name
      ? `${customer.first_name} ${customer.last_name}`
      : customer.email
  }

  const getItemDetails = (items) => {
    return items.length === 1 ? items[0].title : `${items.length} items`
  }

  if (isLoading) return <Loading />

  return (
    <Container className="relative overflow-hidden flex flex-col gap-2">
      <div className="flex justify-between">
        <Heading level="h1">Activity</Heading>

        <Link to={"/a/orders"}>
          <Button variant="transparent">View all orders</Button>
        </Link>
      </div>

      <div className="columns-1 large:columns-2">
        {activity.orders.map((order) => {
          const customerName = getCustomerName(order.customer)
          const itemDetails = getItemDetails(order.items)

          return (
            <Action
              key={order.id}
              username={customerName}
              action="bought"
              details={itemDetails}
              href={`/a/orders/${order.id}`}
              timestamp={order.created_at}
            />
          )
        })}
      </div>
    </Container>
  )
}

export default Activity
