import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, ShoppingBag, Bell, Shield, Palette, Database } from "lucide-react";
import { IntegrationConfig } from "@/components/marketplace/IntegrationConfig";
import { ManualOrderForm } from "@/components/marketplace/ManualOrderForm";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [theme, setTheme] = useState('Claro');
  const [primaryColor, setPrimaryColor] = useState('purple');
  const [fontSize, setFontSize] = useState('Média');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <SettingsIcon className="w-12 h-12 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Configurações do Sistema</h1>
            <p className="text-slate-600">Gerencie usuários, notificações e preferências do sistema</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6">Personalização da Interface</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base mb-2 block">Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Claro">Claro</SelectItem>
                      <SelectItem value="Escuro">Escuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base mb-2 block">Cor Principal</Label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPrimaryColor('purple')}
                      className={`w-12 h-12 rounded-lg bg-purple-600 ${primaryColor === 'purple' ? 'ring-4 ring-purple-300' : ''}`}
                    />
                    <button 
                      onClick={() => setPrimaryColor('red')}
                      className={`w-12 h-12 rounded-lg bg-red-600 ${primaryColor === 'red' ? 'ring-4 ring-red-300' : ''}`}
                    />
                    <button 
                      onClick={() => setPrimaryColor('orange')}
                      className={`w-12 h-12 rounded-lg bg-orange-600 ${primaryColor === 'orange' ? 'ring-4 ring-orange-300' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-2 block">Tamanho da Fonte</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pequena">Pequena</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <Label className="text-base">Modo Compacto</Label>
                    <p className="text-sm text-slate-600">Reduzir espaçamentos da interface</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Importar Pedidos</h3>
                <p className="text-slate-600">Importe pedidos manualmente de cada marketplace ou ERP conectado</p>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Dica: Para importar pedidos, primeiro conecte os marketplaces na aba "Integrações" e depois use os botões de importação que aparecem em cada card.
                </p>
              </div>

              <Tabs defaultValue="integrations" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="integrations">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Integrações
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <Database className="w-4 h-4 mr-2" />
                    Registro Manual
                  </TabsTrigger>
                  <TabsTrigger value="import">
                    <Database className="w-4 h-4 mr-2" />
                    Importação
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="integrations">
                  <IntegrationConfig />
                </TabsContent>

                <TabsContent value="manual">
                  <div className="flex justify-center py-8">
                    <ManualOrderForm onOrderCreated={() => {}} />
                  </div>
                </TabsContent>

                <TabsContent value="import">
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-600 mb-4">Conecte um marketplace para importar pedidos</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6">Preferências de Notificações</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <Label className="text-base">Alertas por Email</Label>
                    <p className="text-sm text-slate-600">Receber notificações importantes por email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <Label className="text-base">Alertas Sonoros</Label>
                    <p className="text-sm text-slate-600">Sons de alerta para eventos importantes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <Label className="text-base">Alertas de Estoque Baixo</Label>
                    <p className="text-sm text-slate-600">Notificar quando produtos estiverem com estoque baixo</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <Label className="text-base">Alertas de Pagamentos</Label>
                    <p className="text-sm text-slate-600">Notificar sobre pagamentos próximos do vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6">Configurações de Segurança</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base mb-2 block">Timeout de Sessão (minutos)</Label>
                  <Input type="number" defaultValue="30" className="max-w-xs" />
                  <p className="text-sm text-slate-600 mt-1">Tempo de inatividade antes do logout automático</p>
                </div>

                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <Label className="text-base">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-slate-600">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <Label className="text-base">Logs de Auditoria</Label>
                    <p className="text-sm text-slate-600">Registrar todas as ações dos usuários</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button variant="destructive" className="mt-4">
                  Alterar Senha do Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">Gerenciamento de usuários disponível na área administrativa</p>
                <Button onClick={() => window.location.href = '/user-management'}>
                  Ir para Gestão de Usuários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6">Backup e Restauração</h3>
              <div className="text-center py-12">
                <Database className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">Em breve: Sistema de backup automático</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
