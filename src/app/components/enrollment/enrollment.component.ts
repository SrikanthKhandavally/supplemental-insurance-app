import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import { PolicyService, Policy } from '../../services/policy.service';
import { EnrollmentService, EnrollmentRequest } from '../../services/enrollment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  clients: Client[] = [];
  policies: Policy[] = [];
  selectedClientId: string | null = null;
  selectedPolicyId: string | null = null;
  selectedPaymentFrequency: string = 'Annual';
  isEnrolling: boolean = false;

  paymentFrequencies = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Semi-Annual', label: 'Semi-Annual' },
    { value: 'Annual', label: 'Annual' }
  ];

  constructor(
    private clientService: ClientService,
    private policyService: PolicyService,
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadPolicies();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        this.snackBar.open('Error loading policies', 'Close', { duration: 3000 });
      }
    });
  }

  activateEnrollment() {
    if (this.selectedClientId && this.selectedPolicyId && this.selectedPaymentFrequency) {
      this.isEnrolling = true;
      
      const enrollmentData: EnrollmentRequest = {
        client_id: this.selectedClientId,
        policy_id: this.selectedPolicyId,
        is_auto_enroll: 'Y',
        payment_frequency: this.selectedPaymentFrequency
      };

      this.enrollmentService.enrollClient(enrollmentData).subscribe({
        next: (response) => {
          this.isEnrolling = false;
          if (response.success) {
            this.snackBar.open(
              `Enrollment successful! ${response.enrollment_id ? 'ID: ' + response.enrollment_id : ''}`, 
              'Close', 
              { duration: 4000 }
            );
            // Reset form
            this.selectedClientId = null;
            this.selectedPolicyId = null;
            this.selectedPaymentFrequency = 'Annual';
          } else {
            this.snackBar.open('Enrollment failed: ' + response.message, 'Close', { duration: 4000 });
          }
        },
        error: (error) => {
          this.isEnrolling = false;
          console.error('Enrollment error:', error);
          this.snackBar.open('Enrollment failed. Please try again.', 'Close', { duration: 4000 });
        }
      });
    }
  }
}
