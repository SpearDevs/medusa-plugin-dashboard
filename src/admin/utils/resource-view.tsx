import { memo, ReactNode } from "react"

import Loading from "../components/atoms/loading"

interface ResourceViewProps {
  children: ReactNode
  isLoading: boolean
  loadingComponent?: JSX.Element
  isError?: boolean
  errorComponent?: JSX.Element | null
  hidden?: boolean
  debugShowLoading?: boolean
  debugShowError?: boolean
}

const isDevelopment = process.env.NODE_ENV === "development"

const ResourceView: React.FC<ResourceViewProps> = ({
  children,
  isLoading,
  loadingComponent = <Loading />,
  isError = false,
  errorComponent = null,
  hidden = false,
  debugShowLoading = false,
  debugShowError = false,
}) => {
  if (isDevelopment) {
    if (debugShowLoading) return loadingComponent
    if (debugShowError) return errorComponent
  }

  if (hidden) return null

  if (isLoading) {
    return loadingComponent
  } else if (isError) {
    return errorComponent
  } else {
    return <>{children}</>
  }
}

export default memo(ResourceView)
