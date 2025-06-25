import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Policy } from '../../services/policy.service';

@Component({
  selector: 'app-policy-details-dialog',
  templateUrl: './policy-details-dialog.component.html',
  styleUrls: ['./policy-details-dialog.component.css']
})
export class PolicyDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { policy: Policy }) {}
} 