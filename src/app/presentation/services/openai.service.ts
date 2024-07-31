import { Injectable } from '@angular/core';
import { orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateTextStreamUseCase } from '@use-cases/index';
import { OrthographyResponse } from '@interfaces/orthography.response';
import { ProsConsResponse } from '@interfaces/pros-cons.response';
import { Observable, from } from 'rxjs';
import { TextToAudioResponse } from '@interfaces/text-to-audio.response';


@Injectable({providedIn: 'root'})
export class OpenAiService {
    
    public orthographyCheck(prompt: string): Observable<OrthographyResponse> {
        return from( orthographyUseCase(prompt) );
    };

    public prosConsDiscusser(prompt: string): Observable<ProsConsResponse> {
        return from( prosConsUseCase(prompt) );
    };

    public prosConsDiscusserStream(prompt: string, abortSignal: AbortSignal) {
        return prosConsStreamUseCase(prompt, abortSignal);
    };

    public translateText(prompt: string, lang: string, abortSignal: AbortSignal) {
        return translateTextStreamUseCase(prompt, lang, abortSignal);
    };

    public textToAudio(prompt: string, voice: string): Observable<TextToAudioResponse> {
        return from( textToAudioUseCase(prompt, voice) );
    };
}