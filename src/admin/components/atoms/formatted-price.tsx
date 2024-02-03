import { useTranslation } from "react-i18next"

function displayAmount(amount: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, { currency }).format(amount / 100)
}

export function FormattedPrice({ amount, currency }) {
  const { i18n } = useTranslation()

  return displayAmount(amount, currency, i18n.language)
}
