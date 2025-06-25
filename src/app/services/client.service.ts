import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

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
  private apiUrl = 'http://127.0.0.1:5000/client/add';
  private apiGetUrl = 'http://127.0.0.1:5000/client/all';
  // Dummy data for now
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

  constructor(private http: HttpClient) {}

  // Simulate API GET
  getClients(): Observable<Client[]> {
    return this.http.get<any[]>(this.apiGetUrl).pipe(
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

  // Actual getClients() API call
  /* getClients(): Observable<Client[]> {
    return this.http.get<any[]>('YOUR_API_ENDPOINT').pipe(
      map(apiClients => apiClients.map(apiClient => ({
        clientId: apiClient.CLIENTID,
        firstName: apiClient.FIRSTNAME,
        lastName: apiClient.LASTNAME,
        gender: apiClient.GENDER,
        dateOfBirth: apiClient.DATEOFBIRTH,
        address: apiClient.ADDRESS,
        city: apiClient.CITY,
        state: apiClient.STATE,
        postalCode: apiClient.POSTALCODE,
        country: apiClient.COUNTRY,
        contactPhone: apiClient.CONTACTPHONE,
        emailAddress: apiClient.EMAILADDRESS,
        clientStatus: apiClient.CLIENTSTATUS,
        createdDate: apiClient.CREATEDDATE,
        lastUpdatedDate: apiClient.LASTUPDATEDDATE,
        maritalStatus: apiClient.MARITALSTATUS,
        occupation: apiClient.OCCUPATION,
      })))
    );
  }*/
  
  getClientById(client_id: string): Observable<Client | undefined> {
    return of(this.mockClients.find(c => c.client_id === client_id));
  }

  // Simulate API POST for Add Client (using provided payload structure)
  addClient(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateClient(payload: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, payload);
  }
}
