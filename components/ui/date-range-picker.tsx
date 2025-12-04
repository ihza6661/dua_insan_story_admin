"use client"

import * as React from "react"
import { DateRangePicker as NewDateRangePicker, DateRange } from "@/components/ui/new-date-range-picker"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  className?: string
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  value,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <NewDateRangePicker
        value={value}
        onChange={onChange}
        placeholder="Pilih tanggal"
        showPresets={false}
      />
    </div>
  )
}

// Re-export DateRange type for backward compatibility
export type { DateRange }
