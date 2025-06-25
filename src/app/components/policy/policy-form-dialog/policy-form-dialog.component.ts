import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Policy } from '../../../services/policy.service';

@Component({
  selector: 'app-policy-form-dialog',
  templateUrl: './policy-form-dialog.component.html',
  styleUrls: ['./policy-form-dialog.component.css']
})
export class PolicyFormDialogComponent implements OnInit {
  policyForm: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = 'Add New Policy';

  // Predefined options for form controls
  policyTypes = [
    'Accidental Death & Dismemberment',
    'Critical Illness',
    'Hospital Indemnity',
    'Long-Term Care',
    'Dental Insurance',
    'Vision Insurance',
    'Disability Insurance',
    'Life Insurance'
  ];

  paymentFrequencies = [
    'Monthly',
    'Quarterly',
    'Semi-Annual',
    'Annual'
  ];

  policyTypeCodes = [
    'ACC_INS', 'CRIT_ILL', 'HOSP_IND', 'LTC', 'DENTAL', 'VISION', 'DISABILITY', 'LIFE'
  ];
  policyTypeNames = [
    'Accident Insurance', 'Critical Illness', 'Hospital Indemnity', 'Long-Term Care',
    'Dental Insurance', 'Vision Insurance', 'Disability Insurance', 'Life Insurance'
  ];
  policyCategories = [
    'Supplemental', 'Core', 'Optional', 'Group', 'Individual'
  ];
  coverageCategories = [
    'Personal Accident', 'Health', 'Hospital', 'Dental', 'Vision', 'Disability', 'Life'
  ];
  coverageTypes = [
    'Fixed Benefit', 'Indemnity', 'Reimbursement', 'Cashless'
  ];
  benefitTypes = [
    'Lump Sum', 'Reimbursement', 'Installment', 'Direct Payment'
  ];
  premiumFrequencies = [
    'Monthly', 'Quarterly', 'Semi-Annual', 'Annual'
  ];
  riderOptions = [
    'Fracture Rider', 'Emergency Room Rider', 'Critical Illness Rider', 'Maternity Rider', 'Wellness Rider'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policy?: Policy }
  ) {
    this.policyForm = this.fb.group({
      policy_id: [''],
      policy_type_code: ['', Validators.required],
      policy_type_name: ['', Validators.required],
      policy_category: ['', Validators.required],
      policy_type_description: ['', Validators.required],
      is_active: ['Y', Validators.required],
      coverage_category: ['', Validators.required],
      coverage_type: ['', Validators.required],
      coverage_limit: [null, [Validators.required, Validators.min(0)]],
      base_coverage_amount: [null, [Validators.required, Validators.min(0)]],
      annual_premium: [null, [Validators.required, Validators.min(0)]],
      premium_frequency: ['', Validators.required],
      benefit_type: ['', Validators.required],
      waiting_period_days: [0, [Validators.required, Validators.min(0)]],
      coverage_duration_months: [null, [Validators.required, Validators.min(0)]],
      pre_existing_exclusion: ['N', Validators.required],
      riders_available: [''],
      eligibility_notes: [''],
      renewable: ['Y', Validators.required],
      taxable_benefit: ['N', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.policy) {
      this.isEditMode = true;
      this.dialogTitle = 'Edit Policy';
      this.policyForm.patchValue(this.data.policy);
    }
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      this.dialogRef.close(this.policyForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Helper methods for form validation
  getErrorMessage(controlName: string): string {
    const control = this.policyForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }
    return '';
  }
} 