'use client';

import { Equipment } from '@/constants/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Mail, Calendar, FileText } from 'lucide-react';

interface ExpandableOwnerInfoProps {
  equipment: Equipment;
}

export function ExpandableOwnerInfo({ equipment }: ExpandableOwnerInfoProps) {
  return (
    <Card className="w-full border-l-4 border-l-primary/20 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
          <User className="w-4 h-4" />
          Owner Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Owner Name */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium">Full Name</label>
          <p className="text-sm font-medium">
            {equipment.ownerFirstName} {equipment.ownerMiddleName} {equipment.ownerLastName}
          </p>
        </div>

        <Separator />

        {/* Address */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Address
          </label>
          <p className="text-sm bg-background p-2 rounded-md border">
            {equipment.ownerAddress}
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.ownerContactNumber && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Contact Number
              </label>
              <p className="text-sm font-medium">{equipment.ownerContactNumber}</p>
            </div>
          )}

          {equipment.ownerEmail && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <p className="text-sm font-medium">{equipment.ownerEmail}</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.ownerPreferContactMethod && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Preferred Contact Method</label>
              <Badge variant="outline" className="text-xs">
                {equipment.ownerPreferContactMethod}
              </Badge>
            </div>
          )}

          {equipment.ownerIdUrl && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <FileText className="w-3 h-3" />
                ID Document
              </label>
              <a
                href={equipment.ownerIdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View ID Document
              </a>
            </div>
          )}
        </div>

        {/* Registration Details */}
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Registration Type
            </label>
            <Badge variant={equipment.isNew ? "default" : "secondary"} className="text-xs">
              {equipment.isNew ? "New Registration" : "Renewal"}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Equipment Status</label>
            <Badge variant={equipment.status === 'active' ? 'default' : 'destructive'} className="text-xs">
              {equipment.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
