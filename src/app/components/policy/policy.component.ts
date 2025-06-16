import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PolicyService, Policy } from '../../services/policy.service';
import { PolicyFormDialogComponent } from './policy-form-dialog/policy-form-dialog.component';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  displayedColumns: string[] = [
    'policyId',
    'policyType',
    'coverageDescription',
    'coverageAmount',
    'premiumAmount',
    'paymentFrequency',
    'policyStatus',
    'actions'
  ];
  
  policies = new MatTableDataSource<Policy>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  ngAfterViewInit() {
    this.policies.paginator = this.paginator;
    this.policies.sort = this.sort;
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe(policies => {
      this.policies.data = policies;
    });
  }

  openPolicyForm(policy?: Policy): void {
    const dialogRef = this.dialog.open(PolicyFormDialogComponent, {
      width: '900px',
      data: { policy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (policy) {
          // Update existing policy
          this.policyService.updatePolicy(policy.policyId, result).subscribe(updatedPolicy => {
            if (updatedPolicy) {
              const index = this.policies.data.findIndex(p => p.policyId === policy.policyId);
              if (index !== -1) {
                const updatedData = [...this.policies.data];
                updatedData[index] = updatedPolicy;
                this.policies.data = updatedData;
              }
            }
          });
        } else {
          // Create new policy
          this.policyService.createPolicy(result).subscribe(newPolicy => {
            const updatedData = [...this.policies.data, newPolicy];
            this.policies.data = updatedData;
          });
        }
      }
    });
  }

  editPolicy(policy: Policy): void {
    this.openPolicyForm(policy);
  }

  viewPolicyDetails(policy: Policy): void {
    // TODO: Implement view details
    console.log('Viewing policy details', policy);
  }

  togglePolicyStatus(policy: Policy): void {
    const newStatus = policy.policyStatus === 'Active' ? 'Inactive' : 'Active';
    this.policyService.togglePolicyStatus(policy.policyId, newStatus).subscribe(updatedPolicy => {
      if (updatedPolicy) {
        const index = this.policies.data.findIndex(p => p.policyId === policy.policyId);
        if (index !== -1) {
          const updatedData = [...this.policies.data];
          updatedData[index] = updatedPolicy;
          this.policies.data = updatedData;
        }
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.policies.filter = filterValue.trim().toLowerCase();

    if (this.policies.paginator) {
      this.policies.paginator.firstPage();
    }
  }
}
