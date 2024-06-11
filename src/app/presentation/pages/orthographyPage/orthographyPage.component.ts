import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, ChangeDetectorRef } from '@angular/core';
import { GptMessageComponent, GptMessageOrthographyComponent, MyMessageComponent, TextMessageBoxComponent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public cdRef = inject(ChangeDetectorRef)

  public handleMessage(prompt: string): void {
    // Actualizamos el estado del loading para indicar que se está cargando la respuesta del backend.
    this.isLoading.set(true);
    // Hacemos un update de los mensajes para agregar el texto enviado por el usuario.
    this.messages.update( (prev) => [
      // incorporamos todos lo mensajes anteriores.
      ...prev,
      // incluímos el nuevo
      {
        isGpt: false,
        text: prompt
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom();
    // Realizamos la consulta al backend para obtener la corrección ortográfica de la IA.
    this.openAiService.orthographyCheck(prompt)
    .subscribe( resp => {
      this.isLoading.set(false);
      this.messages.update( (prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.message,
          info: resp
        },
      ]);
      this.cdRef.detectChanges();
      this.scrollToBottom();
    });
  };

  public scrollToBottom(): void {
    if(this.divMensajes) {
      console.log('hola')
      this.divMensajes.nativeElement.scroll({
        top: this.divMensajes.nativeElement.scrollHeight, 
        behavior:'smooth'
      });
    };
  };
}

