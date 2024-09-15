"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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

export function DateTimePicker({ 
  date, 
  setDate 
}: { 
  date?: Date, 
  setDate: (date: Date | undefined) => void 
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate) {
      const updatedDate = new Date(newDate)
      updatedDate.setHours(date?.getHours() || 0)
      updatedDate.setMinutes(date?.getMinutes() || 0)
      setDate(updatedDate)
    } else {
      setDate(undefined)
    }
  }

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const numValue = parseInt(value, 10)
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      if (type === "hour") {
        newDate.setHours(numValue)
      } else {
        newDate.setMinutes(numValue)
      }
      setDate(newDate)
    }
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
          {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="border-r"
          />
          <div className="p-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-medium">Time</h4>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={(value) => handleTimeChange("hour", value)}
                  value={date ? date.getHours().toString() : undefined}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select
                  onValueChange={(value) => handleTimeChange("minute", value)}
                  value={date ? date.getMinutes().toString() : undefined}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => setDate(selectedDate)} className="mt-4">
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}