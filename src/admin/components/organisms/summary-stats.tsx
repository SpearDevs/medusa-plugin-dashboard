import { useAdminCustomQuery } from "medusa-react"
import { Container, Heading, Select } from "@medusajs/ui"
import Loading from "../atoms/loading"
import { useEffect, useState } from "react"
import InfoTile from "../molecules/info-tile"
import { FormattedDate } from "../atoms/formatted-date"
import Graph from "../atoms/graph"

const SummaryStats = () => {
  const [region, setRegion] = useState(undefined)
  const [category, setCategory] = useState(undefined)
  const [selectedStats, setSelectedStats] = useState("revenue")

  const { data: stats, isLoading } = useAdminCustomQuery(
    `/summary/stats/`,
    ["stats", region, category],
    { region, category },
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (stats && region === undefined) {
      setRegion(stats.options.regions[0].id)
    }
  }, [stats])

  if (isLoading) return <Loading />

  return (
    <Container className="relative overflow-hidden flex flex-col gap-2">
      <Heading level="h1">Today</Heading>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-64">
            <Select size="small" value={region} onValueChange={setRegion}>
              <Select.Trigger>
                <Select.Value placeholder="Regions" />
              </Select.Trigger>

              <Select.Content>
                {stats.options.regions.map((region) => (
                  <Select.Item key={region.id} value={region.id}>
                    {region.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="w-64">
            <Select size="small" value={category} onValueChange={setCategory}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>

              <Select.Content>
                <Select.Item key="All products" value={undefined}>
                  All products
                </Select.Item>

                {stats.options.categories.map((category) => (
                  <Select.Item key={category.id} value={category.id}>
                    {category.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-violet-500 rounded-full"></div>

            <FormattedDate value={stats.summary.primary.date} />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-400 rounded-full"></div>

            <FormattedDate value={stats.summary.secondary.date} />
          </div>
        </div>
      </div>

      <Graph selected={selectedStats} data={stats.data} />

      <div className="grid grid-cols-2 large:grid-cols-4 gap-4">
        <InfoTile
          title="Today's revenue"
          amount={stats.summary.primary.data.revenue}
          currency="USD"
          amountToCompare={stats.summary.secondary.data.revenue}
          onClick={() => setSelectedStats("revenue")}
        />

        <InfoTile
          title="Today's orders"
          amount={stats.summary.primary.data.orders}
          amountToCompare={stats.summary.secondary.data.orders}
          onClick={() => setSelectedStats("orders")}
        />

        <InfoTile
          title="Avg. order value"
          amount={stats.summary.primary.data.averageOrderValue}
          currency="USD"
          amountToCompare={stats.summary.secondary.data.averageOrderValue}
          onClick={() => setSelectedStats("averageOrderValue")}
        />

        <InfoTile
          title="Today's refunds"
          amount={stats.summary.primary.data.refunds}
          amountToCompare={stats.summary.secondary.data.refunds}
          onClick={() => setSelectedStats("refunds")}
        />
      </div>
    </Container>
  )
}

export default SummaryStats
