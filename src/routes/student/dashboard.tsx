import { createFileRoute, Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Calendar01Icon, 
  LicenseIcon, 
  ArrowRight01Icon,
  UserCircleIcon
} from '@hugeicons/core-free-icons';
import { mockStudent, mockStudentProfile, mockSessions, mockExams } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

export const Route = createFileRoute('/student/dashboard')({
  component: StudentDashboard,
});

function StudentDashboard() {
  const nextSession = mockSessions.find(s => s.status === 'scheduled');
  const pendingExam = mockExams.find(e => e.status === 'pending');
  
  const currentStageIndex = ['theory_pending', 'theory_passed', 'practical_pending', 'practical_passed', 'graduated'].indexOf(mockStudentProfile.license_stage);
  const overallProgress = (currentStageIndex / 4) * 100 + 20;

  const stages = [
    { label: 'Théorie' },
    { label: 'Pratique' },
    { label: 'Permis' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Bonjour, {mockStudent.first_name}!</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre progression.</p>
      </section>

      {/* Progress Card */}
      <Card className="border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-xl shadow-primary/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Progression</p>
            <Badge variant="outline" className="font-sans border-primary/20 text-primary text-[10px]">
              {mockStudentProfile.license_stage.replace(/_/g, ' ')}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Étape actuelle</span>
              <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-primary/20" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {stages.map((stage, i) => (
              <div key={stage.label} className="text-center space-y-1">
                <div className={cn("mx-auto h-2 w-full rounded-full", i < Math.ceil(currentStageIndex / 2) + 1 ? "bg-primary" : "bg-muted")} />
                <span className="text-[10px] font-medium text-muted-foreground">{stage.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Exam Alert */}
      {pendingExam && (
        <Alert className="border-primary/20 bg-primary/5 shadow-lg shadow-primary/5 border-l-4">
          <HugeiconsIcon icon={LicenseIcon} className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold">Examen en attente</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 mt-1">
            <span>Vous avez un examen théorique à passer.</span>
            <Link to="/student/exams">
              <Badge className="w-fit cursor-pointer flex items-center gap-1 py-1.5 px-3">
                Commencer maintenant <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
              </Badge>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Next Session Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Prochaine séance</h2>
          <Link to="/student/schedule" className="text-sm text-primary font-medium flex items-center gap-1">
            Voir tout <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Link>
        </div>
        {nextSession ? (
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex gap-4">
              <div className="flex-none h-16 w-16 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-primary">
                <span className="text-xs font-bold uppercase">{format(new Date(nextSession.scheduled_at), 'MMM')}</span>
                <span className="text-2xl font-black">{format(new Date(nextSession.scheduled_at), 'd')}</span>
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base truncate">{format(new Date(nextSession.scheduled_at), 'HH:mm')}</h3>
                  <Badge variant="secondary" className="font-sans text-[10px] uppercase">{nextSession.vehicle?.make}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                  <HugeiconsIcon icon={UserCircleIcon} className="h-3.5 w-3.5" /> {nextSession.instructor?.first_name} {nextSession.instructor?.last_name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                  <HugeiconsIcon icon={Calendar01Icon} className="h-3.5 w-3.5" /> {nextSession.location}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-2">
              <HugeiconsIcon icon={Calendar01Icon} className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Aucune séance prévue.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="bg-muted/5 border-none shadow-none">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">Taux de réussite</p>
            <p className="text-2xl font-black">85%</p>
            <p className="text-[10px] text-green-600 font-medium">Excellent travail !</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/5 border-none shadow-none">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">Heures de conduite</p>
            <p className="text-2xl font-black">12/30</p>
            <p className="text-[10px] text-primary font-medium">En bonne voie.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
