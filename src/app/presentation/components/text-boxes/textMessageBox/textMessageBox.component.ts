import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
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
export class TextMessageBoxComponent implements OnChanges {

  @Input() placeholder: string = '';
  @Input() disableCorrection: boolean = false;
  @Input() disableInput?: boolean|undefined;

  @Output() onMessage = new EventEmitter<string>();

  public cdRef = inject(ChangeDetectorRef);
  public fb: FormBuilder = inject(FormBuilder); // Injectamos el servicio de FormBuilder.
  public myForm: FormGroup = this.fb.group({
    prompt: ['', [Validators.required]],
  });
  
  public ngOnChanges(changes: SimpleChanges): void {
    if(changes['disableInput']) {
      if(changes['disableInput'].currentValue) {
        this.myForm.get('prompt')?.disable();
      } else {
        this.myForm.get('prompt')?.enable();
      };
    };
  };

  public handleSubmit(): void {
    if(this.myForm.invalid) { return; };
    const { prompt } = this.myForm.value;
    this.onMessage.emit(prompt ?? '');
    this.myForm.reset();
    this.cdRef.detectChanges();
  };
}

