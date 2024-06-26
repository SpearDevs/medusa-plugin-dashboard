import { RouteConfig } from "@medusajs/admin"
import { ChartBar } from "@medusajs/icons"

import StatisticsOverview from "../../components/templates/statistics-overview"
import Activity from "../../components/templates/activity"
import Actions from "../../components/templates/actions"

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col gap-y-base">
        <StatisticsOverview />
        <Activity />
        <Actions />
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
