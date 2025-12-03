"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/utils"
import { getOrderStatusLabel, getOrderStatusVariant } from "@/lib/constants/orderStatus"
import type { RecentOrder } from "@/services/api/dashboard"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentOrdersWidgetProps {
  orders: RecentOrder[]
}

export function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/orders')}
          className="h-8"
        >
          Lihat Semua
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition hover:bg-muted"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">#{order.id}</p>
                    <Badge variant={getOrderStatusVariant(order.order_status)} className="text-xs">
                      {getOrderStatusLabel(order.order_status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatRupiah(order.total_amount)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada pesanan
          </div>
        )}
      </CardContent>
    </Card>
  )
}
