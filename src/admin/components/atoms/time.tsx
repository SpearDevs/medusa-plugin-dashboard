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

const formatTimeSince = (eventTime: string | Date, locale?: string): string => {
  const date = eventTime instanceof Date ? eventTime : new Date(eventTime)
  const secondsElapsed = (date.getTime() - Date.now()) / 1000

  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "always",
    style: "narrow",
  })

  const ranges = [
    ["years", 3600 * 24 * 365],
    ["months", 3600 * 24 * 30],
    ["weeks", 3600 * 24 * 7],
    ["days", 3600 * 24],
    ["hours", 3600],
    ["minutes", 60],
    ["seconds", 1],
  ] as const

  for (const [rangeType, rangeVal] of ranges) {
    if (rangeVal < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / rangeVal
      return formatter.format(Math.round(delta), rangeType)
    }
  }
}

export function FormattedDate({ value }: { value: string }) {
  const { i18n } = useTranslation()

  return formatDate(value, i18n.language)
}

export function FormattedHour({ value }: { value: number }) {
  const { i18n } = useTranslation()

  return formatHour(value, i18n.language)
}

export function FormattedSince({ value }: { value: string }) {
  const { i18n } = useTranslation()

  return formatTimeSince(value, i18n.language)
}
