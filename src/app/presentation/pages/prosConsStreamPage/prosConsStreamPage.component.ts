import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {

  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)
  public abortSignal = new AbortController();

  public async handleMessage(prompt: string) {
    // En caso de estar una petición en curso y que el usuario vuelva a enviar una, cancelamos la anterior petición.
    this.abortSignal.abort();
    this.abortSignal = new AbortController();
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
        text: prompt
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    const stream = this.openAiService.prosConsDiscusserStream(prompt, this.abortSignal.signal);
    // Validamos que en la constante stream tenemos nuestro async generator.
    if( !( await stream.next() ).value ) {
      this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', 'No se ha podido realizar la comparación.');
      this.messages.update( (prev) => [ ...prev, { isGpt: true, text: 'No se ha podido realizar la comparación.'} ] );
      this.isLoading.set(false);
      this.cdRef.detectChanges();
      this.scrollToBottom('smooth');
    } else {
      setTimeout( async () => {
        // Con el for await vamos consumiendo todos los valores que emite nuestro async generator.
        for await (const text of stream) {
          this.isLoading.set(false); // quitamos el loading.
          this.handleMessageStream(text); // vamos mostrando el mensaje en pantalla.
          this.scrollToBottom('instant'); // seguimos la generación de texto con el scroll.
        }
      }, 1000);
    };
  };

  public handleMessageStream(message: string) {
    if(this.messages().length > 1 && this.messages()[this.messages().length -1].isGpt === true) { this.messages().pop() };
    this.messages.set([
      ...this.messages(),
      {
        id: this.idMessage++,
        isGpt: true,
        text: message,
      },
    ]);
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

