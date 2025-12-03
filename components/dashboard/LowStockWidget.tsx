"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/utils"
import type { LowStockProduct } from "@/services/api/dashboard"
import { AlertTriangle } from "lucide-react"

interface LowStockWidgetProps {
  products: LowStockProduct[]
}

export function LowStockWidget({ products }: LowStockWidgetProps) {
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Habis</Badge>
    if (stock < 5) return <Badge variant="destructive">Kritis</Badge>
    return <Badge variant="default">Rendah</Badge>
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Stok Rendah</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={`${product.id}-${product.variant_id}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRupiah(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{product.stock} unit</span>
                  {getStockBadge(product.stock)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Semua stok produk mencukupi
          </div>
        )}
      </CardContent>
    </Card>
  )
}
