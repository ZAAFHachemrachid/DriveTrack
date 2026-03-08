import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CreditCardIcon,
  ArrowRight01Icon,
  Download01Icon,
  Alert01Icon,
  Cash01Icon
} from '@hugeicons/core-free-icons';
import { mockInvoices } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

export const Route = createFileRoute('/student/payments')({
  component: StudentPayments,
});

function StudentPayments() {
  const overdueInvoices = mockInvoices.filter(i => i.status === 'overdue');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
        <p className="text-muted-foreground">Suivez vos factures et versements.</p>
      </section>

      {overdueInvoices.length > 0 && (
        <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20 rounded-2xl animate-pulse">
          <HugeiconsIcon icon={Alert01Icon} className="h-5 w-5" />
          <AlertTitle className="font-black">Facture en retard</AlertTitle>
          <AlertDescription className="text-xs font-medium">
            Vous avez {overdueInvoices.length} facture(s) impayée(s). Veuillez régulariser votre situation.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        <h2 className="text-lg font-bold">Historique des transactions</h2>

        {mockInvoices.length > 0 ? (
          [...mockInvoices]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map(invoice => (
              <Card key={invoice.id} className="border-none shadow-xl shadow-muted/5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        invoice.status === 'paid' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        <HugeiconsIcon icon={invoice.payment_method === 'cash' ? Cash01Icon : CreditCardIcon} className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">{invoice.amount.toLocaleString()} {invoice.currency}</h3>
                        <p className="text-xs text-muted-foreground">{format(new Date(invoice.created_at), 'dd MMMM yyyy')}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      "font-sans text-[10px] uppercase h-6 px-3 rounded-full",
                      invoice.status === 'paid' ? "border-green-200 text-green-600 bg-green-50/50" : "border-orange-200 text-orange-600 bg-orange-50/50"
                    )}>
                      {invoice.status}
                    </Badge>
                  </div>

                  <div className="bg-muted/5 px-5 py-3 flex items-center justify-between border-t border-muted/10">
                    <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase truncate max-w-[150px]">
                      {invoice.payment_method ? `Via ${invoice.payment_method}` : 'Attente paiement'}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary">
                        <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Aucune transaction trouvée.</p>
          </div>
        )}
      </div>

      <Card className="bg-muted/30 border-none shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Résumé du forfait</CardTitle>
          <CardDescription className="text-xs">Pack "Conduite Liberté"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black">45,000 DZD</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Montant total dû</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">15,000 DZD</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Déjà payé</p>
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
              <span>Progression règlement</span>
              <span>33%</span>
            </div>
            <Progress value={33} className="h-2 bg-muted transition-all duration-1000" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
