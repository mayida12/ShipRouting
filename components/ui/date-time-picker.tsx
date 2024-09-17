"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const availableDates = [
  new Date(2024, 7, 25),
  new Date(2024, 7, 26),
  new Date(2024, 7, 27),
  new Date(2024, 7, 28),
  new Date(2024, 7, 29),
]

function DatePickerDemo({ setDate, date }: { setDate: (date: Date) => void, date: Date | undefined }) {
  const handleDateChange = (value: string) => {
    const newDate = new Date(value)
    if (date) {
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
    }
    setDate(newDate)
  }

  return (
    <Select onValueChange={handleDateChange} value={date?.toISOString()}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select date" />
      </SelectTrigger>
      <SelectContent>
        {availableDates.map((d) => (
          <SelectItem key={d.toISOString()} value={d.toISOString()}>
            {format(d, "MMMM d, yyyy")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function TimePickerDemo({ setDate, date }: { setDate: (date: Date) => void, date: Date | undefined }) {
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (date) {
      const newDate = new Date(date)
      if (type === 'hour') {
        newDate.setHours(parseInt(value))
      } else {
        newDate.setMinutes(parseInt(value))
      }
      setDate(newDate)
    }
  }

  return (
    <div className="flex gap-2">
      <Select onValueChange={(value) => handleTimeChange('hour', value)} value={date?.getHours().toString().padStart(2, '0')}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleTimeChange('minute', value)} value={date?.getMinutes().toString().padStart(2, '0')}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function DateTimePicker({
  date,
  setDate,
}: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedDateTime(date)
  }, [date])

  const handleDateTimeChange = (newDate: Date) => {
    setSelectedDateTime(newDate)
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM d, yyyy HH:mm") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <DatePickerDemo 
            setDate={handleDateTimeChange}
            date={selectedDateTime}
          />
          <TimePickerDemo 
            setDate={handleDateTimeChange}
            date={selectedDateTime}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}