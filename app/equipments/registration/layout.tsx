import { ScrollArea } from '@/components/ui/scroll-area';

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ScrollArea className="h-[100dvh] w-full overflow-x-hidden">
        {children}
      </ScrollArea>
    </div>
  )
}