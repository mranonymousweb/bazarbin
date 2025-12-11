import moment from 'jalali-moment'

moment.locale('fa')

export const useMoment = () => {
  const formatDate = (date, format = 'jYYYY/jMM/jDD') => {
    return moment(date).format(format)
  }

  const formatDateTime = (date) => {
    return moment(date).format('jYYYY/jMM/jDD HH:mm')
  }

  const fromNow = (date) => {
    return moment(date).fromNow()
  }

  return {
    moment,
    formatDate,
    formatDateTime,
    fromNow
  }
}



