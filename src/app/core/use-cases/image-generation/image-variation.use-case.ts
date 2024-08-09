import { environment } from "environments/environment";

export const imageVariationUseCase = async (originalImage: string) => {
    
    try {
        
        const resp = await fetch(`${environment.backendApi}/image-variation`, {
            method: 'POST',
            body: JSON.stringify({baseImage: originalImage}),
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
        }

    } catch (error) {
        
        console.error(error);
        return {
            ok: false,
            url: '',
            alt: '',
            message: 'No sea ha podido editar la imagen. Intente nuevamente más tarde.',
        };
    };
};