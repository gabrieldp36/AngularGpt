import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-message-box',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './textMessageBox.component.html',
  styles: `
    .input-bg-gray {
      background-color: #1c1c1c;
      border-color: #1c1c1c;
    }

    .input-bg-gray:focus {
      outline: 2px solid rgb(99 102 241);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxComponent {
  
  @Input() placeholder: string = '';
  @Input() disableCorrection: boolean = false;
  @Output() onMessage = new EventEmitter<string>();

  public cdRef = inject(ChangeDetectorRef);
  public fb: FormBuilder = inject(FormBuilder); // Injectamos el servicio de FormBuilder.
  public myForm: FormGroup = this.fb.group({
    prompt: ['', [Validators.required]],
  });

  public handleSubmit(): void {
    if(this.myForm.invalid) { return; };
    const { prompt } = this.myForm.value;
    this.onMessage.emit(prompt ?? '');
    this.myForm.reset();
    this.cdRef.detectChanges();
  };
}

