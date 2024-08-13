import { environment } from "environments/environment";

export const createThreadUseCase = async () => {
    
    try {
        
        const resp = await fetch(`${environment.assistantApi}/create-thread`, {method: 'POST'});
        
        if(!resp.ok) throw new Error();
        
        const { id } = await resp.json() as { id: string };
        
        return {
            ok: true,
            id
        };

    } catch (error) {
        
        console.error(error);
        return {
            ok: false,
            id: '',
            message: 'No sea ha podido generar el thread.',
        };
    };
};