import { RouteConfig } from "@medusajs/admin"
import { CircleQuarterSolid } from "@medusajs/icons"
import Stats from "../../components/organisms/stats"
import Activity from "../../components/organisms/activity"

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col gap-y-base">
        <Stats />
        <Activity />
      </div>

      <div className="h-xlarge w-full"></div>
    </>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Dashboard",
    icon: CircleQuarterSolid,
  },
}

export default DashboardPage
