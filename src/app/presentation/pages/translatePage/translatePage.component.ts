import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent { 

  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;

  public isLoading = signal(false);
  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public languages = signal([
    { id: 'español', text: 'Español' },
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)
  public abortSignal = new AbortController();

  public async handleMessageWithSelect( { prompt, selectedOption }:TextMessageBoxEvent ) {
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
        text: `Traduce a ${selectedOption}: ${prompt}`,
      }
    ]);
    this.cdRef.detectChanges();
    this.scrollToBottom('smooth');
    // En la constante stream tenemos nuestro async generator.
    const stream = this.openAiService.translateText(prompt, selectedOption, this.abortSignal.signal);
    // Validamos que en la constante stream tenemos nuestro async generator.
    if( !( await stream.next() ).value ) {
      this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', 'No se ha podido realizar la traducción.');
      this.messages.update( (prev) => [ ...prev, { isGpt: true, text: 'No se ha podido realizar la traducción.'} ] );
      this.isLoading.set(false);
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

