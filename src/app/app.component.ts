import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // ✅ Importar HttpClientModule
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule], // ✅ Agregado HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private api = inject(ApiService); // ✅ Inyectamos el servicio

  ngOnInit(): void {
    this.api.getHello().subscribe({
      next: (data) => console.log('Respuesta del backend:', data),
      error: (err) => console.error('Error al conectar con backend:', err)
    });
  }
}
