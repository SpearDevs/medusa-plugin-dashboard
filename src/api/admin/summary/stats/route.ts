import { MedusaRequest, MedusaResponse, ProductCategoryService, RegionService } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
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

  if (regions.length === 0) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No regions found")
  }

  const categories = await productCategoryService.listAndCount({})

  const currentDate = new Date()
  const previousDate = new Date(currentDate)
  previousDate.setDate(currentDate.getDate() - 1)

  region = region || regions[0].id

  const ordersCurrentDay = await statsService.retrieveOrders(currentDate, region, category)
  const ordersPreviousDay = await statsService.retrieveOrders(previousDate, region, category)

  const summaryCurrentDay = await statsService.retrieveSummary(ordersCurrentDay)
  const summaryPreviousDay = await statsService.retrieveSummary(ordersPreviousDay)

  const revenueCurrentDay = await statsService.retrieveRevenueByHour(ordersCurrentDay, true)
  const revenuePreviousDay = await statsService.retrieveRevenueByHour(ordersPreviousDay)

  const performanceSummary = [
    { date: currentDate, data: summaryCurrentDay },
    { date: previousDate, data: summaryPreviousDay }
  ]

  const revenue = [
    { date: currentDate, hourly: revenueCurrentDay },
    { date: previousDate, hourly: revenuePreviousDay }
  ]

  const options = { regions, categories }

  res.json({ performanceSummary, revenue, options })
}
