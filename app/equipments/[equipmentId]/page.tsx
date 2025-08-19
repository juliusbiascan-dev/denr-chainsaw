import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  IdCard,
  Zap,
  Fuel,
  Ruler,
  Settings,
  AlertTriangle
} from "lucide-react";
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
        <Card className="w-full max-w-md border-primary/20 bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Equipment Not Found</h2>
            <p className="text-muted-foreground text-center text-sm">The equipment you're looking for doesn't exist or has been removed.</p>
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

  const getStatusBadge = () => {
    if (isExpired) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="secondary" className="gap-1 text-orange-600 bg-orange-50 border-orange-200"><AlertTriangle className="w-3 h-3" />Expiring Soon</Badge>;
    } else {
      return <Badge variant="default" className="gap-1 bg-green-50 text-green-700 border-green-200">Active</Badge>;
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 w-full transition-colors">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 bg-card rounded-xl shadow-sm border">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="DENR Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl shadow-md"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">DENR</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">Equipment Details</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Complete information about this equipment</p>
            </div>
            <div className="ml-auto">
              {getStatusBadge()}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Equipment Details Card */}
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        {data.brand} {data.model}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Serial No: <span className="font-mono font-medium">{data.serialNumber}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">Registration Status</span>
                      <div className="flex items-center gap-2">
                        {getStatusBadge()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Ruler className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Guide Bar Length</p>
                        <p className="font-semibold">{data.guidBarLength}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Horse Power</p>
                        <p className="font-semibold">{data.horsePower} HP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Fuel className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                        <p className="font-semibold">{data.fuelType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Intended Use</p>
                        <p className="font-semibold">{data.intendedUse.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Additional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Stencil of Serial No</label>
                        <p className="font-medium">{data.stencilOfSerialNo}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Date Acquired</label>
                        <p className="font-medium">{new Date(data.dateAcquired).toLocaleDateString()}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-muted-foreground">Other Information</label>
                        <p className="font-medium break-words whitespace-pre-wrap">{data.otherInfo}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Equipment Type</label>
                        <p className="font-medium">{data.isNew ? "New Equipment" : "Renewal Registration"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Validity Information */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">Validity Information</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valid Until:</span>
                        <span className="ml-2 font-medium">{validUntil.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2 font-medium">
                          {isExpired
                            ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                            : `${daysUntilExpiry} days remaining`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Owner Information */}
            <div className="space-y-6">
              {/* Owner Details Card */}
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-semibold text-lg">
                      {data.ownerFirstName} {data.ownerMiddleName} {data.ownerLastName}
                    </p>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </h4>
                    <p className="text-sm bg-muted/30 p-3 rounded-lg">{data.ownerAddress}</p>
                  </div>

                  {data.ownerContactNumber && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Number
                      </label>
                      <p className="font-medium">{data.ownerContactNumber}</p>
                    </div>
                  )}

                  {data.ownerEmail && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <p className="font-medium">{data.ownerEmail}</p>
                    </div>
                  )}

                  {data.ownerPreferContactMethod && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Preferred Contact Method</label>
                      <p className="font-medium">{data.ownerPreferContactMethod}</p>
                    </div>
                  )}

                  {data.ownerIdUrl && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <IdCard className="w-4 h-4" />
                        ID Document
                      </label>
                      <a
                        href={data.ownerIdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View ID Document
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Record Information Card */}
              <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Record Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Date Registered</label>
                    <p className="font-medium text-sm">
                      {new Date(data.createdAt).toLocaleDateString()} at {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Last Updated</label>
                    <p className="font-medium text-sm">
                      {new Date(data.updatedAt).toLocaleDateString()} at {new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
