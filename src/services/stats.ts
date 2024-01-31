import { Logger, Order, OrderService, TransactionBaseService } from "@medusajs/medusa"
import { Between, Equal } from "typeorm"

interface PerformanceSummary {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  totalRefunds: number
}
class StatsService extends TransactionBaseService {
  protected readonly orderService_: OrderService
  protected readonly logger_: Logger

  constructor(container) {
    super(container)
    this.orderService_ = container.orderService
    this.logger_ = container.logger
  }

  /**
   * Retrieves a summary of performance metrics.
   * @param orders Orders to summarize.
   * @returns Performance summary.
   */
  async retrieveSummary(orders: Order[]): Promise<PerformanceSummary> {
    try {
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const totalOrders = orders.length
      const totalRefunds = orders.reduce((sum, order) => sum + (order.refunds ? order.refunds.length : 0), 0)
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      const perfSummary: PerformanceSummary = { totalRevenue, totalOrders, avgOrderValue, totalRefunds }

      return perfSummary
    } catch (error) {
      this.logger_.error("Error calculating perf summary:", error)
      throw error
    }
  }


  /**
   * Retrieves revenue distribution by hour.
   * @param orders Orders to analyze.
   * @param currentDay Indicates whether passed orders are from the current day.
   * @returns Revenue distribution by hour.
   */
  async retrieveRevenueByHour(orders: Order[], currentDay?: boolean): Promise<number[]> {
    try {
      const hoursInDay = 24
      let revenueByHour = Array(hoursInDay).fill(0)

      if (currentDay) {
        const currentDate = new Date()
        const currentHour = currentDate.getHours()

        revenueByHour.fill(null, currentHour + 1)
      }

      orders.forEach((order) => {
        const orderCreationHour = order.created_at.getHours()

        revenueByHour[orderCreationHour] += order.total
      })

      return revenueByHour
    } catch (error) {
      this.logger_.error("Error retrieving revenue by hour:", error)
      throw error
    }
  }

  /**
   * Retrieves orders based on date, region, and selected category.
   * @param date Date for which to retrieve orders (default: current date).
   * @param region Region filter.
   * @param selectedCategory Selected category for filtering (optional).
   * @returns Filtered orders.
   */
  async retrieveOrders(date: Date = new Date(), region: string, selectedCategory?: string) {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const query: Record<string, any> = {
        updated_at: Between(startOfDay.toISOString(), endOfDay.toISOString()),
      }

      if (region) query.region = Equal(region)

      const orders = await this.orderService_.list(query, { relations: ["items.variant.product.categories"] })
      const filteredOrders = orders.filter((order) =>
        order.items.some((item) =>
          item.variant.product.categories.some((category) => category.id === selectedCategory)
        )
      )

      return filteredOrders
    } catch (error) {
      this.logger_.error("Error retrieving orders:", error)
      throw error
    }
  }
}

export default StatsService
