import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PolicyService, Policy } from '../../services/policy.service';
import { PolicyFormDialogComponent } from './policy-form-dialog/policy-form-dialog.component';
import { PolicyDetailsDialogComponent } from './policy-details-dialog.component';

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
      panelClass: 'policy-form-dialog-panel',
      width: undefined,
      data: { policy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (policy) {
          this.policyService.updatePolicy({ policyId: policy.policyId, ...result }).subscribe(() => {
            this.loadPolicies();
          });
        } else {
          this.policyService.createPolicy(result).subscribe(() => {
            this.loadPolicies();
          });
        }
      }
    });
  }

  editPolicy(policy: Policy): void {
    this.openPolicyForm(policy);
  }

  viewPolicyDetails(policy: Policy): void {
    this.dialog.open(PolicyDetailsDialogComponent, {
      data: { policy },
      panelClass: 'policy-details-dialog-panel'
    });
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
