import { Injectable } from '@angular/core';
import { orthographyUseCase } from '@use-cases/index';
import { OrthographyResponse } from '@interfaces/orthography.response';
import { Observable, from } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    
    public orthographyCheck(prompt: string): Observable<OrthographyResponse> {
        return from( orthographyUseCase(prompt) );
    };
}