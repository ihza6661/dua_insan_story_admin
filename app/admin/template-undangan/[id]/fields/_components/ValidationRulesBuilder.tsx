"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationRules } from "@/services/api/template-field.service";

interface ValidationRulesBuilderProps {
  value: ValidationRules;
  onChange: (value: ValidationRules) => void;
}

export function ValidationRulesBuilder({ value, onChange }: ValidationRulesBuilderProps) {
  const updateRule = (key: keyof ValidationRules, val: boolean | number | string | undefined) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={value.required || false}
          onCheckedChange={(checked) => updateRule("required", checked === true)}
        />
        <Label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Field wajib diisi
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min" className="text-sm">
            Panjang Minimum
          </Label>
          <Input
            id="min"
            type="number"
            min={0}
            placeholder="e.g. 3"
            value={value.min || ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : undefined;
              updateRule("min", val);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max" className="text-sm">
            Panjang Maximum
          </Label>
          <Input
            id="max"
            type="number"
            min={0}
            placeholder="e.g. 255"
            value={value.max || ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : undefined;
              updateRule("max", val);
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pattern" className="text-sm">
          Pattern (Regex)
        </Label>
        <Input
          id="pattern"
          type="text"
          placeholder="e.g. ^[A-Za-z\\s]+$"
          value={value.pattern || ""}
          onChange={(e) => updateRule("pattern", e.target.value || undefined)}
        />
        <p className="text-xs text-muted-foreground">
          Regular expression untuk validasi format
        </p>
      </div>
    </div>
  );
}
