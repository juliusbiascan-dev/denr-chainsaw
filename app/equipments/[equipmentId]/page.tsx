import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Tag, FileText } from "lucide-react";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: 'Equipment Details',
  description: 'View detailed equipment information'
};

type PageProps = { params: Promise<{ equipmentId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const data = await db.equipment.findUnique({
    where: { id: params.equipmentId }
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-primary bg-card dark:bg-card-foreground">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Equipment Not Found</h2>
            <p className="text-muted-foreground text-center">The equipment you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate validity: 2 years from dateAcquired
  const validUntil = new Date(data.dateAcquired);
  validUntil.setFullYear(validUntil.getFullYear() + 2);
  const isExpired = validUntil < new Date();
  const daysUntilExpiry = Math.ceil((validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <PageContainer scrollable={true}>
      <div className="min-h-screen bg-background p-4 w-full transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Header with DENR Logo */}
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/logo.jpg"
              alt="DENR Logo"
              className="w-16 h-16 object-contain rounded-xl shadow"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">Equipment Details</h1>
              <p className="text-muted-foreground">Complete information about this equipment</p>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Info Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-primary">{data.brand} {data.model}</CardTitle>
                <CardDescription>Serial No: {data.serialNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <div className="flex-1">
                    <span className="font-medium text-muted-foreground">Guide Bar Length:</span>
                    <span className="ml-2">{data.guidBarLength}"</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-muted-foreground">Horse Power:</span>
                    <span className="ml-2">{data.horsePower} HP</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <div className="flex-1">
                    <span className="font-medium text-muted-foreground">Fuel Type:</span>
                    <span className="ml-2">{data.fuelType}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-muted-foreground">Intended Use:</span>
                    <span className="ml-2">{data.intendedUse}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Stencil of Serial No:</span>
                  <span className="ml-2">{data.stencilOfSerialNo}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Other Info:</span>
                  <span className="ml-2">{data.otherInfo}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Date Acquired:</span>
                  <span className="ml-2">{new Date(data.dateAcquired).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Is New:</span>
                  <span className="ml-2">{data.isNew ? "Yes" : "No"}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Badge variant={isExpired ? "destructive" : "default"}>
                    {isExpired ? "Expired" : daysUntilExpiry <= 30 ? "Expiring Soon" : "Active"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {isExpired
                      ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                      : daysUntilExpiry <= 30
                        ? `${daysUntilExpiry} days left`
                        : `${daysUntilExpiry} days left`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-xs">Valid Until: {validUntil.toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
            {/* Record Info Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Record Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium text-muted-foreground">Date Registered:</span>
                  <span className="ml-2">{new Date(data.createdAt).toLocaleDateString()} {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Last Updated:</span>
                  <span className="ml-2">{new Date(data.updatedAt).toLocaleDateString()} {new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
