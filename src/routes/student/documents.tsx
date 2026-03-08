import { createFileRoute } from '@tanstack/react-router';
import type { StudentDocument } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DocumentAttachmentIcon,
  Upload01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons';
import { mockDocuments } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Route = createFileRoute('/student/documents')({
  component: StudentDocuments,
});

function StudentDocuments() {
  const docTypes = [
    { key: 'national_id',    label: 'Carte d\'identité',      required: true  },
    { key: 'photo',          label: 'Photo d\'identité',       required: true  },
    { key: 'medical_cert',   label: 'Certificat médical',      required: true  },
    { key: 'birth_cert',     label: 'Acte de naissance',       required: true  },
    { key: 'residence_cert', label: 'Certificat de résidence', required: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Gérez vos pièces justificatives.</p>
      </section>

      <Alert className="bg-primary/5 border-primary/20 rounded-2xl">
        <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary" />
        <AlertDescription className="text-xs font-medium text-foreground/80">
          Certains documents sont obligatoires pour valider votre inscription définitive et passer les examens.
        </AlertDescription>
      </Alert>

      <section className="grid gap-4">
        {docTypes.map((type) => {
          const doc = mockDocuments.find((d: StudentDocument) => d.type === type.key);

          return (
            <Card key={type.key} className="border-none shadow-xl shadow-muted/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                      doc ? "bg-primary/5 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}>
                      <HugeiconsIcon icon={DocumentAttachmentIcon} className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{type.label}</h3>
                        {type.required && (
                          <Badge variant="outline" className="text-[9px] uppercase font-sans border-destructive/20 text-destructive h-4">Obligatoire</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Format PDF, JPG ou PNG</p>
                    </div>
                  </div>

                  {doc ? (
                    <Badge className={cn(
                      "font-sans text-[10px] uppercase h-6 px-3 rounded-full flex gap-1 items-center",
                      doc.status === 'approved' ? "bg-green-100 text-green-700" :
                      doc.status === 'pending'  ? "bg-yellow-100 text-yellow-700" :
                                                   "bg-red-100 text-red-700"
                    )}>
                      {doc.status === 'approved' && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3 w-3" />}
                      {doc.status === 'pending'  && <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />}
                      {doc.status === 'rejected' && <HugeiconsIcon icon={CancelCircleIcon} className="h-3 w-3" />}
                      {doc.status}
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="rounded-full text-primary font-bold h-9">
                      <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4 mr-2" /> Téléverser
                    </Button>
                  )}
                </div>

                {doc?.status === 'rejected' && (
                  <div className="m-4 mt-0 bg-red-50 p-3 rounded-xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-700 uppercase mb-1">Motif du rejet</p>
                    <p className="text-xs text-red-600 font-medium italic">"{doc.notes || 'Document illisible ou expiré.'}"</p>
                    <Button variant="link" className="h-auto p-0 mt-2 text-xs font-bold text-red-700">Re-téléverser</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
