import { createFileRoute, Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Calendar01Icon, 
  UserCircleIcon, 
  Location01Icon,
  ArrowRight01Icon,
  Clock01Icon
} from '@hugeicons/core-free-icons';
import { mockSessions } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isAfter } from 'date-fns';

export const Route = createFileRoute('/student/schedule')({
  component: StudentSchedule,
});

function StudentSchedule() {
  const now = new Date();
  const upcomingSessions = mockSessions.filter(s => isAfter(new Date(s.scheduled_at), now) && s.status === 'scheduled');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Mon Planning</h1>
        <p className="text-muted-foreground">Gérez vos séances de conduite.</p>
      </section>

      <div className="flex p-1 bg-muted/30 rounded-2xl">
        <Button variant="ghost" className="flex-1 rounded-xl bg-background shadow-sm font-bold text-sm h-11">À venir</Button>
        <Link to="/student/sessions" className="flex-1">
          <Button variant="ghost" className="w-full rounded-xl font-bold text-sm text-muted-foreground h-11">Historique</Button>
        </Link>
      </div>

      <section className="space-y-4">
        {upcomingSessions.length > 0 ? (
          [...upcomingSessions]
            .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
            .map(session => (
              <Card key={session.id} className="border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardContent className="p-5 flex gap-4">
                  <div className="flex-none h-16 w-16 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-primary border border-primary/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{format(new Date(session.scheduled_at), 'MMM')}</span>
                    <span className="text-3xl font-black">{format(new Date(session.scheduled_at), 'd')}</span>
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-foreground">{format(new Date(session.scheduled_at), 'HH:mm')}</h3>
                      <Badge variant="outline" className="font-sans text-[10px] uppercase border-primary/20 text-primary">{session.vehicle?.make}</Badge>
                    </div>
                    <div className="grid gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HugeiconsIcon icon={UserCircleIcon} className="h-3.5 w-3.5" />
                        <span className="font-medium truncate">{session.instructor?.first_name} {session.instructor?.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HugeiconsIcon icon={Location01Icon} className="h-3.5 w-3.5" />
                        <span className="font-medium truncate">{session.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted/10 px-5 py-3 flex items-center justify-between border-t border-muted/20">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" /> Durée: {session.duration_mins} min
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 text-primary font-bold gap-1 px-0">
                    Détails <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
              <HugeiconsIcon icon={Calendar01Icon} className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium">Aucune séance prévue.</p>
            <Button variant="outline" className="rounded-full font-bold">Réserver une séance</Button>
          </div>
        )}
      </section>

      <Card className="bg-primary/5 border-none shadow-none rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <p className="text-xs text-primary/70 font-medium mb-1">NOTES IMPORTANTES</p>
          <ul className="text-xs space-y-1.5 text-foreground/80 list-disc list-inside">
            <li>Annulez 24h à l'avance pour éviter les frais.</li>
            <li>Présentez-vous 10 minutes avant le début.</li>
            <li>N'oubliez pas votre carnet de suivi.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
