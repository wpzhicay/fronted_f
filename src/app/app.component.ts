import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // 🔧 Corrección aquí
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private api = inject(ApiService); // ✅ inyectamos el servicio

  // src/app/app.component.ts
ngOnInit(): void {
  this.api.getHello().subscribe({
    next: (data) => console.log('Respuesta del backend:', data),
    error: (err) => console.error('Error al conectar con backend:', err)
  });
}

}
