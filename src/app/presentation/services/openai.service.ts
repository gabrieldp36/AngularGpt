import { Injectable } from '@angular/core';
import { catchError, from } from 'rxjs';
import { orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateTextStreamUseCase, audioToTextUseCase } from '@use-cases/index';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    
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
}