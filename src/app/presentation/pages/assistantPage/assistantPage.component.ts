import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { QuestionResponse } from '@interfaces/question.response';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { SwalertService } from 'app/presentation/services/swalert.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {

  @ViewChild('divMensajes') divMensajes!: ElementRef<HTMLDivElement>;


  public threadId = signal<string|undefined>(undefined);
  public disableInput = signal<boolean>(true);
  public messages = signal<Message[]>([]);
  public idMessage: number = 0;
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public swAlert = inject(SwalertService);
  public cdRef = inject(ChangeDetectorRef)

  public ngOnInit(): void {
    this.createThread();
  };

  private createThread() {
    this.swAlert.crearLoading('¡Preparando a tu asistente!');
    this.openAiService.createThread()
    .pipe( delay(800) )
    .subscribe( resp => {
      if(resp.ok) {
        this.restoreMessages();
        this.swAlert.cerrarAlert();
        this.threadId.set(resp.id);
        this.disableInput.set(false);
        this.cdRef.detectChanges();
        setTimeout( () => {  this.scrollToBottom(); }, 100 );
      } else {
        this.swAlert.cerrarAlert();
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error', resp.message!);
      };
    });
  };

  public restoreMessages() {
    if( localStorage.getItem('messages') ) {
      const previousMessages = JSON.parse( localStorage.getItem('messages')! ) as Message[];
      this.messages.set(previousMessages);
    };
  };

  public handleMessage(question: string): void {
    // Actualizamos el estado del loading para indicar que se está cargando la respuesta del backend.
    this.isLoading.set(true);
    // Hacemos un update de los mensajes para agregar la consulta enviada por el usuario.
    this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: false, text: question } ]);
    this.cdRef.detectChanges();
    this.scrollToBottom();
    // Realizamos la consulta al backend para obtener la respuesta de nuestro asistente.
    this.openAiService.postQuestion(this.threadId()!, question)
    .subscribe( resp => {
      if(!resp.ok) {
        this.swAlert.dialogoSimple('error', 'Ha ocurrido un error.', resp.message!);
        this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: true, text: resp.message! } ] );
        this.isLoading.set(false);
      } else {
        this.isLoading.set(false);
        this.addMessages(resp.replies!);
      };
      this.cdRef.detectChanges();
      setTimeout( () => {  this.scrollToBottom(); }, 100 );
    });
  };

  public addMessages(replies: QuestionResponse[]) {
    for (const reply of replies) {
      for (const message of reply.content) {
        this.messageWithoutDuplicates(message, reply.role);
      };
    };
    localStorage.setItem( 'messages', JSON.stringify( this.messages() ) );
  };

  public messageWithoutDuplicates(messageText: string, role: string): void {
    if(this.messages().filter( m => m.text === messageText ).length === 0) {
      this.messages.update( (prev) => [ ...prev, { id: this.idMessage++, isGpt: role === 'assistant', text: messageText } ]);
    };
  };

  public scrollToBottom(): void {
    if(this.divMensajes) {
      this.divMensajes.nativeElement.scroll({
        top: this.divMensajes.nativeElement.scrollHeight, 
        behavior:'smooth'
      });
    };
  };
}

