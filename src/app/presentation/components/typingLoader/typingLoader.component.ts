import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-typing-loader',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClass(type)">
      <span class="circle scaling"></span>
      <span class="circle scaling"></span>
      <span class="circle scaling"></span>
    </div>
  `,
  styleUrl: './typingLoader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingLoaderComponent {
  @Input({required:true}) type!: string;

  public getClass(type: string): string {
    let retorno = '';
    switch (type) {

      case 'typing':
        retorno = 'typing'
      break;

      case 'generating':
        retorno = 'generating'
      break;

      default:
        retorno = 'typing'
      break;
    }
    
    return retorno;
  };
}

