"use client"

import * as React from "react"
import ReactDatePicker, { registerLocale } from "react-datepicker"
import { id } from "date-fns/locale/id"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import "react-datepicker/dist/react-datepicker.css"

// Register Indonesian locale
registerLocale("id", id)

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  showTimeSelect?: boolean
  dateFormat?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  className,
  minDate,
  maxDate,
  showTimeSelect = false,
  dateFormat = "dd/MM/yyyy",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat, { locale: id }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          locale="id"
          inline
          minDate={minDate}
          maxDate={maxDate}
          showTimeSelect={showTimeSelect}
          dateFormat={dateFormat}
          calendarClassName="!border-0"
        />
      </PopoverContent>
    </Popover>
  )
}

// For direct input usage (without popover) - simplified
export const DateInput = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => {
    return (
      <ReactDatePicker
        ref={ref}
        locale="id"
        dateFormat="dd/MM/yyyy"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

DateInput.displayName = "DateInput"
