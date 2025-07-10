
import { AdminUser } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdminListProps = {
  admins: AdminUser[];
};

export function AdminList({ admins }: AdminListProps) {
  if (admins.length === 0) {
    return <p className="text-muted-foreground text-center">No admins found. Add the first admin using their phone number.</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID (UID)</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.uid}>
              <TableCell className="font-mono">{admin.uid}</TableCell>
              <TableCell>{admin.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
