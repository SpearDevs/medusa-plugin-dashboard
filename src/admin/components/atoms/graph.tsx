import {
  XYChart,
  AnimatedLineSeries,
  AnimatedAxis,
  AnimatedGrid,
  buildChartTheme,
} from "@visx/xychart"

import { ParentSize } from "@visx/responsive"
import { curveMonotoneX } from "@visx/curve"

const customTheme = buildChartTheme({
  backgroundColor: undefined,
  colors: ["#3f88f8", "#8e60f6"],
  tickLength: 5,
  gridColor: "black",
  gridColorDark: undefined,
})

const dottedLineStyle = {
  stroke: "rgba(0, 0, 0, 0.5)",
  strokeDasharray: "8",
  strokeWidth: 0.5,
}

const Graph = ({ selected, data }: { selected: string; data: any }) => {
  if (!data) return null

  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y,
  }

  return (
    <ParentSize>
      {(parent) => (
        <XYChart
          theme={customTheme}
          height={250}
          width={parent.width}
          xScale={{ type: "band" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedGrid
            rows={false}
            className="opacity-25"
            lineStyle={dottedLineStyle}
            numTicks={24}
          />

          {data.map((seriesData) => (
            <AnimatedLineSeries
              key={seriesData.series}
              dataKey={seriesData.series}
              data={seriesData.data[selected]}
              {...accessors}
              curve={curveMonotoneX}
            />
          ))}

          <AnimatedAxis
            orientation="bottom"
            numTicks={24}
            hideTicks
            hideAxisLine
            tickFormat={(value, index) => {
              if (index === 0) return `${value}:00`
              else if (index === 23) return `${value}:59`
              return ""
            }}
          />
        </XYChart>
      )}
    </ParentSize>
  )
}

export default Graph
