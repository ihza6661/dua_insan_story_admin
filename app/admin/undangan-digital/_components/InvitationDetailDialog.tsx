"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ExternalLink, Calendar, MapPin, Users, Image as ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getDigitalInvitationById } from "@/services/api/digital-invitation.service";
import { getImageUrl } from "@/lib/utils";

interface InvitationDetailDialogProps {
  invitationId: number;
  trigger?: React.ReactNode;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Aktif</Badge>;
    case 'draft':
      return <Badge variant="default" className="bg-amber-500">Draft</Badge>;
    case 'expired':
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function InvitationDetailDialog({ invitationId, trigger }: InvitationDetailDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: invitation, isLoading } = useQuery({
    queryKey: ['digital-invitation', invitationId],
    queryFn: () => getDigitalInvitationById(invitationId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detail Undangan Digital</DialogTitle>
          <DialogDescription>
            Informasi lengkap undangan digital pelanggan
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : invitation ? (
          <div className="max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Informasi Pelanggan
                </h3>
                <div className="bg-muted p-4 rounded-lg space-y-1">
                  <p className="font-medium">{invitation.user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{invitation.user.email}</p>
                  {invitation.user.phone_number && (
                    <p className="text-sm text-muted-foreground">{invitation.user.phone_number}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Invitation Info */}
              <div>
                <h3 className="font-semibold mb-2">Informasi Undangan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <p className="font-mono text-sm font-medium">{invitation.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Template</p>
                    <p className="font-medium">{invitation.template.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(invitation.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="font-medium">{invitation.view_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dibuat</p>
                    <p className="text-sm">
                      {format(new Date(invitation.created_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                    </p>
                  </div>
                  {invitation.expires_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Expired</p>
                      <p className="text-sm">
                        {format(new Date(invitation.expires_at), "dd MMM yyyy", { locale: localeId })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Public URL */}
                <div className="mt-4">
                  <a
                    href={invitation.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {invitation.public_url}
                  </a>
                </div>
              </div>

              {/* Customization Data */}
              {invitation.customization_data && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Data Kustomisasi</h3>
                    <div className="space-y-4">
                      {/* Couple Names */}
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Pasangan</p>
                        <p className="font-medium text-lg">{invitation.customization_data.couple_names}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Pengantin Wanita</p>
                            <p className="font-medium">{invitation.customization_data.bride_name}</p>
                            {invitation.customization_data.bride_parents && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Putri dari {invitation.customization_data.bride_parents}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Pengantin Pria</p>
                            <p className="font-medium">{invitation.customization_data.groom_name}</p>
                            {invitation.customization_data.groom_parents && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Putra dari {invitation.customization_data.groom_parents}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">Acara Akad/Pemberkatan</h4>
                        </div>
                        <div className="bg-muted p-4 rounded-lg space-y-1">
                          <p className="text-sm">
                            {format(new Date(invitation.customization_data.event_date), "EEEE, dd MMMM yyyy", { locale: localeId })}
                          </p>
                          <p className="text-sm">Pukul {invitation.customization_data.event_time} WIB</p>
                          <p className="text-sm flex items-start gap-2 mt-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {invitation.customization_data.event_location}
                          </p>
                        </div>
                      </div>

                      {/* Reception Details */}
                      {invitation.customization_data.reception_date && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">Resepsi</h4>
                          </div>
                          <div className="bg-muted p-4 rounded-lg space-y-1">
                            <p className="text-sm">
                              {format(new Date(invitation.customization_data.reception_date), "EEEE, dd MMMM yyyy", { locale: localeId })}
                            </p>
                            <p className="text-sm">Pukul {invitation.customization_data.reception_time} WIB</p>
                            <p className="text-sm flex items-start gap-2 mt-2">
                              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              {invitation.customization_data.reception_location}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Maps URL */}
                      {invitation.customization_data.venue_maps_url && (
                        <div>
                          <a
                            href={invitation.customization_data.venue_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4" />
                            Lihat Lokasi di Maps
                          </a>
                        </div>
                      )}

                      {/* Additional Info */}
                      {invitation.customization_data.additional_info && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Informasi Tambahan</p>
                          <p className="text-sm bg-muted p-4 rounded-lg">
                            {invitation.customization_data.additional_info}
                          </p>
                        </div>
                      )}

                      {/* Photos */}
                      {invitation.customization_data.photos && invitation.customization_data.photos.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">Foto ({invitation.customization_data.photos.length})</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {invitation.customization_data.photos.map((photo, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getImageUrl(photo)}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <p>Data tidak ditemukan</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
