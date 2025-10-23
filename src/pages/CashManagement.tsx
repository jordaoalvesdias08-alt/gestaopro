import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, TrendingUp, TrendingDown, Filter, Plus, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CashMovement {
  id: string;
  type: 'entrada' | 'saida';
  value: number;
  category: string;
  reason: string;
  description?: string;
  receipt?: string;
  date: string;
}

const CATEGORIES = {
  entrada: ['Venda', 'Depósito', 'Retirada', 'Despesa', 'Pagamento Fornecedor', 'Salário', 'Aluguel', 'Outros'],
  saida: ['Venda', 'Depósito', 'Retirada', 'Despesa', 'Pagamento Fornecedor', 'Salário', 'Aluguel', 'Outros']
};

export default function CashManagement() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('entrada');
  const [formData, setFormData] = useState({
    value: '',
    category: 'Outros',
    reason: '',
    description: ''
  });

  const { data: movements = [] } = useQuery({
    queryKey: ['cash-movements'],
    queryFn: async () => {
      const stored = localStorage.getItem('cash_movements');
      return stored ? JSON.parse(stored) : [];
    }
  });

  const addMovementMutation = useMutation({
    mutationFn: async (movement: Omit<CashMovement, 'id' | 'date'>) => {
      const stored = localStorage.getItem('cash_movements');
      const existing = stored ? JSON.parse(stored) : [];
      const newMovement = {
        ...movement,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      const updated = [...existing, newMovement];
      localStorage.setItem('cash_movements', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-movements'] });
      toast.success('Movimentação registrada com sucesso!');
      setIsDialogOpen(false);
      setFormData({ value: '', category: 'Outros', reason: '', description: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value || !formData.reason) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    addMovementMutation.mutate({
      type: movementType,
      value: parseFloat(formData.value),
      category: formData.category,
      reason: formData.reason,
      description: formData.description
    });
  };

  const calculateBalance = () => {
    const entradas = movements
      .filter((m: CashMovement) => m.type === 'entrada')
      .reduce((sum: number, m: CashMovement) => sum + m.value, 0);
    
    const saidas = movements
      .filter((m: CashMovement) => m.type === 'saida')
      .reduce((sum: number, m: CashMovement) => sum + m.value, 0);
    
    return {
      balance: entradas - saidas,
      totalEntradas: entradas,
      totalSaidas: saidas
    };
  };

  const stats = calculateBalance();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Wallet className="w-12 h-12 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Gestão de Caixa</h1>
            <p className="text-slate-600">Controle completo de entradas e saídas</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Wallet className="w-12 h-12" />
                <div>
                  <p className="text-sm opacity-90">Saldo em Caixa</p>
                  <p className="text-3xl font-bold">R$ {stats.balance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12" />
                <div>
                  <p className="text-sm opacity-90">Total Entradas</p>
                  <p className="text-3xl font-bold">R$ {stats.totalEntradas.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingDown className="w-12 h-12" />
                <div>
                  <p className="text-sm opacity-90">Total Saídas</p>
                  <p className="text-3xl font-bold">R$ {stats.totalSaidas.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Select defaultValue="Todos">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="Todas">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="w-48" placeholder="dd/mm/aaaa" />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Movimentação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Movimentação</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs value={movementType} onValueChange={(v) => setMovementType(v as 'entrada' | 'saida')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="entrada" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger value="saida" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Saída
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Valor *</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES[movementType].map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo *</Label>
                  <Input
                    id="reason"
                    placeholder="Ex: Venda de produto, Pagamento de aluguel..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalhes adicionais..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Comprovante (Opcional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">Procurar... Nenhum arquivo selecionado.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações (0)</CardTitle>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Nenhuma movimentação encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {movements.map((movement: CashMovement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{movement.reason}</p>
                      <p className="text-sm text-slate-600">{movement.category}</p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(movement.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <p className={`text-xl font-bold ${movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.type === 'entrada' ? '+' : '-'} R$ {movement.value.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
