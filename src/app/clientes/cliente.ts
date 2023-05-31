
import { Region } from './region';
import { Factura } from '../facturas/models/factura';

export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    fecha: string;
    imagen: string;
    region: Region;

    facturas: Array<Factura> = [];
}
