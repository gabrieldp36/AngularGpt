import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface TextMessageEvent {
  file: File,
  prompt: string|null,
};

@Component({
  selector: 'app-text-message-box-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './textMessageBoxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent { 

  @Input() placeholder: string = '';
  @Output() onMessage = new EventEmitter<TextMessageEvent>();

  public cdRef = inject(ChangeDetectorRef);
  public fb: FormBuilder = inject(FormBuilder); // Injectamos el servicio de FormBuilder.
  public myForm: FormGroup = this.fb.group({
    prompt: ['', []],
    file: [null, [Validators.required]],
  });
  public file: File|undefined;

  public handleSelectedFile(event: any): void {
    const file = event?.target?.files?.item(0);
    this.myForm.controls['file']?.setValue(file);
  };

  public getBtnInputFileClass(): string {
    return (this.myForm.get('file')?.value) 
    ? 'flex justify-center items-center color-green hover:opacity-70' 
    : 'flex justify-center items-center text-gray-400 hover:opacity-70'
  };

  public handleSubmit(): void {
    if(this.myForm.invalid) { return; };
    const { prompt, file } = this.myForm.value;
    this.onMessage.emit( {prompt, file} );
    this.myForm.reset();
    this.cdRef.detectChanges();
  };
}