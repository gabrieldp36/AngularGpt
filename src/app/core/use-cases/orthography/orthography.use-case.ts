import type { OrthographyResponse } from "@interfaces/orthography.response";
import { environment } from "environments/environment.development";

export const orthographyUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${environment.backendApi}/orthography-check`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(!resp.ok) throw new Error('No se ha podido realizar la corrección.');
        const data = await resp.json() as OrthographyResponse;
        return {
            ok: true,
            ...data
        };

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No sea ha podido realizar la correción. Intene nuevamente más tarde.'
        };
    };
};