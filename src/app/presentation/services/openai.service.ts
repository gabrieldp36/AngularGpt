import { Injectable } from '@angular/core';
import { delay, from, Observable, of, tap } from 'rxjs';
import { orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateTextStreamUseCase, audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, createThreadUseCase, postQuestionUseCase } from '@use-cases/index';
import { HttpClient } from '@angular/common/http';
import { ThreadResponse } from '@interfaces/thread.response';

@Injectable({providedIn: 'root'})
export class OpenAiService {

    public constructor (
        private http: HttpClient,
    ) {};

    public orthographyCheck(prompt: string) {
        return from( orthographyUseCase(prompt) );
    };

    public prosConsDiscusser(prompt: string) {
        return from( prosConsUseCase(prompt) );
    };

    public prosConsDiscusserStream(prompt: string, abortSignal: AbortSignal) {
        return prosConsStreamUseCase(prompt, abortSignal);
    };

    public translateText(prompt: string, lang: string, abortSignal: AbortSignal) {
        return translateTextStreamUseCase(prompt, lang, abortSignal);
    };

    public textToAudio(prompt: string, voice: string) {
        return from(textToAudioUseCase(prompt, voice));
    };

    public audioToText(file: File, prompt?: string) {
        return from(audioToTextUseCase(file, prompt));
    };

    public imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
        return from(imageGenerationUseCase(prompt, originalImage, maskImage));
    };

    public imageVariation(originalImage: string) {
        return from(imageVariationUseCase(originalImage));
    };

    public downloadImg(url: string) {
       return this.http.get( url, {responseType: 'blob'} ).pipe(delay(500));
    };

    public createThread(): Observable<ThreadResponse> {

        // Si tenemos un thread abierto, seguimos el hilo conversacional.
        if( localStorage.getItem('thread') ) {
            return of( {
                ok: true,
                id: localStorage.getItem('thread')!
            });
        };

        // Si no tenemos un thread, creamos uno y almacenamos su id en el localstorage.
        return from( createThreadUseCase() )
        .pipe(
            tap( resp => {
                if(resp.ok) {
                    localStorage.setItem('thread', resp.id);
                };
            }),
        );
    };

    public postQuestion( threadId: string, question: string ) {
        return from( postQuestionUseCase(threadId, question) );
    };
}