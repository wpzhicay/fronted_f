import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  reporteGenerado = false;

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
    const userSheet = [
      ['Nombre', this.userData.name],
      ['Email', this.userData.email],
      ['ID', this.userData.alias],
      ['Teléfono', this.userData.phone],
      ['País', this.userData.country],
      ['Provincia', this.userData.province],
      ['Ciudad', this.userData.city],
      ['Dirección', this.userData.address],
    ];

    const equiposSheet = this.equipos.map(eq => ({
      Nombre: eq.nombre,
      Ubicación: eq.ubicacion || 'No especificada'
    }));

    const datosSheet = [
      ['Energía Total', '300 kWh'],
      ['Fecha Última Lectura', '18/07/2025']
    ];

    const alertasSheet = [
      ['🔴 Temperatura elevada', '17/07/2025'],
      ['🟠 Mantenimiento recomendado', '15/07/2025']
    ];

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(userSheet), 'Usuario');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(equiposSheet), 'Equipos');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosSheet), 'Datos');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(alertasSheet), 'Alertas');

    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `informe_energia_${this.userData.alias}_${fecha}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);

    this.reporteGenerado = true;
    setTimeout(() => this.reporteGenerado = false, 3000);
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
