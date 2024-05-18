import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/producto'; 

  constructor(private http: HttpClient) {}

  getListaProductos() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProducto(producto: any) {
    return this.http.post<any>(this.apiUrl, producto);
  }

  editProducto(id: number, camposEditados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, camposEditados);
  }

  deleteProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
