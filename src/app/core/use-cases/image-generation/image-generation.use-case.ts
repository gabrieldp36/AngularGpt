import { environment } from "environments/environment";

export const imageGenerationUseCase = async (prompt: string, originalImage?: string, maskImage?: string) => {
    
    try {
        
        const resp = await fetch(`${environment.backendApi}/image-generation`, {
            method: 'POST',
            body: JSON.stringify({
                prompt, 
                originalImage,
                maskImage,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if(!resp.ok) throw new Error();
        
        const { url, revised_prompt: alt } = await resp.json();
        
        return {
            ok: true,
            url,
            alt,
        };

    } catch (error) {
        
        console.error(error);
        return {
            ok: false,
            url: '',
            alt: '',
            message: 'No sea ha podido generar la imagen. Intente nuevamente más tarde.',
        };
    };
};