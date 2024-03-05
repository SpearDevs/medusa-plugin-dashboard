import { useTranslation } from "react-i18next"

interface FormattedPriceProps {
  amount: number
  currency: string
  style?: string
}

const displayAmount = (
  amount: number,
  currency: string,
  style?: string,
  locale?: string
): string => {
  return new Intl.NumberFormat(locale, { currency, style }).format(amount / 100)
}

export const FormattedPrice = ({ amount, currency, style }: FormattedPriceProps): string => {
  const { i18n } = useTranslation()

  return displayAmount(amount, currency, style, i18n.language)
}
