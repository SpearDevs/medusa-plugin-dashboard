import { MedusaRequest, MedusaResponse, Product } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const manager: EntityManager = req.scope.resolve("manager")

  const productRepo = manager.getRepository(Product)

  const offset = parseInt(req.query.offset as string) || 0
  const limit = parseInt(req.query.limit as string) || 10

  try {
    const [items, count] = await productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('variant.inventory_quantity = 0')
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    res.json({ items, count, offset, limit })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
