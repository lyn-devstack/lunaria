import { useState } from 'react'
import { addDays, isSameDay, startOfDay } from '../logic/week'

export const useSelectedDate = () => {
  const [date, setDate] = useState<Date>(() => startOfDay(new Date()))

  const today = startOfDay(new Date())
  return {
    date,
    setDate: (d: Date) => setDate(startOfDay(d)),
    isToday: isSameDay(date, today),
    isTomorrow: isSameDay(date, addDays(today, 1)),
    goToday: () => setDate(today),
    goTomorrow: () => setDate(addDays(today, 1)),
  }
}
