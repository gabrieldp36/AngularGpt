import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-gpt-message',
  standalone: true,
  imports: [
    MarkdownModule
  ],
  templateUrl: './gptMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageComponent { 
  @Input() text?: string;
  @Input() audioUrl?: string;

}

