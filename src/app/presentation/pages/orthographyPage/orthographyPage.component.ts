import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TextMessageBoxEvent, TextMessageBoxSelectComponent, TextMessageEvent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  public messages = signal<Message[]>([{text: 'Este es un mensaje de prueba', isGpt: false}, {text: 'Mensaje correctamente redactado', isGpt: true} ]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    console.log(prompt, file);
  };

  public handleMessageWithSelect(event:TextMessageBoxEvent ): void {
    console.log(event);
  };
}

