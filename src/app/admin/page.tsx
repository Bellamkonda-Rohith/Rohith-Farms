
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { getBirds } from '@/lib/birds';
import type { Bird } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


export default function AdminDashboardPage() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [birdToDelete, setBirdToDelete] = useState<Bird | null>(null);
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();


  const fetchBirds = async () => {
    try {
      setLoading(true);
      const allBirds = await getBirds();
      setBirds(allBirds);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch birds. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until the authentication check is complete
    if (!authLoading) {
      // If the user is not an admin, redirect to login
      if (!user || !isAdmin) {
        router.push('/admin/login');
      } else {
        // If the user is an admin, fetch the birds
        fetchBirds();
      }
    }
  }, [user, authLoading, isAdmin, router]);

  const handleDeleteBird = async () => {
    if (!birdToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'birds', birdToDelete.id));
      toast({
        title: "Success",
        description: `Bird "${birdToDelete.name}" has been deleted.`,
      });
      setBirdToDelete(null);
      fetchBirds(); // Refresh the list
    } catch (error) {
      console.error("Error deleting bird: ", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete bird. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (authLoading || loading) {
     return (
       <div className="flex justify-center items-center h-screen">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
       </div>
     );
  }
  
  // This check is important to prevent rendering the dashboard for non-admins before the redirect happens.
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/edit/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Bird
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bird Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-10 text-red-600">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p>{error}</p>
            </div>
          )}
          {!error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {birds.length > 0 ? birds.map((bird) => (
                  <TableRow key={bird.id}>
                    <TableCell>
                      <Image
                        src={bird.images?.[0] || 'https://placehold.co/60x60.png'}
                        alt={bird.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{bird.name}</TableCell>
                    <TableCell>{bird.line}</TableCell>
                    <TableCell>
                      <Badge variant={bird.availability === 'Available' ? 'default' : 'destructive'}>
                        {bird.availability}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bird.isFeatured && <Badge variant="secondary">Yes</Badge>}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/edit/${bird.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setBirdToDelete(bird)} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No birds found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!birdToDelete} onOpenChange={(open) => !open && setBirdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bird
              <span className="font-bold"> "{birdToDelete?.name}" </span>
              and all its associated media from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBird} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Yes, delete bird
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
