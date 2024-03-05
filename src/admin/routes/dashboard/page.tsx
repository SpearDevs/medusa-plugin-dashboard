import { RouteConfig } from "@medusajs/admin"
import { ChartBar } from "@medusajs/icons"

import StatisticsOverview from "../../components/templates/statistics-overview"
import Activity from "../../components/templates/activity"

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col gap-y-base">
        <StatisticsOverview />
        <Activity />
      </div>

      <div className="h-xlarge w-full"></div>
    </>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Dashboard",
    icon: ChartBar,
  },
}

export default DashboardPage
