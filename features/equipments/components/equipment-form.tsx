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
import { UploadButton } from '@/lib/uploadthing';
import { toast } from 'sonner';

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
  const [ownerIdUrl, setOwnerIdUrl] = useState<string>(initialData?.ownerIdUrl || '');

  const isEditing = !!initialData;

  const defaultValues = {
    // Owner Information
    ownerFirstName: initialData?.ownerFirstName || '',
    ownerLastName: initialData?.ownerLastName || '',
    ownerMiddleName: initialData?.ownerMiddleName || '',
    ownerAddress: initialData?.ownerAddress || '',
    ownerContactNumber: initialData?.ownerContactNumber || '',
    ownerEmail: initialData?.ownerEmail || '',
    ownerPreferContactMethod: initialData?.ownerPreferContactMethod || '',
    ownerIdUrl: initialData?.ownerIdUrl || '',

    // Equipment Information
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    serialNumber: initialData?.serialNumber || '',
    guidBarLength: initialData?.guidBarLength || 0,
    horsePower: initialData?.horsePower || 0,
    fuelType: initialData?.fuelType || 'GAS',
    dateAcquired: initialData?.dateAcquired || new Date(),
    stencilOfSerialNo: initialData?.stencilOfSerialNo || '',
    otherInfo: initialData?.otherInfo || '',
    intendedUse: initialData?.intendedUse || 'WOOD_PROCESSING',
    isNew: initialData?.isNew ?? true
  };

  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues
  });



  function onSubmit(values: z.infer<typeof EquipmentSchema>) {
    setError('');
    setSuccess('');

    // Include the uploaded file URL in the form data
    const formData = {
      ...values,
      ownerIdUrl: ownerIdUrl
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
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='ownerFirstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter first name' {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter last name' {...field} />
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
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter middle name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ownerContactNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
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
                      <FormLabel>Email Address</FormLabel>
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
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select preferred contact method' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PHONE">Phone</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
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
                    <FormLabel>Address</FormLabel>
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
                      <UploadButton
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
                        onUploadBegin={(fileName: string) => {
                          console.log("Upload beginning:", fileName);
                        }}
                      />
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

            {/* Equipment Information Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-foreground'>Equipment Information</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='brand'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
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
                      <FormLabel>Model</FormLabel>
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
                      <FormLabel>Serial Number</FormLabel>
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
                          onChange={e => field.onChange(parseFloat(e.target.value))}
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
                          onChange={e => field.onChange(parseFloat(e.target.value))}
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
                      <FormLabel>Fuel Type</FormLabel>
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
                      <FormLabel>Date Acquired</FormLabel>
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
                      <FormLabel>Stencil of Serial Number</FormLabel>
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
                      <FormLabel>Intended Use</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select intended use' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WOOD_PROCESSING">Wood Processing</SelectItem>
                          <SelectItem value="TREE_CUTTING">Tree Cutting</SelectItem>
                          <SelectItem value="LEGAL_PURPOSES">Legal Purposes</SelectItem>
                          <SelectItem value="OFFICIAL_TREE_CUTTING">Official Tree Cutting</SelectItem>
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
                    <FormLabel>Other Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter other information (Description, Color , etc.)'
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
                      <FormLabel>Registration Type</FormLabel>
                      <FormDescription>
                        Is this a new chainsaw registration?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
