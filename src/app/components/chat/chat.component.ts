import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {
  mensaje: string = '';
  elemento: any;
  constructor( public _cs: ChatService) {
    this._cs.cargarMensajes()
      .subscribe(() => {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 50);
      });
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }
  enviar_mensaje() {
    if (this.mensaje.length === 0) {
      return;
    } else {
      this._cs.addMensaje(this.mensaje)
        .then(() => this.mensaje = '')
        .catch((err) => console.log('ocurrió un error: ', err));
    }
  }

}
