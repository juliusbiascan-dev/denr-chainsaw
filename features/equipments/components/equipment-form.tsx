'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createEquipmentAction, updateEquipmentAction } from '@/actions/equipment';
import { Equipment } from '@/lib/generated/prisma';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { EquipmentSchema } from '@/schemas/equipment';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '@/components/file-uploader';
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

export default function EquipmentForm({
  initialData,
  pageTitle
}: {
  initialData: Equipment | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Document URLs state
  const [ownerIdUrl, setOwnerIdUrl] = useState<string>(initialData?.ownerIdUrl || '');
  const [registrationApplicationUrl, setRegistrationApplicationUrl] = useState<string>(initialData?.registrationApplicationUrl || '');
  const [officialReceiptUrl, setOfficialReceiptUrl] = useState<string>(initialData?.officialReceiptUrl || '');
  const [spaUrl, setSpaUrl] = useState<string>(initialData?.spaUrl || '');
  const [stencilSerialNumberPictureUrl, setStencilSerialNumberPictureUrl] = useState<string>(initialData?.stencilSerialNumberPictureUrl || '');
  const [chainsawPictureUrl, setChainsawPictureUrl] = useState<string>(initialData?.chainsawPictureUrl || '');
  const [forestTenureAgreementUrl, setForestTenureAgreementUrl] = useState<string>(initialData?.forestTenureAgreementUrl || '');
  const [businessPermitUrl, setBusinessPermitUrl] = useState<string>(initialData?.businessPermitUrl || '');
  const [certificateOfRegistrationUrl, setCertificateOfRegistrationUrl] = useState<string>(initialData?.certificateOfRegistrationUrl || '');
  const [lguBusinessPermitUrl, setLguBusinessPermitUrl] = useState<string>(initialData?.lguBusinessPermitUrl || '');
  const [woodProcessingPermitUrl, setWoodProcessingPermitUrl] = useState<string>(initialData?.woodProcessingPermitUrl || '');
  const [governmentCertificationUrl, setGovernmentCertificationUrl] = useState<string>(initialData?.governmentCertificationUrl || '');

  const isEditing = !!initialData;

  const defaultValues = {
    // Owner Information
    ownerFirstName: initialData?.ownerFirstName || '',
    ownerMiddleName: initialData?.ownerMiddleName || '',
    ownerLastName: initialData?.ownerLastName || '',
    ownerAddress: initialData?.ownerAddress || '',
    ownerContactNumber: initialData?.ownerContactNumber || '',
    ownerEmail: initialData?.ownerEmail || '',
    ownerPreferContactMethod: (initialData?.ownerPreferContactMethod as 'EMAIL' | 'PHONE') || 'EMAIL',
    ownerIdUrl: initialData?.ownerIdUrl || '',

    // Chainsaw Information
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    serialNumber: initialData?.serialNumber || '',
    guidBarLength: initialData?.guidBarLength || undefined,
    horsePower: initialData?.horsePower || undefined,
    fuelType: initialData?.fuelType || 'GAS',
    dateAcquired: initialData?.dateAcquired ? new Date(initialData.dateAcquired) : new Date(),
    stencilOfSerialNo: initialData?.stencilOfSerialNo || '',
    otherInfo: initialData?.otherInfo || '',
    intendedUse: initialData?.intendedUse || 'WOOD_PROCESSING',
    isNew: initialData?.isNew ?? true,

    // Document Requirements
    registrationApplicationUrl: initialData?.registrationApplicationUrl || '',
    officialReceiptUrl: initialData?.officialReceiptUrl || '',
    spaUrl: initialData?.spaUrl || '',
    stencilSerialNumberPictureUrl: initialData?.stencilSerialNumberPictureUrl || '',
    chainsawPictureUrl: initialData?.chainsawPictureUrl || '',

    // Additional Requirements
    forestTenureAgreementUrl: initialData?.forestTenureAgreementUrl || '',
    businessPermitUrl: initialData?.businessPermitUrl || '',
    certificateOfRegistrationUrl: initialData?.certificateOfRegistrationUrl || '',
    lguBusinessPermitUrl: initialData?.lguBusinessPermitUrl || '',
    woodProcessingPermitUrl: initialData?.woodProcessingPermitUrl || '',
    governmentCertificationUrl: initialData?.governmentCertificationUrl || '',

    // Data Privacy Consent
    dataPrivacyConsent: initialData?.dataPrivacyConsent || false
  };

  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues
  });

  function onSubmit(values: z.infer<typeof EquipmentSchema>) {
    setError('');
    setSuccess('');

    // Include the uploaded file URLs in the form data
    const formData = {
      ...values,
      ownerIdUrl,
      registrationApplicationUrl,
      officialReceiptUrl,
      spaUrl,
      stencilSerialNumberPictureUrl,
      chainsawPictureUrl,
      forestTenureAgreementUrl,
      businessPermitUrl,
      certificateOfRegistrationUrl,
      lguBusinessPermitUrl,
      woodProcessingPermitUrl,
      governmentCertificationUrl
    };

    startTransition(async () => {
      try {
        let response;

        if (isEditing && initialData) {
          response = await updateEquipmentAction(initialData.id, formData);
        } else {
          response = await createEquipmentAction(formData);
        }

        if (response.success) {
          setSuccess(response.success);
          form.reset();
          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push('/dashboard/equipments');
            router.refresh();
          }, 1500);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* Owner Information Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Owner Information</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='ownerFirstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter first name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ownerMiddleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Initial *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter middle initial' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ownerLastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter last name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='ownerContactNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter contact number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ownerEmail'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='Enter email address' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ownerPreferContactMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select preferred contact method' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email thru the provided Email Address</SelectItem>
                          <SelectItem value="PHONE">Text Message thru the Provided Contact Number</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='ownerAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter complete address'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='ownerIdUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner ID Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: any) => {
                            if (res && res[0]) {
                              setOwnerIdUrl(res[0].url);
                              toast.success("ID image uploaded successfully!");
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("Upload error:", error);
                            toast.error(`Error uploading image: ${error.message}`);
                          }}
                          className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                        />
                      </div>
                    </FormControl>
                    {ownerIdUrl && (
                      <div className='mt-2'>
                        <p className='text-sm text-muted-foreground'>Uploaded ID Image:</p>
                        <img
                          src={ownerIdUrl}
                          alt="Owner ID"
                          className='mt-1 h-20 w-auto rounded border'
                        />
                      </div>
                    )}
                    <FormDescription>
                      Upload a clear image of the owner's ID (Government ID, Driver's License, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Chainsaw Information Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Chainsaw Information</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='brand'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chainsaw Brand *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter chainsaw brand' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='model'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chainsaw Model *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter chainsaw model' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='serialNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chainsaw Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter serial number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='guidBarLength'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Bar Length (inches)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder='Enter guide bar length'
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='horsePower'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horse Power</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder='Enter horse power'
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='fuelType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select fuel type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GAS">Gas</SelectItem>
                          <SelectItem value="DIESEL">Diesel</SelectItem>
                          <SelectItem value="ELECTRIC">Electric</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dateAcquired'
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Acquisition *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='stencilOfSerialNo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stencil of Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter stencil of serial number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='intendedUse'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intended Use of the Chainsaw *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select intended use' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WOOD_PROCESSING">Wood Processing</SelectItem>
                          <SelectItem value="TREE_CUTTING_PRIVATE_PLANTATION">Tree Cutting inside a Private Tree Plantation</SelectItem>
                          <SelectItem value="GOVT_LEGAL_PURPOSES">Gov't./ GOCC - for legal purposes</SelectItem>
                          <SelectItem value="OFFICIAL_TREE_CUTTING_BARANGAY">Official Tree Cutting within the Barangay</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='otherInfo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Info of the Chainsaw (Description, Color, etc.) *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter other information (Description, Color, etc.)'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isNew'
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Registration Type *</FormLabel>
                      <FormDescription>
                        New Chainsaw or renewal of registration?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="ml-2 text-sm">
                      {field.value ? 'New Chainsaw' : 'Renewal of Registration'}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Document Requirements Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Document Requirements (New Chainsaw)</h3>
              <p className='text-sm text-muted-foreground'>
                You may download a copy of chainsaw application form in{' '}
                <a href="https://bit.ly/DENR1CRF" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://bit.ly/DENR1CRF
                </a>
              </p>

              {/* Registration Application */}
              <FormField
                control={form.control}
                name='registrationApplicationUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signed Chainsaw Registration Application *</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setRegistrationApplicationUrl(res[0].url);
                            toast.success("Registration application uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Official Receipt */}
              <FormField
                control={form.control}
                name='officialReceiptUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Receipt of the Chainsaw *</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setOfficialReceiptUrl(res[0].url);
                            toast.success("Official receipt uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SPA */}
              <FormField
                control={form.control}
                name='spaUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPA (if the applicant is not the owner of the chainsaw)</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setSpaUrl(res[0].url);
                            toast.success("SPA uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stencil Serial Number Picture */}
              <FormField
                control={form.control}
                name='stencilSerialNumberPictureUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stencil Serial Number of Chainsaw (Picture) *</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setStencilSerialNumberPictureUrl(res[0].url);
                            toast.success("Stencil serial number picture uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading image: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chainsaw Picture */}
              <FormField
                control={form.control}
                name='chainsawPictureUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picture of the Chainsaw *</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setChainsawPictureUrl(res[0].url);
                            toast.success("Chainsaw picture uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading image: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Requirements Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Additional Requirements</h3>
              <p className='text-sm text-muted-foreground'>
                You may download a copy of chainsaw application form in{' '}
                <a href="https://bit.ly/DENR1CRF" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://bit.ly/DENR1CRF
                </a>
              </p>

              {/* Forest Tenure Agreement */}
              <FormField
                control={form.control}
                name='forestTenureAgreementUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forest Tenure Agreement (if Tenural Instrument Holder)</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setForestTenureAgreementUrl(res[0].url);
                            toast.success("Forest tenure agreement uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Permit */}
              <FormField
                control={form.control}
                name='businessPermitUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Permit (If Business owner)</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setBusinessPermitUrl(res[0].url);
                            toast.success("Business permit uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Certificate of Registration */}
              <FormField
                control={form.control}
                name='certificateOfRegistrationUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For Private Tree Plantation Owner - Certificate of Registration</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setCertificateOfRegistrationUrl(res[0].url);
                            toast.success("Certificate of registration uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LGU Business Permit */}
              <FormField
                control={form.control}
                name='lguBusinessPermitUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Permit from LGU or affidavit that the chainsaw is needed if applicants/profession/work and will be used for legal purpose</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setLguBusinessPermitUrl(res[0].url);
                            toast.success("LGU business permit uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Wood Processing Permit */}
              <FormField
                control={form.control}
                name='woodProcessingPermitUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For Wood Processor - Wood processing plant permit</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setWoodProcessingPermitUrl(res[0].url);
                            toast.success("Wood processing permit uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Government Certification */}
              <FormField
                control={form.control}
                name='governmentCertificationUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For government and GOCC - Certification from the Head of Office or his/her authorized representative that chainsaws are owned/possessed by the office and use for legal purposes (specify)</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                          if (res && res[0]) {
                            setGovernmentCertificationUrl(res[0].url);
                            toast.success("Government certification uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error uploading file: ${error.message}`);
                        }}
                        className="ut-label:text-sm ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1 supported file: PDF or image. Max 100 MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data Privacy Consent Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Data Privacy Act Consent</h3>
              <div className='rounded-lg border p-4 bg-muted/50'>
                <p className='text-sm text-muted-foreground mb-4'>
                  Compliance to "Data Privacy Act of 2012".
                </p>
                <p className='text-sm mb-4'>
                  In submitting this form I agree to my details being used for the purposes of
                  Chainsaw Registration. The information will only be accessed by DENR Staff. I
                  understand my data will be held securely and will not be distributed to third
                  parties.
                </p>
                <FormField
                  control={form.control}
                  name='dataPrivacyConsent'
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the Data Privacy Act consent
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Update Equipment' : 'Register Equipment'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
