"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { id } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangeSelectorProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const presets = [
    {
      label: "Hari Ini",
      value: { from: new Date(), to: new Date() },
    },
    {
      label: "7 Hari Terakhir",
      value: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
      label: "30 Hari Terakhir",
      value: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
      label: "Bulan Ini",
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
    {
      label: "Bulan Lalu",
      value: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[280px]",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd MMM yyyy", { locale: id })} -{" "}
                {format(value.to, "dd MMM yyyy", { locale: id })}
              </>
            ) : (
              format(value.from, "dd MMM yyyy", { locale: id })
            )
          ) : (
            <span>Pilih periode</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets */}
          <div className="border-r p-3 space-y-1">
            <p className="text-sm font-medium mb-2">Periode</p>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left font-normal"
                onClick={() => onChange?.(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          {/* Calendar */}
          <div>
            <Calendar
              mode="range"
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              locale={id}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
