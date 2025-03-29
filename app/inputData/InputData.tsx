import { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Paper,
    Grid,
    FormHelperText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import data from '../data/data.json';
import config from '../data/config.json';
import { calculate } from '~/services/calculationService';
import { OutputTable } from '~/outputTable/OutputTable';

interface Size {
    min: number;
    max: number;
    step: number;
}

interface Frame {
    name: string;
    key: string;
    step: number;
}

interface InputDataProps {
    onDataChange: (data: any) => void;
}

export function InputData({ onDataChange }: InputDataProps) {
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedPipe, setSelectedPipe] = useState('');
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [strength, setStrength] = useState('');
    const [calculationResult, setCalculationResult] = useState<any>(null);
    const [errors, setErrors] = useState({
        material: '',
        pipe: '',
        width: '',
        length: '',
        strength: ''
    });

    const materials = data.filter(item => item.type === 'list');
    const pipes = data.filter(item => item.type === 'pipe');

    const widthConfig = config.find(item => item.type === 'size' && item.key === 'width') as Size;
    const lengthConfig = config.find(item => item.type === 'size' && item.key === 'length') as Size;
    const frameConfig = config.filter(item => item.type === 'frame') as Frame[];

    const validateInputs = () => {
        const newErrors = {
            material: '',
            pipe: '',
            width: '',
            length: '',
            strength: ''
        };

        if (!selectedMaterial) {
            newErrors.material = 'Выберите материал покрытия';
        }

        if (!selectedPipe) {
            newErrors.pipe = 'Выберите тип трубы';
        }

        if (!width) {
            newErrors.width = 'Введите ширину';
        } else {
            const widthNum = Number(width);
            if (isNaN(widthNum) || widthNum < widthConfig.min || widthNum > widthConfig.max) {
                newErrors.width = `Ширина должна быть от ${widthConfig.min} до ${widthConfig.max} м`;
            }
        }

        if (!length) {
            newErrors.length = 'Введите длину';
        } else {
            const lengthNum = Number(length);
            if (isNaN(lengthNum) || lengthNum < lengthConfig.min || lengthNum > lengthConfig.max) {
                newErrors.length = `Длина должна быть от ${lengthConfig.min} до ${lengthConfig.max} м`;
            }
        }

        if (!strength) {
            newErrors.strength = 'Выберите прочность';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    useEffect(() => {
        if (validateInputs()) {
            try {
                const result = calculate({
                    material: selectedMaterial,
                    pipe: selectedPipe,
                    width: Number(width),
                    length: Number(length),
                    strength
                });
                setCalculationResult(result);
                onDataChange(result);
            } catch (error) {
                console.error('Calculation error:', error);
            }
        } else {
            setCalculationResult(null);
        }
    }, [selectedMaterial, selectedPipe, width, length, strength, onDataChange]);

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Вводные данные
                </Typography>
            
                <Grid container spacing={3}>
                    {/* Material Selection */}
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.material}>
                            <InputLabel>Материал покрытия</InputLabel>
                            <Select
                                value={selectedMaterial}
                                label="Материал покрытия"
                                onChange={(e: SelectChangeEvent) => setSelectedMaterial(e.target.value)}
                            >
                                {materials.map((material) => (
                                    <MenuItem key={material.name} value={material.name}>
                                        {material.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.material && (
                                <FormHelperText>{errors.material}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.pipe}>
                            <InputLabel>Тип трубы</InputLabel>
                            <Select
                                value={selectedPipe}
                                label="Тип трубы"
                                onChange={(e: SelectChangeEvent) => setSelectedPipe(e.target.value)}
                            >
                                {pipes.map((pipe) => (
                                    <MenuItem key={pipe.name} value={pipe.name}>
                                        {pipe.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.pipe && (
                                <FormHelperText>{errors.pipe}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ширина (м)"
                            type="number"
                            value={width}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)}
                            error={!!errors.width}
                            helperText={errors.width}
                            inputProps={{
                                min: widthConfig.min,
                                max: widthConfig.max,
                                step: widthConfig.step
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Длина (м)"
                            type="number"
                            value={length}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLength(e.target.value)}
                            error={!!errors.length}
                            helperText={errors.length}
                            inputProps={{
                                min: lengthConfig.min,
                                max: lengthConfig.max,
                                step: lengthConfig.step
                            }}
                        />
                    </Grid>

                    {/* Strength Selection */}
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.strength}>
                            <InputLabel>Прочность</InputLabel>
                            <Select
                                value={strength}
                                label="Прочность"
                                onChange={(e: SelectChangeEvent) => setStrength(e.target.value)}
                            >
                                {frameConfig.map((frame) => (
                                    <MenuItem key={frame.key} value={frame.key}>
                                        {frame.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.strength && (
                                <FormHelperText>{errors.strength}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {calculationResult && (
                <OutputTable result={calculationResult} />
            )}
        </>
    );
}


