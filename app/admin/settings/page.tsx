"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
}

interface SettingsResponse {
  data: Record<string, Setting[]>;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery<SettingsResponse>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/admin/settings");
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      const initialData: Record<string, string> = {};
      Object.values(data.data).flat().forEach((setting) => {
        initialData[setting.key] = setting.value || "";
      });
      setFormData(initialData);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newSettings: { key: string; value: string }[]) => {
      return api.post("/admin/settings", { settings: newSettings });
    },
    onSuccess: () => {
      toast.success("Pengaturan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      toast.error("Gagal menyimpan pengaturan");
    },
  });

  const handleSave = () => {
    const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
    }));
    mutation.mutate(settingsToUpdate);
  };

  if (isLoading) return <p>Memuat pengaturan...</p>;

  const groups = data?.data ? Object.keys(data.data) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi situs web Anda.
        </p>
      </div>

      {groups.length > 0 ? (
        <Tabs defaultValue={groups[0]} className="w-full">
          <TabsList>
            {groups.map((group) => (
              <TabsTrigger key={group} value={group} className="capitalize">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map((group) => (
            <TabsContent key={group} value={group}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{group} Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.data[group].map((setting) => (
                    <div key={setting.id} className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor={setting.key} className="capitalize">
                        {setting.key.replace(/_/g, " ")}
                      </Label>
                      <Input
                        id={setting.key}
                        value={formData[setting.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [setting.key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p>Belum ada pengaturan yang tersedia. Silakan jalankan migrasi database.</p>
      )}
    </div>
  );
}
