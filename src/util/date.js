export const DateFormat = {
  YYYYMMDDhhmm: {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  },
  YYMMDDhhmm: {hour12: false, year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'},
  MMDDhhmm: {hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'},
  YYMMDD: {year: '2-digit', month: '2-digit', day: '2-digit'},
  MMDD: {month: '2-digit', day: '2-digit'},
  hhmm: {hour12: false, hour: '2-digit', minute: '2-digit'}
}
