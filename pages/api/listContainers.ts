import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

// Convertir exec a una promesa
const execAsync = promisify(exec);

// Generar un timestamp en formato ISO
const generateIsoTimestamp = (): string => new Date().toISOString();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ejecutar el comando `docker ps -a`
        const { stdout } = await execAsync('docker ps -a');

        // Separar las líneas de la salida
        const lines = stdout.split('\n').filter((line) => line.trim() !== '');

        // Si no hay contenedores, devolver un array vacío
        if (lines.length < 2) {
            return res.status(200).json({ containers: [] });
        }

        // Obtener los encabezados desde la primera línea
        const headers = lines[0]
            .split(/\s{2,}/)
            .map((header) => header.trim().toLowerCase().replace(/ /g, '_'));

        // Parsear cada línea de contenedores
        const containers = lines.slice(1).map((line) => {
            const values = line.split(/\s{2,}/);
            const container: Record<string, string> = {};

            headers.forEach((header, index) => {
                const value = values[index]?.trim() || '';
                if (header === 'status') {
                    // Dividir `status` y `since_time` si corresponde
                    const [status, ...sinceTimeParts] = value.split(' ');
                    container['status'] = status.toLowerCase();
                    if (sinceTimeParts.length > 0) {
                        container['since_time'] = sinceTimeParts.join(' ');
                    }
                } else {
                    container[header] = value;
                }
            });

            // Verificar y asignar nombres
            container['names'] = container['names'] || 'Unknown';
            // Verificar y asignar puertos
            container['ports'] = container['ports'] || 'null';
            // Agregar timestamp
            container['timestamp'] = generateIsoTimestamp();

            return container;
        });

        // Responder con los datos de los contenedores
        res.status(200).json({ containers });
    } catch (error: any) {
        console.error('Error listing containers:', error.message || error);
        res.status(500).json({ error: 'Error listing containers' });
    }
}
