import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Policy {
  policyId: number;
  policyType: string;
  coverageDescription: string;
  coverageAmount: number;
  premiumAmount: number;
  paymentFrequency: string;
  policyStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:5001/api/policy/direct';

  // Mock data for development
  private mockPolicies: Policy[] = [
    {
      policyId: 1,
      policyType: 'Accidental Death & Dismemberment',
      coverageDescription: 'Coverage for accidental death, dismemberment, and disability with worldwide protection',
      coverageAmount: 250000,
      premiumAmount: 750,
      paymentFrequency: 'Quarterly',
      policyStatus: 'Active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      policyId: 2,
      policyType: 'Critical Illness',
      coverageDescription: 'Coverage for major illnesses including cancer, heart attack, stroke, and organ transplants',
      coverageAmount: 500000,
      premiumAmount: 1200,
      paymentFrequency: 'Monthly',
      policyStatus: 'Active',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      policyId: 3,
      policyType: 'Hospital Indemnity',
      coverageDescription: 'Daily cash benefits for hospital stays, intensive care, and surgical procedures',
      coverageAmount: 100000,
      premiumAmount: 450,
      paymentFrequency: 'Monthly',
      policyStatus: 'Active',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      policyId: 4,
      policyType: 'Long-Term Care',
      coverageDescription: 'Coverage for extended care services including nursing home, assisted living, and home healthcare',
      coverageAmount: 300000,
      premiumAmount: 950,
      paymentFrequency: 'Quarterly',
      policyStatus: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  constructor(private http: HttpClient) {}

  getPolicies(): Observable<Policy[]> {
    return this.http.get<any[]>(this.apiUrl + '/all').pipe(
      map(apiPolicies => apiPolicies.map(api => ({
        policyId: api.POLICYID,
        policyType: api.POLICYTYPENAME,
        coverageDescription: api.POLICYDESCRIPTION,
        coverageAmount: api.BASECOVERAGEAMOUNT,
        premiumAmount: api.BASEPREMIUM,
        paymentFrequency: 'N/A', // Not present in API, set as needed
        policyStatus: api.POLICYTYPEISACTIVE === 'Y' ? 'Active' : 'Inactive',
        createdAt: new Date(api.CREATEDDATE),
        updatedAt: new Date(api.LASTUPDATEDDATE)
      }))),
      catchError(() => of(this.mockPolicies))
    );
  }

  getPolicyById(id: number): Observable<Policy | undefined> {
    // For development, return mock data
    return of(this.mockPolicies.find(p => p.policyId === id));
    // TODO: Uncomment when API is ready
    // return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  /**
   * Sends a POST request to the API to create a new policy.
   * - Omits policyId, sets createdAt and updatedAt to now.
   * - On API failure, falls back to mock data.
   */
  createPolicy(policy: Omit<Policy, 'policyId' | 'createdAt' | 'updatedAt'>): Observable<any> {
    const now = new Date();
    const payload = {
      ...policy,
      createdAt: now,
      updatedAt: now
    };
    return this.http.post<any>(this.apiUrl + '/add', payload).pipe(
      catchError(() => {
        // Fallback to mock
        const newId = Math.max(...this.mockPolicies.map(p => p.policyId), 0) + 1;
        const newPolicy: Policy = {
          ...policy,
          policyId: newId,
          createdAt: now,
          updatedAt: now
        } as Policy;
        this.mockPolicies.push(newPolicy);
        return of({ data: newPolicy, message: 'Mock add (API failed)' });
      })
    );
  }

  /**
   * Sends a PUT request to the API to update a policy.
   * - Omits createdAt, sets updatedAt to now, includes policyId.
   * - On API failure, falls back to mock data.
   */
  updatePolicy(policy: Partial<Policy> & { policyId: number }): Observable<any> {
    const now = new Date();
    const { policyId, ...rest } = policy;
    const payload = {
      ...rest,
      policyId,
      updatedAt: now
      // Do not send createdAt
    };
    return this.http.put<any>(this.apiUrl + '/add', payload).pipe(
      catchError(() => {
        // Fallback to mock
        const index = this.mockPolicies.findIndex(p => p.policyId === policyId);
        if (index !== -1) {
          this.mockPolicies[index] = {
            ...this.mockPolicies[index],
            ...rest,
            updatedAt: now
          };
          return of({ data: this.mockPolicies[index], message: 'Mock edit (API failed)' });
        }
        return of({ data: undefined, message: 'Policy not found in mock' });
      })
    );
  }

  deletePolicy(id: number): Observable<void> {
    const index = this.mockPolicies.findIndex(p => p.policyId === id);
    if (index !== -1) {
      this.mockPolicies.splice(index, 1);
    }
    return of(void 0);
    // TODO: Uncomment when API is ready
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  togglePolicyStatus(id: number, status: string): Observable<Policy | undefined> {
    const index = this.mockPolicies.findIndex(p => p.policyId === id);
    if (index !== -1) {
      this.mockPolicies[index] = {
        ...this.mockPolicies[index],
        policyStatus: status,
        updatedAt: new Date()
      };
      return of(this.mockPolicies[index]);
    }
    return of(undefined);
    // TODO: Uncomment when API is ready
    // return this.http.patch<Policy>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Additional methods for specific queries
  getPoliciesByType(type: string): Observable<Policy[]> {
    return of(this.mockPolicies.filter(p => p.policyType === type));
    // TODO: Uncomment when API is ready
    // return this.http.get<Policy[]>(`${this.apiUrl}/type/${type}`);
  }

  getPoliciesByPaymentFrequency(frequency: string): Observable<Policy[]> {
    return of(this.mockPolicies.filter(p => p.paymentFrequency === frequency));
    // TODO: Uncomment when API is ready
    // return this.http.get<Policy[]>(`${this.apiUrl}/frequency/${frequency}`);
  }

  getExpiredPolicies(): Observable<Policy[]> {
    return of(this.mockPolicies.filter(p => p.policyStatus === 'Expired'));
    // TODO: Uncomment when API is ready
    // return this.http.get<Policy[]>(`${this.apiUrl}/expired`);
  }

  /**
   * Adds a policy to the mockPolicies array (for UI sync when using API).
   */
  public addToMockPolicies(policy: Policy): void {
    this.mockPolicies.push(policy);
  }
}
