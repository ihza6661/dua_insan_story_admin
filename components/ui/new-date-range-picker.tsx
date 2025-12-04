"use client"

import * as React from "react"
import ReactDatePicker, { registerLocale } from "react-datepicker"
import { id } from "date-fns/locale/id"
import { CalendarIcon } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import "react-datepicker/dist/react-datepicker.css"

// Register Indonesian locale
registerLocale("id", id)

export interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  showPresets?: boolean
}

const defaultPresets = [
  {
    label: "Hari Ini",
    getValue: () => ({ from: new Date(), to: new Date() }),
  },
  {
    label: "7 Hari Terakhir",
    getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: "30 Hari Terakhir",
    getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: "Bulan Ini",
    getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    label: "Bulan Lalu",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
]

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pilih periode",
  disabled = false,
  className,
  minDate,
  maxDate,
  showPresets = true,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = React.useState<Date | null>(value?.from || null)
  const [endDate, setEndDate] = React.useState<Date | null>(value?.to || null)
  const [isOpen, setIsOpen] = React.useState(false)

  // Sync internal state with external value
  React.useEffect(() => {
    setStartDate(value?.from || null)
    setEndDate(value?.to || null)
  }, [value])

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      onChange?.({ from: start, to: end })
      // Auto-close when both dates are selected
      setTimeout(() => setIsOpen(false), 100)
    } else if (start) {
      onChange?.({ from: start, to: undefined })
    } else {
      onChange?.(undefined)
    }
  }

  const handlePresetClick = (preset: typeof defaultPresets[0]) => {
    const range = preset.getValue()
    setStartDate(range.from)
    setEndDate(range.to)
    onChange?.(range)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd MMM yyyy", { locale: id })} - ${format(endDate, "dd MMM yyyy", { locale: id })}`
    }
    if (startDate) {
      return format(startDate, "dd MMM yyyy", { locale: id })
    }
    return placeholder
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[280px]",
            !(startDate || endDate) && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets */}
          {showPresets && (
            <div className="border-r p-3 space-y-1">
              <p className="text-sm font-medium mb-2">Periode</p>
              {defaultPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <div>
            <ReactDatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              monthsShown={2}
              locale="id"
              minDate={minDate}
              maxDate={maxDate}
              calendarClassName="!border-0"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Standalone DateRangePicker without popover (for inline usage)
interface InlineDateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function InlineDateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: InlineDateRangePickerProps) {
  const [startDate, setStartDate] = React.useState<Date | null>(value?.from || null)
  const [endDate, setEndDate] = React.useState<Date | null>(value?.to || null)

  React.useEffect(() => {
    setStartDate(value?.from || null)
    setEndDate(value?.to || null)
  }, [value])

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      onChange?.({ from: start, to: end })
    } else if (start) {
      onChange?.({ from: start, to: undefined })
    } else {
      onChange?.(undefined)
    }
  }

  return (
    <div className={className}>
      <ReactDatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        monthsShown={2}
        locale="id"
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  )
}
