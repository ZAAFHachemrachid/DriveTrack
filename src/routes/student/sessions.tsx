import { createFileRoute, Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CheckmarkCircle01Icon, 
  UserCircleIcon, 
  StarIcon,
  ChatNotification01Icon,
  ArrowLeft01Icon
} from '@hugeicons/core-free-icons';
import { mockSessions } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export const Route = createFileRoute('/student/sessions')({
  component: StudentSessionHistory,
});

function StudentSessionHistory() {
  const completedSessions = mockSessions.filter(s => s.status === 'completed');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex items-center gap-2">
        <Link to="/student/schedule">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Historique</h1>
      </header>

      <section className="space-y-4">
        {completedSessions.length > 0 ? (
          [...completedSessions]
            .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
            .map(session => (
              <Card key={session.id} className="border-none shadow-lg shadow-muted/20 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-5 flex gap-4">
                    <div className="flex-none h-14 w-14 rounded-2xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <span className="text-[9px] font-bold uppercase tracking-tighter">{format(new Date(session.scheduled_at), 'MMM')}</span>
                      <span className="text-2xl font-black">{format(new Date(session.scheduled_at), 'd')}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">{format(new Date(session.scheduled_at), 'HH:mm')}</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3 w-3" /> Terminé
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <HugeiconsIcon icon={UserCircleIcon} className="h-3.5 w-3.5" /> {session.instructor?.first_name} {session.instructor?.last_name}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <HugeiconsIcon
                            key={star}
                            icon={StarIcon}
                            className={cn(
                              "h-3 w-3",
                              star <= (session.performance_score ? Math.round(session.performance_score / 2) : 0)
                                ? "text-yellow-500"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                        <span className="text-xs font-bold ml-1">{session.performance_score?.toFixed(1)}/10</span>
                      </div>
                    </div>
                  </div>

                  {session.instructor_notes && (
                    <div className="bg-muted/20 m-4 mt-0 p-4 rounded-2xl border border-muted/30">
                      <div className="flex gap-2 items-start">
                        <HugeiconsIcon icon={ChatNotification01Icon} className="h-4 w-4 text-primary mt-0.5 flex-none" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Commentaire de l'instructeur</p>
                          <p className="text-sm italic text-foreground/80 leading-relaxed">"{session.instructor_notes}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Aucun historique disponible.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
