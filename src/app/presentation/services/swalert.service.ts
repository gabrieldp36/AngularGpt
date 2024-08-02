import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalertService {

  constructor() { };

  public dialogoSimple(icon: SweetAlertIcon, title: string, text: string): void {
    Swal.fire( {
      icon,
      title,
      text,
      confirmButtonColor: '#7b1fa2',
      returnFocus: false,
    });
  };

  public crearToast (title: string, icon: SweetAlertIcon) {

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    
    Toast.fire({
      icon: icon,
      title: title
    });
  };

  public crearLoading (texto: string): void {
    Swal.fire({
      title: texto,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  public cerrarAlert(): void {
    Swal.close();
  };
}
