"use client"

import * as React from "react"
import { DateRangePicker, DateRange } from "@/components/ui/new-date-range-picker"

interface DateRangeSelectorProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <DateRangePicker
      value={value}
      onChange={onChange}
      placeholder="Pilih periode"
      showPresets={true}
      className="w-full sm:w-[280px]"
    />
  )
}
