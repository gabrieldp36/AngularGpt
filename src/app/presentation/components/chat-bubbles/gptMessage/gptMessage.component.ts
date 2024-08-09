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
  @Input() imageInfo?: { url: string, alt: string };

  public abrirImagen(): void {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', `${this.imageInfo?.url}`);
    anchor.setAttribute('target', '_blank');
    anchor.click();
    anchor.remove();
  };
};

