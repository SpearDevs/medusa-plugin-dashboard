import { Customer } from "@medusajs/medusa"

export const getCustomerName = (customer: Customer): string => {
  return customer.first_name ? `${customer.first_name} ${customer.last_name}` : customer.email
}

export const pluralize = (count: number, single: string, plural?: string): string => {
  return `${count} ${count !== 1 ? plural || single + "s" : single}`
}

export const accessValue = (object: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], object)
}
