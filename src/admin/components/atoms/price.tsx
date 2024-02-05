import { useTranslation } from "react-i18next"

function displayAmount(
  amount: number,
  currency: string,
  style?: string,
  locale?: string
) {
  return new Intl.NumberFormat(locale, { currency, style }).format(amount / 100)
}

export function FormattedPrice({ amount, currency, style = undefined }) {
  const { i18n } = useTranslation()

  return displayAmount(amount, currency, style, i18n.language)
}
