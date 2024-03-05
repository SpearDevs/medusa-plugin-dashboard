import { FulfillmentStatus, MedusaRequest, MedusaResponse, OrderService, Product, ReturnService, ReturnStatus, SwapFulfillmentStatus, SwapService } from "@medusajs/medusa"
import { EntityManager, In, IsNull } from "typeorm"

const NO_ITEMS_TAKE_LIMIT = 0.1

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const manager: EntityManager = req.scope.resolve("manager")
  const orderService: OrderService = req.scope.resolve("orderService")
  const returnService: ReturnService = req.scope.resolve("returnService")
  const swapService: SwapService = req.scope.resolve("swapService")

  const productRepo = manager.getRepository(Product)

  const [, unfulfilledItems] = await orderService.listAndCount(
    { fulfillment_status: In([FulfillmentStatus.NOT_FULFILLED, FulfillmentStatus.PARTIALLY_FULFILLED]) },
    { take: NO_ITEMS_TAKE_LIMIT }
  )

  const [, awaitingShipments] = await orderService.listAndCount(
    { fulfillment_status: In([FulfillmentStatus.FULFILLED, FulfillmentStatus.PARTIALLY_SHIPPED]) },
    { take: NO_ITEMS_TAKE_LIMIT }
  )

  const outOfStockProducts = await productRepo.createQueryBuilder('product')
    .leftJoinAndSelect('product.variants', 'variant')
    .where('variant.inventory_quantity = 0')
    .getCount()

  const [, pendingReturns] = await returnService.listAndCount(
    {
      status: In([ReturnStatus.REQUESTED, ReturnStatus.REQUIRES_ACTION]),
      swap_id: IsNull()
    },
    { take: NO_ITEMS_TAKE_LIMIT }
  )

  const [, pendingSwaps] = await swapService.listAndCount(
    { fulfillment_status: In([SwapFulfillmentStatus.NOT_FULFILLED, SwapFulfillmentStatus.REQUIRES_ACTION]) },
    { take: NO_ITEMS_TAKE_LIMIT }
  )

  res.json({ unfulfilledItems, awaitingShipments, outOfStockProducts, pendingReturns, pendingSwaps })
}
