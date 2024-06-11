import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Option {
  id: string,
  text: string,
};

export interface TextMessageBoxEvent {
  prompt: string,
  selectedOption: string,
}

@Component({
  selector: 'app-text-message-box-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageBoxSelect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxSelectComponent { 
  @Input() placeholder: string = '';
  @Input({required: true}) options!: Option[];
  @Output() onMessage = new EventEmitter<TextMessageBoxEvent>();

  public cdRef = inject(ChangeDetectorRef);
  public fb: FormBuilder = inject(FormBuilder); // Injectamos el servicio de FormBuilder.
  public myForm: FormGroup = this.fb.group({
    prompt: ['', [Validators.required]],
    selectedOption: [null, [Validators.required]],
  });

  public handleSubmit(): void {
    if(this.myForm.invalid) { return; };
    const { prompt, selectedOption } = this.myForm.value;
    this.onMessage.emit( {prompt, selectedOption } );
    this.myForm.reset({
      prompt: null,
      selectedOption: null,
    });
    this.cdRef.detectChanges();
  };
}

