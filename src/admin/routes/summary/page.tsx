import { RouteConfig } from "@medusajs/admin"
import { CircleQuarterSolid } from "@medusajs/icons"
import SummaryStats from "../../components/organisms/summary-stats"

const SummaryPage = () => {
  return (
    <>
      <SummaryStats />
    </>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Dashboard",
    icon: CircleQuarterSolid,
  },
}

export default SummaryPage
