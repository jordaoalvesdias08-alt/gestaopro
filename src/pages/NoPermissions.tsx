import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function NoPermissions() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full bg-slate-800 border-2 border-red-600">
        <CardContent className="pt-12 pb-8 text-center">
          <Shield className="w-24 h-24 mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-xl text-slate-300 mb-6">
            Olá, <strong>{user?.username}</strong>! Você não possui permissões para acessar nenhuma área do sistema.
          </p>
          <p className="text-slate-400 mb-8">
            Entre em contato com o administrador do sistema para solicitar as permissões necessárias.
          </p>
          
          <Button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Fazer Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
