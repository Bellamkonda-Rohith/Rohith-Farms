
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { Bird } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UploadCloud, X, Copy } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

const birdSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  id: z.string().optional(),
  age: z.string().min(1, 'Age is required'),
  weight: z.string().min(1, 'Weight is required'),
  color: z.string().min(2, 'Color is required'),
  line: z.string().min(2, 'Line is required'),
  price: z.coerce.number().min(0).optional(),
  availability: z.enum(['Available', 'Sold']),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  parents: z.object({
    father: z.object({
      images: z.array(z.string()).optional(),
      videos: z.array(z.string()).optional(),
    }),
    mother: z.object({
      images: z.array(z.string()).optional(),
      videos: z.array(z.string()).optional(),
    }),
  }),
});

type BirdFormData = z.infer<typeof birdSchema>;

type UploadableField = keyof Pick<BirdFormData, 'images' | 'videos'> | 'parents.father.images' | 'parents.father.videos' | 'parents.mother.images' | 'parents.mother.videos';

export default function EditBirdPage() {
  const router = useRouter();
  const params = useParams();
  const birdId = params.id as string;
  const isNew = birdId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [uploads, setUploads] = useState<Record<string, number>>({});

  const form = useForm<BirdFormData>({
    resolver: zodResolver(birdSchema),
    defaultValues: {
      name: '',
      age: '',
      weight: '',
      color: '',
      line: '',
      price: 0,
      availability: 'Available',
      isFeatured: false,
      images: [],
      videos: [],
      parents: {
        father: { images: [], videos: [] },
        mother: { images: [], videos: [] },
      },
    },
  });

  useEffect(() => {
    if (!isNew) {
      const fetchBird = async () => {
        try {
          const docRef = doc(db, 'birds', birdId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const birdData = docSnap.data() as Bird;
            form.reset({
              ...birdData,
              price: birdData.price || 0,
              images: birdData.images || [],
              videos: birdData.videos || [],
              parents: birdData.parents || { father: { images: [], videos: [] }, mother: { images: [], videos: [] } },
            });
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Bird not found.' });
            router.push('/admin');
          }
        } catch (error) {
          console.error('Error fetching bird:', error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch bird data.' });
        } finally {
          setLoading(false);
        }
      };
      fetchBird();
    }
  }, [birdId, isNew, form, router, toast]);

  const handleFileUpload = (file: File, field: UploadableField) => {
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `birds/${birdId}/${field}/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploads(prev => ({ ...prev, [uniqueFileName]: progress }));
      },
      (error) => {
        console.error("Upload failed: ", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: file.name });
        setUploads(prev => {
          const newUploads = { ...prev };
          delete newUploads[uniqueFileName];
          return newUploads;
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (field.includes('.')) {
              const [parent, child, type] = field.split('.') as ['parents', 'father' | 'mother', 'images' | 'videos'];
              const currentParentMedia = form.getValues(`${parent}.${child}.${type}`) || [];
              form.setValue(`${parent}.${child}.${type}`, [...currentParentMedia, downloadURL]);
          } else {
              const currentMedia = form.getValues(field as 'images' | 'videos') || [];
              form.setValue(field as 'images' | 'videos', [...currentMedia, downloadURL]);
          }
           setUploads(prev => {
              const newUploads = { ...prev };
              delete newUploads[uniqueFileName];
              return newUploads;
            });
          toast({ title: 'Upload Complete', description: file.name });
        });
      }
    );
  };
  
  const handleRemoveMedia = (url: string, field: UploadableField) => {
    const storageRef = ref(storage, url);
    deleteObject(storageRef).catch(err => console.error("Could not delete file from storage", err));
    
    if (field.includes('.')) {
        const [parent, child, type] = field.split('.') as ['parents', 'father' | 'mother', 'images' | 'videos'];
        const currentParentMedia = form.getValues(`${parent}.${child}.${type}`) || [];
        form.setValue(`${parent}.${child}.${type}`, currentParentMedia.filter(u => u !== url));
    } else {
        const currentMedia = form.getValues(field as 'images' | 'videos') || [];
        form.setValue(field as 'images' | 'videos', currentMedia.filter(u => u !== url));
    }
  };


  const onSubmit = async (data: BirdFormData) => {
    setSaving(true);
    try {
      let finalId = birdId;
      if (isNew) {
        const newDocRef = await addDoc(collection(db, 'birds'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Success', description: 'New bird has been added.' });
        finalId = newDocRef.id;
        router.push(`/admin/edit/${finalId}`); // Redirect to edit page of the new bird
      } else {
        await setDoc(doc(db, 'birds', birdId), data, { merge: true });
        toast({ title: 'Success', description: 'Bird details have been updated.' });
      }
      // Consider if navigation is always desired after save, or only on new creation
      router.push('/admin');
    } catch (error) {
      console.error('Error saving bird:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save bird details.' });
    } finally {
      setSaving(false);
    }
  };
  
    const FileUploader = ({ field, fieldName }: { field: UploadableField; fieldName: string }) => {
        const files = (field.includes('.') 
            ? form.watch(`parents.${(field.split('.')[1] as 'father' | 'mother')}.${(field.split('.')[2] as 'images' | 'videos')}`)
            : form.watch(field as 'images' | 'videos')) || [];
        
        const isImage = field.includes('images');

        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            toast({ title: "Copied!", description: "Firebase URL copied to clipboard." });
        };

        return (
            <FormItem>
              <FormLabel>{fieldName}</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    accept={isImage ? "image/*" : "video/*"}
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => handleFileUpload(file, field));
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    disabled={isNew}
                  />
                  {isNew && <FormDescription>You must save the bird before you can upload media.</FormDescription>}
                   <FormDescription className="mt-2">
                    Upload {isImage ? 'images' : 'videos'}. Live Firebase Storage links will appear below each item after upload.
                  </FormDescription>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((url, index) => (
                      <div key={index} className="relative group space-y-2">
                        <div className="relative">
                            {isImage ? (
                              <Image src={url} alt={`${fieldName} ${index + 1}`} width={150} height={150} className="rounded-md object-cover w-full aspect-square" />
                            ) : (
                              <video src={url} controls className="rounded-md w-full aspect-square" />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveMedia(url, field)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-1">
                           <Input 
                            readOnly 
                            value={url} 
                            className="text-xs h-8 truncate bg-muted"
                           />
                           <Button 
                             type="button" 
                             size="icon" 
                             variant="ghost" 
                             className="h-8 w-8 flex-shrink-0"
                             onClick={() => copyToClipboard(url)}
                           >
                             <Copy className="h-4 w-4"/>
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
        );
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{isNew ? 'Add New Bird' : 'Edit Bird'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="line" control={form.control} render={({ field }) => (<FormItem><FormLabel>Line</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="age" control={form.control} render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="weight" control={form.control} render={({ field }) => (<FormItem><FormLabel>Weight</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="color" control={form.control} render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="price" control={form.control} render={({ field }) => (<FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="availability" control={form.control} render={({ field }) => (<FormItem><FormLabel>Availability</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select availability" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="Sold">Sold</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField name="isFeatured" control={form.control} render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Feature on homepage</FormLabel></div></FormItem>)} />
            </CardContent>
          </Card>

          <Card>
             <CardHeader><CardTitle>Bird Media</CardTitle></CardHeader>
             <CardContent className="space-y-6">
                <FileUploader field="images" fieldName="Bird Images" />
                <FileUploader field="videos" fieldName="Bird Videos" />
             </CardContent>
          </Card>

           <Card>
             <CardHeader><CardTitle>Father (Sire) Media</CardTitle></CardHeader>
             <CardContent className="space-y-6">
                <FileUploader field="parents.father.images" fieldName="Father's Images" />
                <FileUploader field="parents.father.videos" fieldName="Father's Videos" />
             </CardContent>
          </Card>

           <Card>
             <CardHeader><CardTitle>Mother (Dam) Media</CardTitle></CardHeader>
             <CardContent className="space-y-6">
                <FileUploader field="parents.mother.images" fieldName="Mother's Images" />
                <FileUploader field="parents.mother.videos" fieldName="Mother's Videos" />
             </CardContent>
          </Card>
          
          {Object.keys(uploads).length > 0 && (
             <Card>
                 <CardHeader><CardTitle>Uploads in Progress</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                     {Object.entries(uploads).map(([fileName, progress]) => (
                         <div key={fileName}>
                             <p className="text-sm font-medium truncate">{fileName}</p>
                             <Progress value={progress} className="w-full" />
                         </div>
                     ))}
                 </CardContent>
             </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={saving || Object.keys(uploads).length > 0}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isNew ? 'Add Bird' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
