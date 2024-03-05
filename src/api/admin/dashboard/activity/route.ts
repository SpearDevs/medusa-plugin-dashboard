import { MedusaRequest, MedusaResponse, OrderService } from "@medusajs/medusa"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderService: OrderService = req.scope.resolve("orderService")

  const orders = await orderService.list({}, { take: 12, relations: ["customer"], order: { "created_at": "DESC" } })

  res.json({ orders })
}
