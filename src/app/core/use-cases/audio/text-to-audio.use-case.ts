import { TextToAudioResponse } from "@interfaces/text-to-audio.response";
import { environment } from "environments/environment";

export const textToAudioUseCase = async (prompt: string, voice: string): Promise<TextToAudioResponse> => {
    try {
        const resp = await fetch(`${environment.backendApi}/text-to-audio`, {
            method: 'POST',
            body: JSON.stringify({prompt, voice}),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(!resp.ok) throw new Error('No se ha podido realizar la conversión');

        const audioFile = await resp.blob() // Obtenemos el archivo binario que nos envía el backend.
        const audioUrl = URL.createObjectURL(audioFile);

        return {
            ok: true,
            message: prompt,
            audioUrl,
        };

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'No sea ha podido realizar la conversión. Intene nuevamente más tarde.',
            audioUrl: '',
        };
    };
};