import { Dispatch, SetStateAction, useCallback, useMemo } from "react"
import { Customer, Product, ProductVariant } from "@medusajs/medusa"
import { Table } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"

import { accessValue, getCustomerName } from "../../utils/common"
import { FormattedDate } from "../atoms/time"

export interface Column {
  Header: string
  type: keyof typeof renderFunctions
  accessor?: string
}

interface SimpleTableProps {
  data: { items: any[]; count: number }
  columns: Array<Column>
  link?: { path: string; paramAccessor: string }
  pageSize: number
  pageIndex: number
  setPageIndex: Dispatch<SetStateAction<number>>
}

const renderFunctions = {
  productThumbnailAndTitle: (item: Product) => (
    <div className="h-12 flex items-center gap-2">
      <img src={item.thumbnail} alt={item.title} className="h-full py-0.5" />
      <span>{item.title}</span>
    </div>
  ),
  status: (value: string) => <span className="capitalize">{value.replace(/_/g, " ")}</span>,
  variants: (value: ProductVariant[]) => value.map((item) => item.title).join(", "),
  id: (value: string) => `#${value}`,
  date: (value: string) => <FormattedDate value={value} />,
  customer: (value: Customer) => getCustomerName(value),
  default: (value: string) => value,
}

const renderCellContent = (item, accessor, type) => {
  const renderFunction = renderFunctions[type]

  if (accessor) {
    const value = accessValue(item, accessor)

    return renderFunction(value)
  } else {
    return renderFunction(item)
  }
}

const SimpleTable = ({
  data,
  columns,
  link,
  pageSize,
  pageIndex,
  setPageIndex,
}: SimpleTableProps) => {
  const { items = [], count = 0 } = data || {}

  const navigate = useNavigate()

  const pageCount = useMemo(() => Math.ceil(count / pageSize), [count, pageSize])

  const canNextPage = useMemo(() => pageIndex < pageCount - 1, [pageIndex, pageCount])
  const canPreviousPage = useMemo(() => pageIndex > 0, [pageIndex])

  const nextPage = useCallback(() => setPageIndex((prev) => prev + 1), [])
  const previousPage = useCallback(() => setPageIndex((prev) => prev - 1), [])

  const handleClick = (item?) => {
    if (!link) return

    const param = accessValue(item, link.paramAccessor)
    navigate(`${link.path}/${param}`)
  }

  return (
    <>
      <div className="w-full grow overflow-y-auto">
        <Table>
          <Table.Header className="sticky top-0 border-y-0 shadow-[0_1px_var(--border-base)]">
            <Table.Row className="border-0">
              {columns.map((column, index) => (
                <Table.HeaderCell key={index}>{column.Header}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body className="border-0 divide-y divide-ui-border-base">
            {items.map((item) => (
              <Table.Row
                key={item.id}
                className="cursor-pointer border-0"
                onClick={() => handleClick(item)}
              >
                {columns.map((column, colIndex) => (
                  <Table.Cell key={colIndex}>
                    {renderCellContent(item, column.accessor, column.type)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Table.Pagination
        className="border-t border-ui-border-base"
        count={count}
        pageSize={pageSize}
        pageIndex={pageIndex}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </>
  )
}

export default SimpleTable
