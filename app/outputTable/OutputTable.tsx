import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface CalculationResult {
    area: number;
    cellSize: {
        length: number;
        width: number;
    };
    materials: {
        name: string;
        unit: string;
        quantity: number;
        price: number;
    }[];
    total: number;
}

interface OutputTableProps {
    result: CalculationResult;
}

export function OutputTable({ result }: OutputTableProps) {
    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Результаты расчета
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography>
                    Площадь изделия: {result.area.toFixed(2)} м²
                </Typography>
                <Typography>
                    Размер ячейки: {result.cellSize.length.toFixed(2)}×{result.cellSize.width.toFixed(2)} м
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Наименование</TableCell>
                            <TableCell align="right">ед.</TableCell>
                            <TableCell align="right">кол-во</TableCell>
                            <TableCell align="right">сумма</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.materials.map((material) => (
                            <TableRow key={material.name}>
                                <TableCell>{material.name}</TableCell>
                                <TableCell align="right">{material.unit}</TableCell>
                                <TableCell align="right">{material.quantity}</TableCell>
                                <TableCell align="right">{material.price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3} align="right">
                                <strong>Итого:</strong>
                            </TableCell>
                            <TableCell align="right">
                                <strong>{result.total.toFixed(2)}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}


