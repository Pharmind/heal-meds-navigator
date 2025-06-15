
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FormulaResult } from '../utils/creatinineUtils';

interface CreatinineResultsProps {
  results: FormulaResult[];
}

const CreatinineResults = ({ results }: CreatinineResultsProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fórmula</TableHead>
          <TableHead>Clearance</TableHead>
          <TableHead>Categoria</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{result.name}</TableCell>
            <TableCell>
              {result.applicable ? (
                <span className="text-lg font-semibold text-green-600">
                  {result.clearance} <span className="text-sm font-normal">mL/min/1,73m²</span>
                </span>
              ) : (
                <span className="text-sm text-gray-500">{result.reason}</span>
              )}
            </TableCell>
            <TableCell>
              {result.applicable && (
                <Badge className={result.color}>
                  {result.category}
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CreatinineResults;
