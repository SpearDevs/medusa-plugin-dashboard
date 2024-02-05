import { useTranslation } from "react-i18next"

const formatDate = (dateString: string, locale?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }

  return new Date(dateString).toLocaleDateString(locale, options)
}

export function FormattedDate({ value: dateString }: { value: string }) {
  const { i18n } = useTranslation()

  return formatDate(dateString, i18n.language)
}
