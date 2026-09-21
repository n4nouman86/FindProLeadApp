import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                variant="text"
                width={colIndex === 0 ? "55%" : "80%"}
                sx={{ fontSize: "1rem" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
