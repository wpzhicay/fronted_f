import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈 Importa esto

@Component({
  selector: 'app-producto',
  standalone: true, // 👈 Asegúrate de que esté marcado como standalone
  imports: [RouterModule], // 👈 Agrega RouterModule aquí
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {}
