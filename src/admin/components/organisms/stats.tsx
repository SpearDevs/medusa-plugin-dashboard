import { useEffect, useState } from "react"
import { useAdminCustomQuery } from "medusa-react"
import { Container, Heading, Select, Text } from "@medusajs/ui"
import InfoTile from "../molecules/info-tile"
import Graph from "../molecules/graph"
import Loading from "../atoms/loading"
import { FormattedDate } from "../atoms/time"

const Stats = () => {
  const [region, setRegion] = useState(undefined)
  const [category, setCategory] = useState(undefined)
  const [selectedStats, setSelectedStats] = useState({
    title: "Revenue",
    key: "revenue",
  })

  const { data: stats, isLoading } = useAdminCustomQuery(
    `/dashboard/stats/`,
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
            <div className="w-2.5 h-2.5 border-2 border-violet-500 rounded-full"></div>

            <Text size="xsmall" className="text-gray-500">
              <FormattedDate value={stats.summary.primary.timestamp} />
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 border-2 border-blue-400 rounded-full"></div>

            <Text size="xsmall" className="text-gray-500">
              <FormattedDate value={stats.summary.secondary.timestamp} />
            </Text>
          </div>
        </div>
      </div>

      <Graph
        selected={selectedStats.key}
        data={stats.data}
        tooltipTitle={selectedStats.title}
      />

      <div className="grid grid-cols-2 large:grid-cols-4 gap-4">
        <InfoTile
          title="Today's revenue"
          amount={stats.summary.primary.data.revenue}
          currency={stats.options.selected.region.currency_code}
          amountToCompare={stats.summary.secondary.data.revenue}
          onClick={() => setSelectedStats({ title: "Revenue", key: "revenue" })}
        />

        <InfoTile
          title="Today's orders"
          amount={stats.summary.primary.data.orders}
          amountToCompare={stats.summary.secondary.data.orders}
          onClick={() => setSelectedStats({ title: "Orders", key: "orders" })}
        />

        <InfoTile
          title="Avg. order value"
          amount={stats.summary.primary.data.averageOrderValue}
          currency={stats.options.selected.region.currency_code}
          amountToCompare={stats.summary.secondary.data.averageOrderValue}
          onClick={() =>
            setSelectedStats({
              title: "Avg. order value",
              key: "averageOrderValue",
            })
          }
        />

        <InfoTile
          title="Today's refunds"
          amount={stats.summary.primary.data.refunds}
          amountToCompare={stats.summary.secondary.data.refunds}
          onClick={() => setSelectedStats({ title: "Refunds", key: "refunds" })}
        />
      </div>
    </Container>
  )
}

export default Stats
