import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Flag01Icon,
  CheckmarkCircle01Icon
} from '@hugeicons/core-free-icons';
import { mockExams } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    text: 'Quelle est la signification de ce signal ?',
    options: [
      { id: 'a', text: 'Interdiction de tourner à gauche' },
      { id: 'b', text: 'Sens obligatoire à gauche' },
      { id: 'c', text: "Fin d'interdiction" },
      { id: 'd', text: 'Route prioritaire' }
    ]
  },
  {
    id: 'q2',
    text: 'À quelle distance minimale doit-on se placer derrière un véhicule ?',
    options: [
      { id: 'a', text: '10 mètres' },
      { id: 'b', text: 'La distance parcourue en 1 seconde' },
      { id: 'c', text: 'La distance parcourue en 2 secondes' },
      { id: 'd', text: "Aucune distance n'est imposée" }
    ]
  }
];

export const Route = createFileRoute('/student/exams/$examId/take')({
  component: TakeExam,
});

function TakeExam() {
  const { examId } = Route.useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === examId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = ((currentIdx + 1) / MOCK_QUESTIONS.length) * 100;
  const currentQuestion = MOCK_QUESTIONS[currentIdx];

  const handleSubmit = () => {
    navigate({ to: '/student/exams/$examId/result', params: { examId: examId! } });
  };

  if (!exam) return <div>Examen non trouvé</div>;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col font-serif overflow-hidden">
      {/* Header */}
      <header className="flex h-14 items-center justify-between px-4 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to="/student/exams">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-bold">Question {currentIdx + 1}/{MOCK_QUESTIONS.length}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-inner",
          timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-muted/50 text-foreground"
        )}>
          <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
          {formatTime(timeLeft)}
        </div>
      </header>

      <Progress value={progress} className="h-1 rounded-none bg-muted" />

      {/* Question */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-4">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold text-primary border-primary/20">Question {currentIdx + 1}</Badge>
          <h2 className="text-xl font-black leading-tight">{currentQuestion.text}</h2>
          <div className="aspect-video w-full rounded-2xl bg-muted/30 overflow-hidden flex items-center justify-center relative border border-muted">
            <img
              src={`https://placehold.co/600x340?text=Illustration+${currentIdx + 1}`}
              alt="Question"
              className="object-cover w-full h-full"
            />
            <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70">
              <HugeiconsIcon icon={Flag01Icon} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={val => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
          className="grid gap-3"
        >
          {currentQuestion.options.map(opt => (
            <Label
              key={opt.id}
              htmlFor={opt.id}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer active:scale-[0.98]",
                answers[currentQuestion.id] === opt.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                  : "border-muted/50 hover:bg-muted/10"
              )}
            >
              <div className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black transition-colors uppercase",
                answers[currentQuestion.id] === opt.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}>
                {opt.id}
              </div>
              <span className="text-sm font-bold flex-1">{opt.text}</span>
              <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
              {answers[currentQuestion.id] === opt.id && (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 text-primary animate-in zoom-in duration-300" />
              )}
            </Label>
          ))}
        </RadioGroup>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-background border-t flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx(i => i - 1)}
          disabled={currentIdx === 0}
          className="rounded-full font-bold gap-2 px-6 border-none bg-muted/30"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" /> Précédent
        </Button>

        {currentIdx < MOCK_QUESTIONS.length - 1 ? (
          <Button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="rounded-full font-bold gap-2 px-8 shadow-lg shadow-primary/20"
          >
            Suivant <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-full font-bold gap-2 px-8 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200">
                Terminer <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl max-w-[90%] mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black">Soumettre l'examen ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous avez répondu à {Object.keys(answers).length} questions sur {MOCK_QUESTIONS.length}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-2 mt-4">
                <AlertDialogCancel className="flex-1 rounded-2xl font-bold border-none bg-muted">Réviser</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} className="flex-1 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/20">Oui, envoyer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </footer>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
