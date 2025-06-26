import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from '../../../services/client.service';

@Component({
  selector: 'app-client-form-dialog',
  templateUrl: './client-form-dialog.component.html',
  styleUrls: ['./client-form-dialog.component.css']
})
export class ClientFormDialogComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  dialogTitle = 'Add Client';
  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  statuses = ['ACTIVE', 'INACTIVE'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClientFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {
    this.clientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      contact_phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\-\s]+$/)]],
      email_address: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      country: ['', Validators.required],
      marital_status: ['', Validators.required],
      occupation: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.client) {
      this.isEditMode = true;
      this.dialogTitle = 'Edit Client';
      this.clientForm.patchValue(this.data.client);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const now = new Date().toISOString();
      let payload = { ...this.clientForm.value };
      // Format date_of_birth as 'YYYY-MM-DD'
      if (payload.date_of_birth) {
        const dob = new Date(payload.date_of_birth);
        payload.date_of_birth = dob.toISOString().slice(0, 10);
      }
      if (this.isEditMode) {
        // Editing: send client_id, blank created_date, updated now
        payload.created_date = '';
        payload.last_updated_date = now;
      } else {
        // Adding: blank client_id, both dates now
        payload.client_id = '';
        payload.created_date = now;
        payload.last_updated_date = now;
      }
      this.dialogRef.close(payload);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 