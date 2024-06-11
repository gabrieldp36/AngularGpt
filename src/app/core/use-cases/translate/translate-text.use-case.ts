import { environment } from "environments/environment";

export async function* translateTextStreamUseCase (prompt: string, lang: string, abortSignal: AbortSignal) {
    try {
        const resp = await fetch(`${environment.backendApi}/translate`, {
            method: 'POST',
            body: JSON.stringify( {prompt, lang} ),
            headers: { 'Content-Type': 'application/json' },
            signal: abortSignal
        });
        if(!resp.ok) throw new Error('No se ha podido realizar la traducción.');
    
        // Con el objeto reader vamos a ir leyendo como se va creando la respuesta.
        const reader = resp.body?.getReader();
        if(!reader) throw new Error('No se pudo generar el reader');

        // Decodificamos el contendido de la respuesta.
        const decoder = new TextDecoder();
        // En la variable text vamos a ir concatenando cada una de las piezas que leemos de la respuesta.
        let text = '';

        while(true){
            // Lectura de la respuesta.
            const { value, done } = await reader.read();
            if (done) break;
            // Decodificación a string;
            const decodedChunk = decoder.decode(value, {stream: true});
            // Concatenamos el string que decodificamos en la lectura.
            text += decodedChunk;
            // Emitimos la pieza que vamos leyendo de la respuesta.
            yield text;
        }

        return text; // Aquí emitimos cómo valor final el texto completo para finalizar la generación.

    } catch (error) {
        if ( !(error instanceof DOMException) ) { console.error(error) };
        return null;
    };
};