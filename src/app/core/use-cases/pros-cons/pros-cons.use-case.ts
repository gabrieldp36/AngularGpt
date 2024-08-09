import { environment } from "environments/environment";
import type { ProsConsResponse } from "@interfaces/pros-cons.response";

export const prosConsUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(!resp.ok) throw new Error('No se ha podido realizar la comparación.');
        const data = await resp.json() as ProsConsResponse;
        return {
            ok: true,
            ...data
        };

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            role: '',
            content: 'No sea ha podido realizar la comparativa. Intente nuevamente más tarde.'
        };
    };
};