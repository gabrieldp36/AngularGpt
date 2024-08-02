import { AudioToTextResponse } from "@interfaces/audio-to-text.response";
import { environment } from "environments/environment";

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
    try {

        const formData = new FormData();
        formData.append('file', audioFile);

        if(prompt) {
            formData.append('prompt', prompt);
        };

        const resp = await fetch(`${environment.backendApi}/audio-to-text`, {
            method: 'POST',
            body: formData,
        });

        if(!resp.ok) { 
            let msg = '';
            switch (resp.status) {
                case 413:
                    msg = 'El archivo no puede exceder los 5 MB.';
                break;
                case 400:
                    msg = 'Archivo no permitido. Solo se admiten archivos de tipo audio/*.';
                break;
                default:
                    msg = 'No se ha podido realizar la conversión.'
                 break;
            };
            throw new Error(msg);
        };

        const data = await resp.json() as AudioToTextResponse;
        return {
            ok: true,
            data
        };

    } catch (error:any) {
        return {
            ok: false,
            error: error.message
        }
    };
};