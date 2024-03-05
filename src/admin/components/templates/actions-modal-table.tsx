import { useMemo, useState } from "react"
import { useAdminCustomQuery } from "medusa-react"

import ResourceView from "../../utils/resource-view"
import StatusMessage from "../atoms/status-message"
import SimpleTable, { Column } from "../molecules/simple-table"

const DEFAULT_PAGE_SIZE = 10

const getColumns = (action: string): Array<Column> => {
  switch (action) {
    case "stock":
      return [
        { Header: "Name", type: "productThumbnailAndTitle" },
        { Header: "Status", type: "status", accessor: "status" },
        { Header: "Variants", type: "variants", accessor: "variants" },
      ]
    case "fulfillments":
    case "shipments":
      return [
        { Header: "Order", type: "id", accessor: "display_id" },
        { Header: "Updated at", type: "date", accessor: "updated_at" },
        { Header: "Customer", type: "customer", accessor: "customer" },
        { Header: "Status", type: "status", accessor: "fulfillment_status" },
      ]
    case "returns":
      return [
        { Header: "Order", type: "id", accessor: "order.display_id" },
        { Header: "Customer", type: "customer", accessor: "order.customer" },
        { Header: "Return status", type: "status", accessor: "status" },
        { Header: "Updated at", type: "date", accessor: "updated_at" },
      ]
    case "swaps":
      return [
        { Header: "Order", type: "id", accessor: "order.display_id" },
        { Header: "Customer", type: "customer", accessor: "order.customer" },
        { Header: "Swap status", type: "status", accessor: "fulfillment_status" },
        { Header: "Updated at", type: "date", accessor: "updated_at" },
      ]
    default:
      return []
  }
}

const getLink = (action: string) => {
  switch (action) {
    case "returns":
    case "swaps":
      return { path: "/a/orders", paramAccessor: "order.id" }
    case "stock":
      return { path: "/a/products", paramAccessor: "id" }
    default:
      return { path: "/a/orders", paramAccessor: "id" }
  }
}

const ActionsModalTable = ({ action }: { action: string }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const limit = DEFAULT_PAGE_SIZE
  const offset = pageIndex * limit

  const { data, isLoading, isError } = useAdminCustomQuery(
    `/dashboard/actions/${action}`,
    [action],
    { offset, limit },
    { keepPreviousData: true }
  )

  const columns = useMemo(() => getColumns(action), [action])
  const link = useMemo(() => getLink(action), [action])

  return (
    <ResourceView
      isLoading={isLoading}
      isError={isError}
      errorComponent={<StatusMessage message="Error loading action data" />}
    >
      <SimpleTable
        data={data}
        columns={columns}
        link={link}
        pageSize={limit}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />
    </ResourceView>
  )
}

export default ActionsModalTable
