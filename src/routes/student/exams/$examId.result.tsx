import { createFileRoute, Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CheckmarkCircle01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  ChartBarIncreasingIcon,
  InformationCircleIcon,
  CancelCircleIcon
} from '@hugeicons/core-free-icons';
import { mockExams } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const Route = createFileRoute('/student/exams/$examId/result')({
  component: ExamResult,
});

function ExamResult() {
  const { examId } = Route.useParams();
  const exam = mockExams.find(e => e.id === examId);

  if (!exam) return <div>Examen non trouvé</div>;

  const result = {
    score: 36,
    total: 40,
    status: 'passed' as const,
    topics: [
      { name: 'Signaleur et Intersections', correct: 10, total: 10 },
      { name: 'Vitesse et Distances',        correct: 8,  total: 10 },
      { name: 'Priorités de passage',        correct: 15, total: 15 },
      { name: 'Mécanique de base',           correct: 3,  total: 5  },
    ],
    questions: [
      {
        id: 'q1',
        text: 'Quelle est la signification de ce signal ?',
        studentChoice: 'a',
        correctChoice: 'a',
        isCorrect: true,
        explanation: "Ce panneau indique une interdiction de tourner à gauche à la prochaine intersection.",
      },
      {
        id: 'q2',
        text: 'À quelle distance minimale doit-on se placer derrière un véhicule ?',
        studentChoice: 'b',
        correctChoice: 'c',
        isCorrect: false,
        explanation: "La règle de sécurité préconise une distance correspondant à 2 secondes de temps de réaction.",
      }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex items-center gap-2">
        <Link to="/student/exams">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Résultat de l'examen</h1>
      </header>

      {/* Result Banner */}
      <Card className={cn(
        "border-none shadow-2xl relative overflow-hidden",
        result.status === 'passed' ? "bg-green-600 text-white" : "bg-red-600 text-white"
      )}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <CardContent className="p-8 text-center space-y-6 relative z-10">
          <div className="mx-auto h-20 w-20 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
            <HugeiconsIcon icon={result.status === 'passed' ? CheckmarkCircle01Icon : CancelCircleIcon} className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-black tracking-tighter">{result.score} <span className="text-2xl opacity-70">/ {result.total}</span></p>
            <p className="text-sm font-bold uppercase tracking-[0.2em]">{result.status === 'passed' ? 'Examen Réussi' : 'Examen Échoué'}</p>
          </div>
          {result.status === 'passed' ? (
            <Badge className="bg-white text-green-600 hover:bg-white/90 px-6 py-1.5 rounded-full font-black shadow-lg">Étape suivante : Pratique</Badge>
          ) : (
            <Button variant="secondary" className="rounded-full px-8 font-bold text-red-600 shadow-lg">Nouvelle tentative</Button>
          )}
        </CardContent>
      </Card>

      {/* Topics */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <HugeiconsIcon icon={ChartBarIncreasingIcon} className="h-5 w-5 text-primary" /> Performance par sujet
        </h2>
        <div className="grid gap-3">
          {result.topics.map((topic, i) => (
            <Card key={i} className="border-none bg-muted/30 shadow-none">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="truncate">{topic.name}</span>
                  <span className={cn(topic.correct === topic.total ? "text-green-600" : "text-orange-600")}>
                    {topic.correct} / {topic.total}
                  </span>
                </div>
                <Progress value={(topic.correct / topic.total) * 100} className="h-2 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Question Review */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Révision des questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {result.questions.map((q, i) => (
            <AccordionItem key={q.id} value={q.id} className="border-none">
              <AccordionTrigger className="w-full text-left p-4 bg-muted/30 rounded-2xl hover:no-underline hover:bg-muted/50 transition-colors border-none">
                <div className="flex items-center gap-4 w-full pr-2">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {i + 1}
                  </div>
                  <span className="font-bold text-sm truncate flex-1">{q.text}</span>
                  <HugeiconsIcon
                    icon={q.isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
                    className={cn("h-4 w-4 shrink-0", q.isCorrect ? "text-green-600" : "text-red-600")}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 px-1">
                <Card className="border-none bg-muted/10 shadow-inner">
                  <CardContent className="p-5 space-y-4">
                    {!q.isCorrect && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Réponse sélectionnée</p>
                        <div className="p-3 rounded-xl border-2 border-red-200 bg-red-50 text-sm font-bold">
                          Option {q.studentChoice.toUpperCase()}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Réponse correcte</p>
                        <div className="p-3 rounded-xl border-2 border-green-200 bg-green-50 text-sm font-bold">
                          Option {q.correctChoice.toUpperCase()}
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                      <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary flex-none mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-primary uppercase">Explication</p>
                        <p className="text-sm leading-relaxed text-foreground/80">{q.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
