import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { LicenseIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20">
            <HugeiconsIcon icon={LicenseIcon} className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              DriveTrack
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Simplifiez votre apprentissage de la conduite.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            asChild 
            size="lg" 
            className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.97] bg-primary hover:bg-primary/90"
          >
            <Link to="/student" className="flex items-center justify-center gap-3">
              Accéder à l'espace élève
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        <div className="pt-12 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            Projet prêt à l'emploi
          </p>
        </div>
      </div>
    </div>
  )
}
