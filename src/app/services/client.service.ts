import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ModeService } from './mode.service';

export interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_phone: string;
  email_address: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  marital_status: string;
  occupation: string;
  created_date: string;
  last_updated_date: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private legacyBaseUrl = 'http://127.0.0.1:5000';
  private aiBaseUrl = 'http://127.0.0.1:5001';
  private mode: string = 'legacy';

  private mockClients: any[] = [
    {
      client_id: 'CLI-20250618-0063',
      first_name: 'Riya',
      last_name: 'Sen',
      date_of_birth: '2000-07-14',
      gender: 'Female',
      contact_phone: '+1-555-987-6522',
      email_address: 'Troy.Mo@example.com',
      address: '456 Elm Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90001',
      country: 'United States',
      marital_status: 'Single',
      occupation: 'Marketing Manager',
      created_date: '2023-06-15T11:45:00',
      last_updated_date: '2023-06-15T11:45:00',
      status: 'ACTIVE'
    }
    // ...more clients
  ];

  constructor(private http: HttpClient, private modeService: ModeService) {
    this.modeService.mode$.subscribe(mode => {
      this.mode = mode;
    });
  }

  private getRoutePrefix(): string {
    return this.mode === 'ai' ? '/ai' : '';
  }

  getClients(): Observable<Client[]> {
    const url = this.getRoutePrefix() + '/client/all';
    return this.http.get<any[]>(url).pipe(
      map(apiClients => apiClients.map(apiClient => ({
        client_id: apiClient.CLIENTID,
        first_name: apiClient.FIRSTNAME,
        last_name: apiClient.LASTNAME,
        date_of_birth: apiClient.DATEOFBIRTH,
        gender: apiClient.GENDER,
        contact_phone: apiClient.CONTACTPHONE,
        email_address: apiClient.EMAILADDRESS,
        address: apiClient.ADDRESS,
        city: apiClient.CITY,
        state: apiClient.STATE,
        postal_code: apiClient.POSTALCODE,
        country: apiClient.COUNTRY,
        marital_status: apiClient.MARITALSTATUS,
        occupation: apiClient.OCCUPATION,
        created_date: apiClient.CREATEDDATE,
        last_updated_date: apiClient.LASTUPDATEDDATE,
        status: apiClient.CLIENTSTATUS,
      }))),
      catchError(() => {
        return of(this.mockClients);
      })
    );
  }

  getClientById(client_id: string): Observable<Client | undefined> {
    return of(this.mockClients.find(c => c.client_id === client_id));
  }

  addClient(payload: any): Observable<any> {
    const formattedPayload = {
      ...payload,
      date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth).toISOString().slice(0, 10) : undefined,
    };
    delete formattedPayload.created_date;
    delete formattedPayload.last_updated_date;
    const url = this.getRoutePrefix() + '/client/add';
    return this.http.post<any>(url, formattedPayload);
  }

  updateClient(payload: any): Observable<any> {
    const formattedPayload = {
      ...payload,
      date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth).toISOString().slice(0, 10) : undefined,
    };
    delete formattedPayload.created_date;
    delete formattedPayload.last_updated_date;
    const url = this.getRoutePrefix() + '/client/update';
    return this.http.post<any>(url, formattedPayload);
  }
}
