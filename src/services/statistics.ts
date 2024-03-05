import { Logger, Order, OrderService, TransactionBaseService } from "@medusajs/medusa"
import { Between, Equal } from "typeorm"

interface Summary {
  revenue: number
  orders: number
  averageOrderValue: number
  refunds: number
}

interface DataPoint {
  x: number,
  y: any
}

class StatisticsService extends TransactionBaseService {
  protected readonly orderService_: OrderService
  protected readonly logger_: Logger

  constructor(container) {
    super(container)
    this.orderService_ = container.orderService
    this.logger_ = container.logger
  }

  /**
   * Retrieves a summary of order metrics.
   * @param orders Orders to summarize.
   * @returns Orders summary.
   */
  async retrieveSummary(orders: Order[]): Promise<Summary> {
    try {
      const revenue = orders.reduce((sum, order) => sum + order.total, 0)
      const ordersNumber = orders.length
      const refunds = orders.reduce((sum, order) => sum + (order.refunds ? order.refunds.length : 0), 0)
      const averageOrderValue = ordersNumber > 0 ? revenue / ordersNumber : 0

      return { revenue, orders: ordersNumber, averageOrderValue, refunds }
    } catch (error) {
      this.logger_.error("Error calculating perf summary:", error)
      throw error
    }
  }

  /**
   * Retrieves data distribution by hour.
   * @param orders Orders to analyze, e.g., revenue or orders.
   * @param currentDay Indicates whether the passed data is from the current day.
   * @returns Data distribution by hour.
   */
  async retrieveDataByHour(orders: Order[], currentDay?: boolean): Promise<{
    revenue: DataPoint[]
    orders: DataPoint[]
    averageOrderValue: DataPoint[]
    refunds: DataPoint[]
  }> {
    try {
      const hoursInDay = 24

      let revenue = Array(hoursInDay).fill(0)
      let ordersNumber = Array(hoursInDay).fill(0)
      let refunds = Array(hoursInDay).fill(0)

      if (currentDay) {
        const currentDate = new Date()
        const currentHour = currentDate.getHours()

        revenue.fill(null, currentHour + 1)
        ordersNumber.fill(null, currentHour + 1)
        refunds.fill(null, currentHour + 1)
      }

      orders.forEach((order) => {
        const orderCreationHour = order.created_at.getHours()

        revenue[orderCreationHour] += order.total
        ordersNumber[orderCreationHour]++

        if (order.refunds) {
          refunds[orderCreationHour] += order.refunds.length
        }
      })

      const averageOrderValue = revenue.map((total, index) => ({
        x: index,
        y: ordersNumber[index] === 0 ? 0 : total / ordersNumber[index],
      }))

      return {
        revenue: revenue.map((y, x) => ({ x, y })),
        orders: ordersNumber.map((y, x) => ({ x, y })),
        averageOrderValue,
        refunds: refunds.map((y, x) => ({ x, y })),
      }
    } catch (error) {
      this.logger_.error("Error retrieving data by hour:", error)
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
  async retrieveOrders(date: Date = new Date(), region: string, selectedCategory?: string): Promise<Order[]> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const query: Record<string, any> = {
        created_at: Between(startOfDay.toISOString(), endOfDay.toISOString()),
      }

      if (region) query.region = Equal(region)

      const orders = await this.orderService_.list(query, { relations: ["items.variant.product.categories"] })
      const filteredOrders = selectedCategory
        ? orders.filter((order) =>
          order.items.some((item) =>
            item.variant.product.categories.some((category) => category.id === selectedCategory)
          )
        )
        : orders

      return filteredOrders
    } catch (error) {
      this.logger_.error("Error retrieving orders:", error)
      throw error
    }
  }
}

export default StatisticsService
