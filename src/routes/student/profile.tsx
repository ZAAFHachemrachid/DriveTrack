import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CallIcon, 
  Mail01Icon, 
  Location01Icon,
  CreditCardIcon,
  DocumentAttachmentIcon,
  Logout01Icon,
  Settings02Icon
} from '@hugeicons/core-free-icons';
import { mockStudent, mockStudentProfile, mockSchool } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/student/profile')({
  component: StudentProfile,
});

function StudentProfile() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="relative">
          <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-xl">
            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
              {mockStudent.first_name[0]}{mockStudent.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg">
            <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-black">{mockStudent.first_name} {mockStudent.last_name}</h1>
          <p className="text-muted-foreground text-sm font-medium">Étudiant à {mockSchool.name}</p>
        </div>
        <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-bold tracking-wider uppercase">
          {mockStudentProfile.license_stage.replace(/_/g, ' ')}
        </Badge>
      </section>

      {/* Info Sections */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold px-1">Informations personnelles</h2>
        
        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="phone" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">Téléphone</Label>
              <div className="relative">
                <HugeiconsIcon icon={CallIcon} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" defaultValue={mockStudent.phone} className="pl-10 bg-background border-none shadow-none focus-visible:ring-1" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">Email</Label>
              <div className="relative">
                <HugeiconsIcon icon={Mail01Icon} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" defaultValue={mockStudent.email} className="pl-10 bg-background border-none shadow-none focus-visible:ring-1" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="address" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">Adresse</Label>
              <div className="relative">
                <HugeiconsIcon icon={Location01Icon} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="address" defaultValue={mockStudentProfile.address} className="pl-10 bg-background border-none shadow-none focus-visible:ring-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                  <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">CNI (National ID)</p>
                  <p className="text-xs text-muted-foreground">{mockStudentProfile.national_id}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-sans">Lecture seule</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold px-1">Compte</h2>
        <div className="grid gap-2">
          <Button variant="ghost" className="w-full justify-between h-14 px-4 bg-muted/20 hover:bg-muted/40 rounded-2xl group border-none">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={DocumentAttachmentIcon} className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-bold">Mes documents</span>
            </div>
            <Badge variant="secondary" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">1</Badge>
          </Button>

          <Button variant="ghost" className="w-full justify-between h-14 px-4 bg-muted/20 hover:bg-muted/40 rounded-2xl group border-none">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-bold">Paiements et factures</span>
            </div>
          </Button>

          <Button variant="ghost" className="w-full justify-start h-14 px-4 hover:bg-destructive/10 text-destructive rounded-2xl border-none">
            <HugeiconsIcon icon={Logout01Icon} className="h-5 w-5 mr-3" />
            <span className="font-bold">Se déconnecter</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
