import { Text, clx } from "@medusajs/ui"
import { ArrowUpMini, ArrowDownMini } from "@medusajs/icons"
import {
  XYChart,
  AnimatedLineSeries,
  AnimatedAxis,
  AnimatedGrid,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart"
import { curveMonotoneX } from "@visx/curve"

import { FormattedPrice } from "../atoms/price"
import { FormattedDate, FormattedHour } from "../atoms/time"

interface GraphProps {
  data: any
  selected: string
  currency: string
  tooltipTitle: string
}

const customTheme = buildChartTheme({
  backgroundColor: undefined,
  colors: ["#60a5fa", "#8b5cf6"],
  tickLength: 5,
  gridColor: "black",
  gridColorDark: undefined,
})

const dottedLineStyle = {
  stroke: "rgba(0, 0, 0, 0.5)",
  strokeDasharray: 8,
  strokeWidth: 0.5,
}

const accessors = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
}

const CustomTooltip = ({ tooltipData, title, data, colorScale, currency }) => {
  const { nearestDatum, datumByKey } = tooltipData
  const { primary, secondary } = datumByKey

  const hour = accessors.xAccessor(nearestDatum.datum)

  const amount = accessors.yAccessor(primary.datum)
  const amountToCompare = accessors.yAccessor(secondary.datum)

  let valueChange: number = 0

  if (amount && amountToCompare) {
    valueChange = ((amount - amountToCompare) / amountToCompare) * 100
  }

  return (
    <div
      className={clx(
        "txt-compact-xsmall text-ui-fg-subtle bg-ui-bg-base shadow-elevation-tooltip rounded-lg px-2.5 py-1",
        "animate-in fade-in-0 zoom-in-95",
        "flex flex-col"
      )}
    >
      <div className="flex justify-between gap-3">
        <Text size="xsmall">
          {title} (<FormattedHour value={hour} />-<FormattedHour value={hour + 1} />)
        </Text>

        {valueChange !== 0 && (
          <Text
            size="xsmall"
            className={clx("flex items-center", {
              "text-emerald-500": valueChange > 0,
              "text-rose-500": valueChange < 0,
            })}
          >
            {valueChange > 0 ? <ArrowUpMini /> : <ArrowDownMini />}
            {Math.abs(valueChange).toFixed(2)}%
          </Text>
        )}
      </div>

      {Object.entries(datumByKey)
        .reverse()
        .map((lineDataArray) => {
          const [key, value]: [key: string, value: any] = lineDataArray
          const amount = accessors.yAccessor(value.datum)

          if (amount === null) return

          const { timestamp } = data.find((item) => item.series === key)

          return (
            <div key={key} className="flex justify-between gap-3">
              <div className="flex items-center gap-1" style={{ color: colorScale(key) }}>
                <div
                  className="aspect-square h-2.5 w-2.5 rounded-full border-2"
                  style={{ borderColor: colorScale(key) }}
                ></div>

                <Text size="xsmall">
                  {currency ? (
                    <FormattedPrice amount={amount} currency={currency} style="currency" />
                  ) : (
                    amount
                  )}
                </Text>
              </div>

              <Text size="xsmall" className="text-gray-500">
                <FormattedDate value={timestamp} />
              </Text>
            </div>
          )
        })}
    </div>
  )
}

const Graph = ({ data, selected, currency, tooltipTitle }: GraphProps) => {
  return (
    <div className="h-64">
      <XYChart
        theme={customTheme}
        height={256}
        xScale={{ type: "band" }}
        yScale={{ type: "linear" }}
      >
        <AnimatedGrid
          rows={false}
          className="opacity-25"
          lineStyle={dottedLineStyle}
          numTicks={24}
        />

        <AnimatedAxis
          orientation="bottom"
          numTicks={24}
          hideTicks
          hideAxisLine
          tickFormat={(value, index) => (index === 0 || index === 23 ? `${value}:00` : "")}
        />

        {data.toReversed().map((seriesData) => (
          <AnimatedLineSeries
            key={seriesData.series}
            dataKey={seriesData.series}
            data={seriesData.data[selected]}
            {...accessors}
            curve={curveMonotoneX}
          />
        ))}

        <Tooltip
          snapTooltipToDatumX
          showVerticalCrosshair
          verticalCrosshairStyle={dottedLineStyle}
          showSeriesGlyphs
          unstyled
          className="absolute"
          renderTooltip={({ tooltipData, colorScale }) => (
            <CustomTooltip
              tooltipData={tooltipData}
              colorScale={colorScale}
              data={data}
              title={tooltipTitle}
              currency={currency}
            />
          )}
        />
      </XYChart>
    </div>
  )
}

export default Graph
