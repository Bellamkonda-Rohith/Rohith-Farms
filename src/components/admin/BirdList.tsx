
'use client';

import type { Bird } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Trash2, Loader2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { deleteBird } from '@/lib/admin-actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type BirdListProps = {
  birds: Bird[];
};

export function BirdList({ birds }: BirdListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (bird: Bird) => {
    setDeletingId(bird.id);
    const imagePaths = [bird.imageUrl, bird.father.imageUrl, bird.mother.imageUrl];
    const result = await deleteBird(bird.id, imagePaths);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setDeletingId(null);
  };

  if (birds.length === 0) {
    return <p className="text-muted-foreground text-center">No birds have been added yet.</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Bloodline</TableHead>
            <TableHead>Name/ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {birds.map((bird) => (
            <TableRow key={bird.id}>
              <TableCell>
                <Image
                  src={bird.imageUrl}
                  alt={bird.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover aspect-square"
                />
              </TableCell>
              <TableCell className="font-medium">{bird.bloodline}</TableCell>
              <TableCell>{bird.name}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    bird.isAvailable ? 'bg-green-600' : 'bg-red-600',
                    'text-white'
                  )}
                >
                  {bird.isAvailable ? 'Available' : 'Sold'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/edit/${bird.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" disabled={deletingId === bird.id}>
                        {deletingId === bird.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the bird
                          and all associated images from the servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(bird)}>
                          Yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
