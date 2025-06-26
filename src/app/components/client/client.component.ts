import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ClientService, Client } from '../../services/client.service';
import { ClientFormDialogComponent } from './client-form-dialog/client-form-dialog.component';
import { ClientDetailsDialogComponent } from './client-details-dialog/client-details-dialog.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = [
    'client_id',
    'name',
    'email_address',
    'contact_phone',
    'city',
    'status',
    'actions'
  ];
  clients = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit() {
    this.clients.paginator = this.paginator;
    this.clients.sort = this.sort;
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients.data = clients;
    });
  }

  openClientForm(client?: any): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      data: { client }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (client) {
          this.clientService.updateClient(result).subscribe(() => {
            this.loadClients();
          });
        } else {
          this.clientService.addClient(result).subscribe(() => {
            this.loadClients();
          });
        }
      }
    });
  }

  viewClientDetails(client: Client): void {
    this.dialog.open(ClientDetailsDialogComponent, {
      data: { client },
      panelClass: 'client-details-dialog-panel'
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clients.filter = filterValue.trim().toLowerCase();
    if (this.clients.paginator) {
      this.clients.paginator.firstPage();
    }
  }
}
