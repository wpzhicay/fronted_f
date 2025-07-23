import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DashboardComponent {
  userData: any = null;
  editForm!: FormGroup;
  isEditing = false;
  activeSection = 'info';
  equipo = {
    nombre: '',
    ubicacion: ''
  };

  equipos: any[] = [
    { id: 1, nombre: 'Equipo A' },
    { id: 2, nombre: 'Equipo B' },
    { id: 3, nombre: 'Equipo C' },
  ];

  selectedEquipo: any = null;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('userData');
      if (stored) {
        this.userData = JSON.parse(stored);
        this.editForm = this.fb.group({
          alias: [this.userData.alias, Validators.required],
          name: [this.userData.name, [Validators.required, Validators.minLength(3)]],
          email: [this.userData.email, [Validators.required, Validators.email]],
          phone: [this.userData.phone, [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
          country: [this.userData.country, Validators.required],
          province: [this.userData.province, Validators.required],
          city: [this.userData.city, Validators.required],
          address: [this.userData.address, Validators.required],
        });
      }
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  guardarCambios() {
    if (this.editForm.valid) {
      const updatedData = {
        ...this.userData,
        ...this.editForm.value,
      };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userData', JSON.stringify(updatedData));
      }
      this.userData = updatedData;
      this.isEditing = false;
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  setSection(section: string) {
    this.activeSection = section;
    this.isEditing = false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userData');
    }
    location.href = '/';
  }

  generateReport() {
    const user = this.userData;
    const report = `
      📄 INFORME DE USUARIO

      Nombre: ${user.name}
      ID: ${user.alias}
      Email: ${user.email}
      Teléfono: ${user.phone}
      País: ${user.country}
      Provincia: ${user.province}
      Ciudad: ${user.city}
      Dirección: ${user.address}

      Fecha de generación: ${new Date().toLocaleDateString()}
    `;
    alert(report);
  }

  registrarEquipo() {
    if (this.equipo.nombre.trim() && this.equipo.ubicacion.trim()) {
      const nuevoEquipo = {
        id: this.equipos.length ? Math.max(...this.equipos.map(e => e.id)) + 1 : 1,
        nombre: this.equipo.nombre,
        ubicacion: this.equipo.ubicacion
      };
      this.equipos.push(nuevoEquipo);
      this.equipo = { nombre: '', ubicacion: '' };
    }
  }

  eliminarEquipo(id: number): void {
    this.equipos = this.equipos.filter(equipo => equipo.id !== id);
    if (this.selectedEquipo && this.selectedEquipo.id === id) {
      this.selectedEquipo = null;
    }
  }

  seleccionarEquipo(equipo: any) {
    this.selectedEquipo = equipo;
  }
}
