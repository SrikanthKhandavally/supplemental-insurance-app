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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policy?: Policy }
  ) {
    this.policyForm = this.fb.group({
      policyType: ['', [Validators.required]],
      coverageDescription: ['', [Validators.required, Validators.minLength(10)]],
      coverageAmount: ['', [Validators.required, Validators.min(10000), Validators.max(1000000)]],
      premiumAmount: ['', [Validators.required, Validators.min(100)]],
      paymentFrequency: ['', [Validators.required]],
      policyStatus: ['Active']
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
      const formValue = this.policyForm.value;
      
      // Format currency values
      formValue.coverageAmount = Number(formValue.coverageAmount);
      formValue.premiumAmount = Number(formValue.premiumAmount);

      this.dialogRef.close(formValue);
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