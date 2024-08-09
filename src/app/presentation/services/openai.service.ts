import { Injectable } from '@angular/core';
import { delay, from } from 'rxjs';
import { orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateTextStreamUseCase, audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase } from '@use-cases/index';
import { HttpClient } from '@angular/common/http';

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
}