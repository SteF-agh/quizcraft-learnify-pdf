import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReactNode } from "react";

interface DocumentTableBaseProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export const DocumentTableBase = ({ 
  headers, 
  children,
  emptyMessage = "Keine Dokumente verfügbar"
}: DocumentTableBaseProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {children}
        {!children && (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};