"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"
import type { TopProduct } from "@/services/api/dashboard"
import { Package } from "lucide-react"

interface TopProductsWidgetProps {
  products: TopProduct[]
}

export function TopProductsWidget({ products }: TopProductsWidgetProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Top 5 Produk Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{product.total_quantity} terjual</span>
                    <span>•</span>
                    <span>{formatRupiah(product.total_revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada data penjualan</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
