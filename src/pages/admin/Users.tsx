import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Enums } from "@/integrations/supabase/types";

type AppRole = Enums<"app_role">;
const ROLES: AppRole[] = ["admin", "seller", "user"];

interface UserData {
  id: string;
  email: string | undefined;
  role: AppRole | null;
}

async function fetchUsers(): Promise<UserData[]> {
  const { data, error } = await supabase.functions.invoke('list-users');
  if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`);
  return data.users;
}

async function updateUserRole({ userId, role }: { userId: string; role: AppRole | null }) {
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: role }, { onConflict: 'user_id' });
  if (error) throw new Error(`Erro ao atualizar papel: ${error.message}`);
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("Papel do usuário atualizado!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleRoleChange = (userId: string, role: string) => {
    const newRole = role === "null" ? null : (role as AppRole);
    mutation.mutate({ userId, role: newRole });
  };

  if (isLoading) return <AdminLayout title="Usuários" subtitle="Gerenciamento de usuários"><div className="p-4">Carregando...</div></AdminLayout>;
  if (error) return <AdminLayout title="Usuários" subtitle="Gerenciamento de usuários"><div className="p-4 text-red-500">Erro: {error.message}</div></AdminLayout>;

  return (
    <AdminLayout title="Usuários" subtitle="Gerenciamento de usuários">
      <Card>
        <CardHeader><CardTitle>Lista de Usuários</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="w-[200px]">Papel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role ?? "null"} onValueChange={(value) => handleRoleChange(user.id, value)} disabled={mutation.isPending}>
                      <SelectTrigger><SelectValue placeholder="Definir papel" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Usuário Padrão</SelectItem>
                        {ROLES.map((role) => <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
