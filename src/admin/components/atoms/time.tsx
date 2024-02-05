import { useTranslation } from "react-i18next"

const formatDate = (dateString: string, locale?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }

  return new Date(dateString).toLocaleDateString(locale, options)
}

const formatHour = (hour: number, locale?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }

  return new Intl.DateTimeFormat(locale, options).format(
    new Date(2000, 0, 1, hour, 0)
  )
}

export function FormattedDate({ value: dateString }: { value: string }) {
  const { i18n } = useTranslation()

  return formatDate(dateString, i18n.language)
}

export function FormattedHour({ value }: { value: number }) {
  const { i18n } = useTranslation()

  return formatHour(value, i18n.language)
}
