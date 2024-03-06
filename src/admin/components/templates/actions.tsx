import { useState } from "react"
import { useAdminCustomQuery } from "medusa-react"
import { Container, Heading, FocusModal, IconButton, Kbd, Text } from "@medusajs/ui"
import { SquaresPlus, FlyingBox, Tag, ArrowUturnLeft, ArrowPath, XMark } from "@medusajs/icons"

import { pluralize } from "../../utils/common"
import ResourceView from "../../utils/resource-view"
import StatusMessage from "../atoms/status-message"
import ActionStatus from "../molecules/action-status"
import ActionsModalTable from "./actions-modal-table"

const Actions = () => {
  const { data, isLoading, isError } = useAdminCustomQuery(
    `/dashboard/actions/`,
    ["actions"],
    {},
    { keepPreviousData: true }
  )

  const [selectedAction, setSelectedAction] = useState("")
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")

  const showModal = (actionType: string, title: string) => {
    setSelectedAction(actionType)
    setTitle(title)
    setOpen(true)
  }

  const actions = [
    {
      id: "fulfillments",
      title: "Orders to fulfill",
      action: (actions) => `${pluralize(actions.unfulfilledItems, "order")} to fulfill`,
      description: "Manage and process orders that are awaiting fulfillment",
      Icon: SquaresPlus,
      complete: (actions) => !actions.unfulfilledItems,
    },
    {
      id: "shipments",
      title: "Orders to ship",
      action: (actions) => `${pluralize(actions.awaitingShipments, "order")} to ship`,
      description: "Manage and process orders that are awaiting shipment.",
      Icon: FlyingBox,
      complete: (actions) => !actions.awaitingShipments,
    },
    {
      id: "stock",
      title: "Out of stock products",
      action: (actions) => `${pluralize(actions.outOfStockProducts, "product")} are out of stock`,
      description: "Manage and process products that are out of stock",
      Icon: Tag,
      complete: (actions) => !actions.outOfStockProducts,
    },
    {
      id: "returns",
      title: "Returns to act on",
      action: (actions) => `${pluralize(actions.pendingReturns, "return")} to act on`,
      description: "Process returns for applicable orders",
      Icon: ArrowUturnLeft,
      complete: (actions) => !actions.pendingReturns,
    },
    {
      id: "swaps",
      title: "Swaps to act on",
      action: (actions) => `${pluralize(actions.pendingSwaps, "swap")} to act on`,
      description: "Process swaps for applicable orders",
      Icon: ArrowPath,
      complete: (actions) => !actions.pendingSwaps,
    },
  ]

  const ActionItems = () => {
    return actions.map((item) => (
      <ActionStatus
        key={item.id}
        action={item.action(data)}
        description={item.description}
        Icon={item.Icon}
        complete={item.complete(data)}
        onClick={() => showModal(item.id, item.title)}
      />
    ))
  }

  return (
    <Container className="relative flex flex-col gap-2 overflow-hidden min-h-[438px] large:min-h-[298px]">
      <Heading level="h1">Actions</Heading>

      <ResourceView
        isLoading={isLoading}
        isError={isError}
        errorComponent={<StatusMessage message="Error loading actions" />}
      >
        <div className="grid grid-flow-col grid-rows-5 gap-2 large:grid-rows-3">
          <ActionItems />
        </div>
      </ResourceView>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content className="mx-auto h-auto max-w-6xl">
          <div className="flex items-center justify-between gap-x-4 border-b border-ui-border-base px-4 py-2">
            <Text size="large">{title}</Text>

            <div className="flex items-center gap-x-2">
              <Kbd>esc</Kbd>

              <FocusModal.Close asChild>
                <IconButton variant="transparent" size="small">
                  <XMark />
                </IconButton>
              </FocusModal.Close>
            </div>
          </div>

          <FocusModal.Body className="flex flex-col items-center overflow-auto">
            <ActionsModalTable action={selectedAction} />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  )
}

export default Actions
