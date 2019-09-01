import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interfaces/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.subscribe(user => {
      console.log(user);
      if (!user) {
        return;
      } else {
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      }
    });
  }
  login(proveedor: string) {
    switch ( proveedor ) {
      case 'google': this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()); break;
      case 'facebook': this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()); break;
      case 'github': this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider()); break;
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      this.chats = [];
      for ( const mensaje of mensajes ) {
        this.chats.unshift(mensaje);
      }
    }));
  }
  addMensaje(message: string) {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: message,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };
    return this.itemsCollection.add(mensaje);
  }
}
