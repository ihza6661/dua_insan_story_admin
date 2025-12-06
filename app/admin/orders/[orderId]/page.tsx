"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderDetail } from "@/lib/hooks/useOrders";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DesignProofSection } from "@/components/orders/DesignProofSection";
import {
  ORDER_STATUS,
  getOrderStatusLabel,
  getOrderStatusVariant,
} from "@/lib/constants/orderStatus";

const OrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const queryClient = useQueryClient();

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useOrderDetail(orderId);

  const getStatusBadge = (status: string) => {
    const variant = getOrderStatusVariant(status);
    const label = getOrderStatusLabel(status);
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "partially_paid":
        return <Badge variant="default">Dibayar Sebagian</Badge>;
      case "paid":
        return <Badge variant="success">Lunas</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="destructive">Status Tidak Diketahui</Badge>;
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.post(`/admin/orders/${orderId}/status`, { status });
      await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    } catch (err) {
      console.error("Failed to update status", err);
      // Optionally, show an error message to the user
    }
  };

  if (isLoading) {
    return <p>Memuat detail pesanan...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  if (!orderData) {
    return <p>Pesanan tidak ditemukan.</p>;
  }

  const amountPaid = Number(orderData.amount_paid ?? 0);
  const remainingBalance = Number(
    orderData.remaining_balance ??
      Math.max(orderData.total_amount - amountPaid, 0),
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Detail Pesanan #{orderData.id}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>ID Order:</strong> {orderData.id}
            </p>
            <p>
              <strong>Pelanggan:</strong> {orderData.user_full_name}
            </p>
            <p>
              <strong>Status Pesanan:</strong>{" "}
              {getStatusBadge(orderData.order_status)}
            </p>
            {/* <p><strong>Status Pembayaran:</strong> {getPaymentStatusBadge(orderData.payment_status)}</p> */}
            <p>
              <strong>Jumlah Total:</strong> Rp.{" "}
              {typeof orderData.total_amount === "number"
                ? orderData.total_amount.toLocaleString("id-ID")
                : "N/A"}
            </p>
            <p>
              <strong>Tanggal Pesanan:</strong>{" "}
              {new Date(orderData.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {orderData.invitation_detail && (
          <Card>
            <CardHeader>
              <CardTitle>Detail Pernikahan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Mempelai Wanita:</strong>{" "}
                {orderData.invitation_detail.bride_full_name} (
                {orderData.invitation_detail.bride_nickname})
              </p>
              <p>
                <strong>Mempelai Pria:</strong>{" "}
                {orderData.invitation_detail.groom_full_name} (
                {orderData.invitation_detail.groom_nickname})
              </p>
              <p>
                <strong>Orang Tua Mempelai Wanita:</strong>{" "}
                {orderData.invitation_detail.bride_parents}
              </p>
              <p>
                <strong>Orang Tua Mempelai Pria:</strong>{" "}
                {orderData.invitation_detail.groom_parents}
              </p>
              <p>
                <strong>Tanggal Akad:</strong>{" "}
                {new Date(
                  orderData.invitation_detail.akad_date,
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Waktu Akad:</strong>{" "}
                {orderData.invitation_detail.akad_time}
              </p>
              <p>
                <strong>Lokasi Akad:</strong>{" "}
                {orderData.invitation_detail.akad_location}
              </p>
              {orderData.invitation_detail.reception_date && (
                <>
                  <p>
                    <strong>Tanggal Resepsi:</strong>{" "}
                    {new Date(
                      orderData.invitation_detail.reception_date,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Waktu Resepsi:</strong>{" "}
                    {orderData.invitation_detail.reception_time}
                  </p>
                  <p>
                    <strong>Lokasi Resepsi:</strong>{" "}
                    {orderData.invitation_detail.reception_location}
                  </p>
                </>
              )}
              {orderData.invitation_detail.gmaps_link && (
                <p>
                  <strong>Google Maps:</strong>{" "}
                  <a
                    href={orderData.invitation_detail.gmaps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:underline"
                  >
                    Tautan
                  </a>
                </p>
              )}
              {orderData.invitation_detail.prewedding_photo && (
                <div className="mt-4">
                  <strong>Foto Prewedding:</strong>
                  <div className="mt-2 rounded-lg border p-2">
                    <a
                      href={orderData.invitation_detail.prewedding_photo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={orderData.invitation_detail.prewedding_photo}
                        alt="Foto Prewedding"
                        width={500}
                        height={500}
                        className="h-auto w-full max-w-sm rounded-md object-contain"
                      />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-semibold text-sm text-muted-foreground">
                Alamat
              </p>
              <p>{orderData.shipping_address}</p>
            </div>
            {orderData.shipping_method && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground">
                  Metode Pengiriman
                </p>
                <p className="capitalize">
                  {orderData.shipping_method === "rajaongkir"
                    ? "Ekspedisi"
                    : orderData.shipping_method === "pickup"
                      ? "Ambil Sendiri"
                      : "GoSend (Manual)"}
                </p>
              </div>
            )}
            {orderData.courier && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground">
                  Kurir
                </p>
                <p className="uppercase">
                  {orderData.courier}{" "}
                  {orderData.shipping_service
                    ? `- ${orderData.shipping_service}`
                    : ""}
                </p>
              </div>
            )}
            {typeof orderData.shipping_cost === "number" && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground">
                  Biaya Ongkir
                </p>
                <p>Rp. {orderData.shipping_cost.toLocaleString("id-ID")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Status Pembayaran:</strong>{" "}
              {getPaymentStatusBadge(orderData.payment_status)}
            </p>
            <p>
              <strong>Jumlah Dibayar:</strong> Rp.{" "}
              {amountPaid.toLocaleString("id-ID")}
            </p>
            <p>
              <strong>Sisa Tagihan:</strong> Rp.{" "}
              {remainingBalance.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbarui Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {orderData.order_status === ORDER_STATUS.COMPLETED ? (
              <div className="flex items-center justify-center border border-green-200 bg-card rounded-lg p-4">
                <div className="text-center">
                  <Badge variant="success" className="mb-2">
                    {getOrderStatusLabel(ORDER_STATUS.COMPLETED)}
                  </Badge>
                  <p className="text-foreground text-sm">
                    Pesanan telah selesai. Tidak ada tindakan lebih lanjut yang
                    diperlukan.
                  </p>
                </div>
              </div>
            ) : orderData.order_status === ORDER_STATUS.CANCELLED ? (
              <div className="flex items-center justify-center rounded-lg border border-red-200 p-4">
                <div className="text-center">
                  <Badge variant="destructive" className="mb-2">
                    {getOrderStatusLabel(ORDER_STATUS.CANCELLED)}
                  </Badge>
                  <p className="text-foreground text-sm">
                    Pesanan telah dibatalkan.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {orderData.order_status === ORDER_STATUS.PENDING_PAYMENT && (
                  <Button onClick={() => updateStatus(ORDER_STATUS.PAID)}>
                    Konfirmasi Pembayaran (Manual)
                  </Button>
                )}
                {orderData.order_status === ORDER_STATUS.PAID && (
                  <Button onClick={() => updateStatus(ORDER_STATUS.PROCESSING)}>
                    Proses Pesanan
                  </Button>
                )}
                {orderData.order_status === ORDER_STATUS.PROCESSING && (
                  <Button
                    onClick={() => updateStatus(ORDER_STATUS.IN_PRODUCTION)}
                  >
                    Tandai sebagai Produksi
                  </Button>
                )}
                {orderData.order_status === ORDER_STATUS.IN_PRODUCTION && (
                  <Button onClick={() => updateStatus(ORDER_STATUS.SHIPPED)}>
                    Tandai sebagai Dikirim
                  </Button>
                )}
                {orderData.order_status === ORDER_STATUS.SHIPPED && (
                  <Button onClick={() => updateStatus(ORDER_STATUS.DELIVERED)}>
                    Tandai sebagai Terkirim
                  </Button>
                )}
                {orderData.order_status === ORDER_STATUS.DELIVERED && (
                  <Button onClick={() => updateStatus(ORDER_STATUS.COMPLETED)}>
                    Tandai sebagai Selesai
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => updateStatus(ORDER_STATUS.CANCELLED)}
                >
                  Batalkan Pesanan
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Item yang Di Pesan</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {orderData.order_items && orderData.order_items.length > 0 ? (
            <div className="w-full">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Produk</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderData.order_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="">{item.product_name}</TableCell>

                      <TableCell>{item.quantity}</TableCell>

                      <TableCell className="text-xs">
                        Rp. {item.price.toLocaleString("id-ID")}
                      </TableCell>

                      <TableCell className="text-xs">
                        Rp. {item.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Tidak ada item di pesanan ini.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>

        {/* Prevent page from horizontal scrolling */}
        <CardContent className="overflow-hidden">
          {/* Table scrolls horizontally */}
          <div className="w-full overflow-x-auto">
            {orderData.payments && orderData.payments.length > 0 ? (
              <Table className="min-w-[400px] w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Tanggal</TableHead>
                    <TableHead className="w-[120px]">Jumlah</TableHead>
                    <TableHead className="w-[200px]">Metode</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderData.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-xs">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-xs">
                        Rp. {payment.amount.toLocaleString("id-ID")}
                      </TableCell>

                      <TableCell className="text-xs whitespace-normal break-words">
                        {payment.payment_method}
                      </TableCell>

                      <TableCell className="text-xs">
                        {getPaymentStatusBadge(payment.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm">
                Tidak ada riwayat pembayaran untuk pesanan ini.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Design Proof Section */}
      <DesignProofSection
        orderId={orderData.id}
        orderItems={orderData.order_items}
      />
    </div>
  );
};

export default OrderDetailsPage;
