import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent { 

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

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
    // Realizamos la consulta al backend para obtener la corrección ortográfica de la IA.
    this.openAiService.prosConsDiscusser(prompt)
    .subscribe( resp => {
      this.isLoading.set(false);
      this.messages.update( (prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.content,
        },
      ]);
    });
  };
}

