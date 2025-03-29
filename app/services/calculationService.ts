import data from '../data/data.json';
import config from '../data/config.json';

interface CalculationInput {
    material: string;
    pipe: string;
    width: number;
    length: number;
    strength: string;
}

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

interface DataItem {
    type: string;
    name: string;
    unit: string;
    width?: number;
    price: number;
    material?: string;
}

interface ConfigItem {
    type: string;
    key: string;
    name: string;
    step?: number;
    value?: number;
}

export function calculate(input: CalculationInput): CalculationResult {
    const { material, pipe, width, length, strength } = input;
    
    const area = width * length;

    const selectedMaterial = data.find(item => item.name === material) as DataItem;
    const selectedPipe = data.find(item => item.name === pipe) as DataItem;
    const frameConfig = config.find(item => item.type === 'frame' && item.key === strength) as ConfigItem;
    const fixConfig = config.find(item => item.type === 'fix' && item.key === selectedMaterial?.material) as ConfigItem;

    if (!selectedMaterial || !selectedPipe || !frameConfig || !fixConfig) {
        throw new Error('Invalid input data');
    }

    const pipeWidth = (selectedPipe.width || 0) / 1000; // Convert mm to m
    const maxStep = frameConfig.step || 1;
    
    const numCellsWidth = Math.ceil(width / maxStep);
    const numCellsLength = Math.ceil(length / maxStep);
    
    const cellWidth = width / numCellsWidth;
    const cellLength = length / numCellsLength;

    const horizontalPipes = (numCellsWidth + 1) * length;
    const verticalPipes = (numCellsLength + 1) * width;
    const totalPipeLength = Math.ceil(horizontalPipes + verticalPipes);

    const sheetWidth = selectedMaterial.width || 1;
    const numSheets = Math.ceil(area / sheetWidth);

    const numScrews = Math.ceil(area * (fixConfig.value || 0));

    const materials = [
        {
            name: selectedMaterial.name,
            unit: selectedMaterial.unit,
            quantity: numSheets,
            price: numSheets * selectedMaterial.price
        },
        {
            name: selectedPipe.name,
            unit: selectedPipe.unit,
            quantity: totalPipeLength,
            price: totalPipeLength * selectedPipe.price
        },
        {
            name: 'Саморез',
            unit: 'шт',
            quantity: numScrews,
            price: numScrews * (data.find(item => item.type === 'fix') as DataItem)?.price || 0
        }
    ];

    const total = materials.reduce((sum, item) => sum + item.price, 0);

    return {
        area,
        cellSize: {
            length: cellLength,
            width: cellWidth
        },
        materials,
        total
    };
} 