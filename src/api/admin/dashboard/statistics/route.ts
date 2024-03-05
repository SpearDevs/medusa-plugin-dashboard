import { MedusaRequest, MedusaResponse, ProductCategoryService, RegionService } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import StatisticsService from "../../../../services/statistics"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  let { region: regionId, category } = req.query as { region?: string, category?: string }

  const statsService: StatisticsService = req.scope.resolve("statisticsService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const productCategoryService: ProductCategoryService = req.scope.resolve("productCategoryService")

  const regions = await regionService.list()

  if (regions.length === 0) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No regions found")
  }

  const [categories] = await productCategoryService.listAndCount({})

  const currentDate = new Date()
  const previousDate = new Date(currentDate)
  previousDate.setDate(currentDate.getDate() - 1)

  regionId = regionId || regions[0].id

  const selectedRegion = regions.find((item) => item.id === regionId)

  const ordersCurrentDay = await statsService.retrieveOrders(currentDate, regionId, category)
  const ordersPreviousDay = await statsService.retrieveOrders(previousDate, regionId, category)

  const summaryCurrentDay = await statsService.retrieveSummary(ordersCurrentDay)
  const summaryPreviousDay = await statsService.retrieveSummary(ordersPreviousDay)

  const dataCurrentDay = await statsService.retrieveDataByHour(ordersCurrentDay, true)
  const dataPreviousDay = await statsService.retrieveDataByHour(ordersPreviousDay)

  const summary = {
    primary: { timestamp: currentDate, data: summaryCurrentDay },
    secondary: { timestamp: previousDate, data: summaryPreviousDay }
  }

  const data = [
    { series: "primary", timestamp: currentDate, currency: selectedRegion.currency_code, data: dataCurrentDay },
    { series: "secondary", timestamp: previousDate, currency: selectedRegion.currency_code, data: dataPreviousDay }
  ]

  const options = { selected: { region: selectedRegion, category }, regions, categories }

  res.json({ summary, data, options })
}
