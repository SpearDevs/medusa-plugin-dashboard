import { MedusaRequest, MedusaResponse, ProductCategoryService, RegionService, StoreService } from "@medusajs/medusa"
import StatsService from "../../../../services/stats"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  let { region, category } = req.query as { region?: string, category?: string }

  const statsService: StatsService = req.scope.resolve("statsService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const productCategoryService: ProductCategoryService = req.scope.resolve("productCategoryService")

  const regions = await regionService.list()
  const categories = await productCategoryService.listAndCount({})

  const currentDate = new Date()
  const previousDate = new Date(currentDate)
  previousDate.setDate(currentDate.getDate() - 1)

  if (!region && regions.length > 0) {
    region = regions[0].id
  }

  const ordersCurrentDay = await statsService.retrieveOrders(currentDate, region, category)
  const ordersPreviousDay = await statsService.retrieveOrders(previousDate, region, category)

  const performanceSummary = await statsService.retrieveSummary(ordersCurrentDay, ordersPreviousDay)

  const revenueCurrentDay = await statsService.retrieveRevenueByHour(ordersCurrentDay, true)
  const revenuePreviousDay = await statsService.retrieveRevenueByHour(ordersPreviousDay)

  const revenue = [
    { date: currentDate, hourly: revenueCurrentDay },
    { date: previousDate, hourly: revenuePreviousDay }
  ]

  const options = { regions, categories }

  res.json({ performanceSummary, revenue, options })
}
