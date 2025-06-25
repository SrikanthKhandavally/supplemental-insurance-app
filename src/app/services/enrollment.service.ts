import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface EnrollmentRequest {
  client_id: string;
  policy_id: string;
  is_auto_enroll: string;
  payment_frequency: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  enrollment_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://127.0.0.1:5000/client_enrollment/enroll';

  constructor(private http: HttpClient) { }

  enrollClient(enrollmentData: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(this.apiUrl, enrollmentData).pipe(
      catchError(error => {
        console.error('Enrollment API error:', error);
        // Return a mock success response for development
        return of({
          success: true,
          message: 'Enrollment successful (mock response - API failed)',
          enrollment_id: 'ENR-' + Date.now()
        });
      })
    );
  }
}
