import { createFileRoute, Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  LicenseIcon, 
  ArrowRight01Icon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';
import { mockExams } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export const Route = createFileRoute('/student/exams/')({
  component: ExamHub,
});

function ExamHub() {
  const pendingExams    = mockExams.filter(e => e.status === 'pending');
  const inProgressExams = mockExams.filter(e => e.status === 'in_progress');
  const completedExams  = mockExams.filter(e => e.status === 'passed' || e.status === 'failed');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Espace Examens</h1>
        <p className="text-muted-foreground">Préparez et passez vos tests théoriques.</p>
      </section>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/30 rounded-2xl">
          <TabsTrigger value="pending"  className="rounded-xl data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">À faire</TabsTrigger>
          <TabsTrigger value="active"   className="rounded-xl data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">En cours</TabsTrigger>
          <TabsTrigger value="history"  className="rounded-xl data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingExams.length > 0 ? (
            pendingExams.map(exam => (
              <Card key={exam.id} className="border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-primary/40" />
                <CardContent className="p-5 flex gap-4">
                  <div className="flex-none h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <HugeiconsIcon icon={LicenseIcon} className="h-7 w-7" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">Examen Théorique #{exam.attempt_number}</h3>
                      <Badge variant="secondary" className="font-sans text-[10px] uppercase">{exam.lang}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" /> {exam.duration_mins} min</span>
                      <span className="flex items-center gap-1"><HugeiconsIcon icon={LicenseIcon} className="h-3.5 w-3.5" /> {exam.total_questions} questions</span>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted/10 px-5 py-3 flex justify-end border-t border-muted/20">
                  <Link to="/student/exams/$examId/take" params={{ examId: exam.id }}>
                    <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                      Commencer <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center space-y-3">
              <HugeiconsIcon icon={LicenseIcon} className="mx-auto h-12 w-12 text-muted-foreground/20" />
              <p className="text-muted-foreground">Aucun examen en attente.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6 space-y-4">
          {inProgressExams.length > 0 ? (
            inProgressExams.map(exam => (
              <Card key={exam.id} className="border-none shadow-lg">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                      <HugeiconsIcon icon={Clock01Icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Examen en cours</h3>
                      <p className="text-xs text-muted-foreground">Veuillez terminer votre session.</p>
                    </div>
                  </div>
                  <Link to="/student/exams/$examId/take" params={{ examId: exam.id }}>
                    <Button variant="outline" className="rounded-full font-bold border-yellow-200 text-yellow-700 bg-yellow-50">Reprendre</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Aucune session active.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          {completedExams.length > 0 ? (
            [...completedExams]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map(exam => (
                <Card key={exam.id} className="border-none shadow-sm bg-muted/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        exam.status === 'passed' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        <HugeiconsIcon icon={exam.status === 'passed' ? CheckmarkCircle01Icon : Cancel01Icon} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Tentative #{exam.attempt_number}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{format(new Date(exam.created_at), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={cn("text-lg font-black", exam.status === 'passed' ? "text-green-600" : "text-red-600")}>
                          {exam.score}/{exam.total_questions}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{exam.status === 'passed' ? 'Admis' : 'Échoué'}</p>
                      </div>
                      <Link to="/student/exams/$examId/result" params={{ examId: exam.id }}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Historique vide.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
