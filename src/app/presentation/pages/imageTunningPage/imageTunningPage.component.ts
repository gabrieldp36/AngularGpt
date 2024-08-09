import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, GptMessageEditableImageComponent,  } from '@components/index';
import { HandleImgEvent } from '@interfaces/events.interface';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent
],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {

  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public isLoading = signal(false);
  public isEditing = signal(false);
  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public originalImage = signal<string|undefined>(undefined);
  public maskImage = signal<string|undefined>(undefined);
  public canvas!: HTMLCanvasElement;
  public editingImg!: HTMLImageElement;
  public menuCompleto = signal(true);
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)

  public handleMessage( prompt: string ) {
    this.isLoading.set(true);
    this.isEditing.set(false);
    this.limpiarCambas();
    this.messages.update( (prev) => [
      ...prev,
      {
        id: this.idMessage++,
        isGpt: false,
        text: `Genera una imagen basada en el siguiente texto: ${prompt}`,
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    this.openAiService.imageGeneration( prompt, this.originalImage(), this.maskImage() )
    .subscribe( ( { ok, message, url, alt } ) => {
      if(!ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', message!);
        this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: true, text: message! } ] );
        this.originalImage.set(undefined);
        this.maskImage.set(undefined);
      } else { 
        this.isLoading.set(false);
        this.originalImage.set(undefined);
        this.maskImage.set(undefined);
        this.messages.update( (prev) => [
          ...prev,
          {
            id: this.idMessage++,
            isGpt: true,
            text: '',
            imageInfo: { url, alt },
          },
        ]);
      };
      this.cdRef.detectChanges();
      setTimeout(() => { this.scrollToBottom('smooth'); }, 1);
    });
  };

  public handleImageChange({url: newImage, canvas, img}: HandleImgEvent, originalImage: string) {
    this.isEditing.set(true);
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);
    this.canvas = canvas;
    this.editingImg = img;
  };

  public generateVariation() {
    this.isLoading.set(true);
    this.isEditing.set(false);
    this.limpiarCambas();
    this.messages.update( (prev) => [
      ...prev,
      {
        id: this.idMessage++,
        isGpt: false,
        text: `Generá una variación de la imagen seleccionada`,
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    this.openAiService.imageVariation( this.originalImage()! )
    .subscribe( ( { ok, message, url, alt } ) => {
      if(!ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', message!);
        this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: true, text: message! } ] );
        this.isLoading.set(false);
        this.originalImage.set(undefined);
        this.maskImage.set(undefined);
        this.cdRef.detectChanges();
        this.scrollToBottom('smooth');
      } else { 
        this.isLoading.set(false);
        this.originalImage.set(undefined);
        this.maskImage.set(undefined);
        this.messages.update( (prev) => [
          ...prev,
          {
            id: this.idMessage++,
            isGpt: true,
            text: '',
            imageInfo: { url, alt },
          },
        ]);
        this.cdRef.detectChanges();
        setTimeout( () => {  this.scrollToBottom('smooth'); }, 100 );
      };
    });
  };

  public showMenu() {
    this.menuCompleto.set(!this.menuCompleto());
  };

  public cancelEditing() {
    this.isEditing.set(false);
    this.originalImage.set(undefined);
    this.maskImage.set(undefined);
    this.limpiarCambas();
  };

  public limpiarCambas() {
    if(this.canvas) {
      const context = this.canvas.getContext('2d')!;
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.drawImage( this.editingImg, 0, 0, this.canvas.width, this.canvas.height);
    };
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

