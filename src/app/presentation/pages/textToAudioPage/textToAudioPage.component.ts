import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TextMessageBoxEvent, TextMessageBoxSelectComponent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  
  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public isLoading = signal(false);
  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);

  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)

  public handleMessageWithSelect( { prompt, selectedOption }:TextMessageBoxEvent ) {
    // Actualizamos el estado del loading para indicar que se está cargando la respuesta del backend.
    this.isLoading.set(true);
    // Hacemos un update de los mensajes para agregar el texto enviado por el usuario.
    this.messages.update( (prev) => [
      // incorporamos todos lo mensajes anteriores.
      ...prev,
      // incluímos el nuevo
      {
        id: this.idMessage++,
        isGpt: false,
        text: `Convierte a audio el siguiente texto: ${prompt}`,
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    this.openAiService.textToAudio(prompt, selectedOption)
    .subscribe( ( {ok, message, audioUrl} ) => {
      if(!ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', message);
        this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: true, text: message } ] );
        this.isLoading.set(false);
      } else { 
        this.isLoading.set(false);
        this.messages.update( (prev) => [
          ...prev,
          {
            id: this.idMessage++,
            isGpt: true,
            text: '',
            audioUrl
          },
        ]);
      };
      this.cdRef.detectChanges();
      this.scrollToBottom('smooth');
    });
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

