import { useEffect, useState } from "react"
import { useAdminCustomQuery } from "medusa-react"
import { Container, Heading, Select, Text, clx } from "@medusajs/ui"

import ResourceView from "../../utils/resource-view"
import { FormattedDate } from "../atoms/time"
import StatusMessage from "../atoms/status-message"
import InfoTile from "../molecules/info-tile"
import Graph from "../molecules/graph"

const Statistics = () => {
  const [region, setRegion] = useState()
  const [category, setCategory] = useState(null)

  const {
    data: statistics,
    isLoading,
    isError,
  } = useAdminCustomQuery(
    "/dashboard/statistics/",
    ["statistics", region, category],
    { region, category },
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (statistics && !region) setRegion(statistics.options.regions[0].id)
  }, [statistics])

  return (
    <Container className="relative flex flex-col gap-2 overflow-hidden min-h-[670px] large:min-h-[504px]">
      <Heading level="h1">Today</Heading>

      <ResourceView
        isLoading={isLoading}
        isError={isError}
        errorComponent={<StatusMessage message="Error loading statistics" />}
      >
        <StatisticsContent
          statistics={statistics}
          region={region}
          setRegion={setRegion}
          category={category}
          setCategory={setCategory}
        />
      </ResourceView>
    </Container>
  )
}

const StatisticsContent = ({ statistics, region, setRegion, category, setCategory }) => {
  const { options, summary, data } = statistics
  const { regions, categories, selected } = options
  const { primary, secondary } = summary

  const [type, setType] = useState({
    key: "revenue",
    title: "Revenue",
    currency: selected.region.currency_code,
  })

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-4 large:flex-row">
        <div className="flex gap-2">
          <SelectComponent items={regions} selectedItem={region} setSelectedItem={setRegion} />

          <SelectComponent
            items={categories}
            selectedItem={category}
            setSelectedItem={setCategory}
            placeholder="All products"
          />
        </div>

        <div className="flex gap-2">
          <DateDot date={primary.timestamp} color="border-violet-500" />
          <DateDot date={secondary.timestamp} color="border-blue-400" />
        </div>
      </div>

      <Graph data={data} selected={type.key} currency={type.currency} tooltipTitle={type.title} />

      <StatisticsTiles
        summary={summary}
        currency={options.selected.region.currency_code}
        setType={setType}
      />
    </>
  )
}

const SelectComponent = ({ items, selectedItem, setSelectedItem, placeholder = null }) => (
  <div className="w-64 max-w-[50%]">
    <Select size="small" value={selectedItem} onValueChange={setSelectedItem}>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>

      <Select.Content>
        {placeholder && <Select.Item value={null}>{placeholder}</Select.Item>}

        {items.map((item) => (
          <Select.Item key={item.id} value={item.id}>
            {item.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  </div>
)

const DateDot = ({ date, color }) => (
  <div className="flex items-center gap-1">
    <span className={clx("aspect-square h-2.5 w-2.5 rounded-full border-2", color)}></span>

    <Text size="xsmall" className="text-gray-500">
      <FormattedDate value={date} />
    </Text>
  </div>
)

const StatisticsTiles = ({ summary, currency, setType }) => {
  const tilesData = [
    {
      title: "Today's revenue",
      key: "revenue",
      currency: currency,
    },
    {
      title: "Today's orders",
      key: "orders",
    },
    {
      title: "Avg. order value",
      key: "averageOrderValue",
      currency: currency,
    },
    {
      title: "Today's refunds",
      key: "refunds",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 large:grid-cols-4">
      {tilesData.map((tile) => {
        const amount = summary.primary.data[tile.key]
        const amountToCompare = summary.secondary.data[tile.key]

        return (
          <InfoTile
            key={tile.key}
            title={tile.title}
            amount={amount}
            amountToCompare={amountToCompare}
            currency={tile.currency}
            onClick={() => setType(tile)}
          />
        )
      })}
    </div>
  )
}

export default Statistics
