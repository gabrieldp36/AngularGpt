import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TextMessageBoxFileComponent, TextMessageEvent, TypingLoaderComponent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-to-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  
  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public isLoading = signal(false);
  public messages = signal<Message[]>([]);
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)

  public handleMessageWithFile( { file, prompt }: TextMessageEvent) {
    // Generamos el texto del mensaje.
    const text = `Convierte a texto el siguente audio: ${file.name}`;
    // Actualizamos el estado del loading para indicar que se está cargando la respuesta del backend.
    this.isLoading.set(true);
    // Hacemos un update de los mensajes para agregar el texto enviado por el usuario.
    this.messages.update( (prev) => [ ...prev, { isGpt: false, text } ] );
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    this.openAiService.audioToText(file, prompt)
    .subscribe( resp => { 
      if(!resp.ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', resp.error);
        this.messages.update( (prev) => [ ...prev, { isGpt: true, text: resp.error } ] );
        this.isLoading.set(false);
      } else {
        this.handleResponse(resp.data!);
        this.cdRef.detectChanges();
        setTimeout(() => { this.scrollToBottom('smooth'); }, 1);
      };
    });
  };

  public handleResponse(resp: AudioToTextResponse | null) {

    this.isLoading.set(false);
    if(!resp) return;

    const text = `## Transcripción:
__Duración:__ ${ Math.round( resp.duration ) } segundos.

__El texto es:__
${ resp.text }
    `;

    this.messages.update( prev => [...prev, { isGpt: true, text: text }] );

    for (const segment of resp.segments) {
      const segmentMessage = `
__De ${ Math.round(segment.start) } a ${ Math.round( segment.end ) } segundos.__
${ segment.text }
      `;

      this.messages.update( prev => [...prev, { isGpt: true, text: segmentMessage }] );
    }
  };

  public scrollToBottom(behavior: ScrollBehavior): void {
    if(this.divMensajes) {
      this.divMensajes.nativeElement.scroll({
        top: this.divMensajes.nativeElement.scrollHeight, 
        behavior
      });
    };
  };
}

