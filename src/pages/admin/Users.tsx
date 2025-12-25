import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Enums } from "@/integrations/supabase/types";

// Define os papéis disponíveis, garantindo que 'seller' esteja incluído.
type AppRole = Enums<"app_role">;
const ROLES: AppRole[] = ["admin", "seller", "user"];

interface UserData {
  id: string;
  email: string | undefined;
  role: AppRole | null;
}

// Função para buscar todos os usuários e seus papéis
async function fetchUsers(): Promise<UserData[]> {
  // Requer privilégios de admin no Supabase para listar usuários
  const { data, error } = await supabase.functions.invoke('list-users');

  if (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}. Verifique as permissões no Supabase.`);
  }

  return data.users;
}

// Função para atualizar o papel de um usuário
async function updateUserRole({ userId, role }: { userId: string; role: AppRole | null }) {
  // Usa 'upsert' para criar um papel se não existir, ou atualizar se já existir.
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: role }, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Erro ao atualizar papel: ${error.message}`);
  }
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
      toast.success("Papel do usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleRoleChange = (userId: string, role: string) => {
    // Converte 'null' (string) para o valor null real
    const newRole = role === "null" ? null : (role as AppRole);
    mutation.mutate({ userId, role: newRole });
  };

  if (isLoading) return <div className="p-4">Carregando usuários...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <div className="rounded-md border">
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
                  <Select
                    value={user.role ?? "null"}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Definir papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Usuário Padrão</SelectItem>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {/* Capitaliza o nome do papel para exibição */}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
