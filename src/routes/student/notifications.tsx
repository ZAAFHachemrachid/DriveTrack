import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Notification01Icon, 
  LicenseIcon, 
  Calendar01Icon, 
  DocumentAttachmentIcon,
  Invoice01Icon
} from '@hugeicons/core-free-icons';
import { mockNotifications } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import type { IconSvgElement } from '@hugeicons/react';

export const Route = createFileRoute('/student/notifications')({
  component: StudentNotifications,
});

function StudentNotifications() {
  const getIcon = (type: string): IconSvgElement => {
    switch (type) {
      case 'exam':     return LicenseIcon;
      case 'session':  return Calendar01Icon;
      case 'document': return DocumentAttachmentIcon;
      case 'invoice':  return Invoice01Icon;
      default:         return Notification01Icon;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'exam':     return 'bg-primary/10 text-primary';
      case 'session':  return 'bg-blue-100 text-blue-700';
      case 'document': return 'bg-orange-100 text-orange-700';
      case 'invoice':  return 'bg-purple-100 text-purple-700';
      default:         return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Restez informé de votre activité.</p>
      </section>

      <ScrollArea className="flex-1 -mx-4 px-4 h-[calc(100vh-200px)]">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Récents</p>

          {mockNotifications.length > 0 ? (
            [...mockNotifications]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map(notif => (
                <Card key={notif.id} className={cn(
                  "border-none shadow-lg shadow-muted/5 transition-all duration-300 rounded-3xl overflow-hidden",
                  !notif.is_read && "ring-2 ring-primary/20 bg-primary/[0.02]"
                )}>
                  <CardContent className="p-4 flex gap-4">
                    <div className={cn(
                      "flex-none h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                      getBgColor(notif.type)
                    )}>
                      <HugeiconsIcon icon={getIcon(notif.type)} className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">{notif.title}</h3>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(notif.created_at), 'HH:mm')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                          {format(new Date(notif.created_at), 'dd MMM yyyy')}
                        </p>
                        {!notif.is_read && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                <HugeiconsIcon icon={Notification01Icon} className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-medium">Vous êtes à jour !</p>
            </div>
          )}

          <div className="py-6 flex justify-center">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground">Tout marquer comme lu</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
