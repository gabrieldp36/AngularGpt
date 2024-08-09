import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TextMessageBoxComponent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {
  
  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public isLoading = signal(false);
  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)

  public handleMessage( prompt: string ) {
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
        text: `Genera una imagen basada en el siguiente texto: ${prompt}`,
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    this.openAiService.imageGeneration( prompt )
    .subscribe( ( { ok, message, url, alt } ) => {
      if(!ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', message!);
        this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: true, text: message! } ] );
        this.isLoading.set(false);
      } else { 
        this.isLoading.set(false);
        this.messages.update( (prev) => [
          ...prev,
          {
            id: this.idMessage++,
            isGpt: true,
            text: '',
            imageInfo: {
              url,
              alt,
            },
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

