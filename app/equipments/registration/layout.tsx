import { ScrollArea } from '@/components/ui/scroll-area';

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ScrollArea className="h-screen">
        {children}
      </ScrollArea>
    </div>
  )
}