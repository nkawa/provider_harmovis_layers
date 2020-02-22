import { MovedData } from "harmoware-vis";

export interface DataItem {id: number, color: number[], value: number, label: string}

export interface BarData extends MovedData {
    id: number|string;
    data: DataItem[];
    areaColor: number;
    radius: number;
    width: number;
    min: number;
    max: number;
    text: number;
    barType: number;
}