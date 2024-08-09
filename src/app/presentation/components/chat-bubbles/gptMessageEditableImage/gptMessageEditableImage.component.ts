import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { HandleImgEvent } from '@interfaces/events.interface';
import { OpenAiService } from '../../../services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-gpt-message-editable-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {

  // Inputs.
  @Input({required: true}) text!: string;
  @Input({required: true}) imageInfo!: { url: string, alt: string };

  // Referencias.
  @ViewChild('canvas') canvasElement?: ElementRef<HTMLCanvasElement>;

  // Señales.
  public originalImage = signal<HTMLImageElement|null>(null);
  public isDrawing = signal(false);
  public  coords = signal({x:0, y:0});
  public downloading = signal(false);

  // Eventos.
  @Output() onSelectedImage = new EventEmitter<HandleImgEvent>();

  // Injección de dependencias.
  public openAi = inject(OpenAiService);
  public swAlert = inject(SwalertService);


  public ngAfterViewInit(): void {
    if( !this.canvasElement?.nativeElement ) return;

    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = this.imageInfo.url;

    this.originalImage.set(image);

    image.onload = (): void => {
      // Nos permite dibujar dentro del canvas que se adapta a los límites de la imagen.
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  public onMouseDown(event: MouseEvent): void {

    if( !this.canvasElement?.nativeElement ) return;

    this.isDrawing.set(true);
    const canvas = this.canvasElement.nativeElement;

    // Obtener coordenadas del mouse relativo al canvas;
    const startX = event.clientX - canvas.getBoundingClientRect().left;
    const startY = event.clientY - canvas.getBoundingClientRect().top;
    
    // Establecemos la coordenadas.
    this.coords.set({x: startX, y: startY});
  };

  public onMouseMove(event: MouseEvent): void {

    if( !this.isDrawing() ) return;
    if( !this.canvasElement?.nativeElement ) return;

    const canvas = this.canvasElement.nativeElement;
    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;

    // Calculamos el alto y ancho de un rectángulo.
    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    // Tomamos el contexto dle canvas para poder manipularlo.
    const context = canvas.getContext('2d')!;

    // Limpiamos del canvas, los rectángulos anteriores.
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Redibujamos la imagen.
    context.drawImage( this.originalImage()!, 0, 0, canvas.width, canvas.height);
    // Dibujamos el rectángulo que utilzamos para indicar la zona de la imagen a editar.
    context.clearRect(this.coords().x, this.coords().y, width, height);
  }

  public onMouseUp(): void {
    this.isDrawing.set(false);
    const canvas = this.canvasElement!.nativeElement;
    const img = this.originalImage()!;
    const url = canvas.toDataURL('image/png');
    this.onSelectedImage.emit({url, canvas, img});
  };

  public downloadImage() {
    this.downloading.set(true);
    this.openAi.downloadImg(this.imageInfo.url)
    .subscribe({
      next: (file) => {
        const filePath = window.URL.createObjectURL(file)
        const downLoadLink = document.createElement('a');
        const fileName = this.imageInfo.url.split('/').pop()!;
        downLoadLink.setAttribute('download', fileName); 
        downLoadLink.href = filePath;
        document.body.appendChild(downLoadLink);
        downLoadLink.click();
        downLoadLink.remove();
        this.downloading.set(false);
      },
      error: () => {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error', 'No se ha podido descargar la imagen.');
        this.downloading.set(false);
      },
    });
  };
}

