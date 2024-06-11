import { Injectable } from '@angular/core';
import { orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, translateTextStreamUseCase } from '@use-cases/index';
import { OrthographyResponse } from '@interfaces/orthography.response';
import { ProsConsResponse } from '@interfaces/pros-cons.response';
import { Observable, from } from 'rxjs';


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
}