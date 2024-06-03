import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageEvent, TextMessageBoxEvent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-chat-template',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTemplateComponent { 

  public messages = signal<Message[]>([{text: 'Este es un mensaje de prueba', isGpt: false}, {text: 'Mensaje correctamente redactado', isGpt: true} ]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public handleMessage(prompt: string): void {
    console.log(prompt);
  };

  public handleMessageWithFile({ prompt, file }: TextMessageEvent): void {
    console.log(prompt, file);
  };

  public handleMessageWithSelect(event:TextMessageBoxEvent ): void {
    console.log(event);
  };
}

