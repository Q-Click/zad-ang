import { Component, OnInit } from '@angular/core';
import { ServersService } from '../shared/servers.service';
import { Server } from '../shared/server';
import { interval } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
  servers: Server[] = [];
  dataSource: MatTableDataSource<Server>;
  displayedColumns: string[] = ['name', 'status', 'options'];
  constructor(private serversService: ServersService) { }

  ngOnInit() {
    this.UpdateServerList();
  }

  UpdateServerList() {
    this.servers.length = 0;
    this.serversService.getServerList()
    .toPromise()
    .then(data => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.servers.push(data[key]);
          this.dataSource = new MatTableDataSource(this.servers);
        }
      }
    });
  }
  RebootServer(id) {
  //   let server: Server;
  //   this.serversService.rebootServer(id).subscribe((response) => {
  //     this.servers.find(s =>
  //       s.id === response.id
  //     ).status = response.status;
  //     server = response;
  //     this.servers = [...this.servers];
  //  });
  //   while (server.status !== 'ONLINE') {
  //       interval(1000)
  //       .subscribe(() => {
  //         this.serversService.getServer(server.id).subscribe((response) => {
  //           if (response.status === 'ONLINE') {
  //             server.status = response.status;
  //             return;
  //           }
  //         });
  //       });
  //   }
  //   this.servers.find(s =>
  //     s.id === server.id
  //   ).status = server.status;
  //   this.servers = [...this.servers];
  const server = {} as Server;
  this.servers.find(s =>
    s.id === id
  ).status = 'REBOOTING';
  this.dataSource = new MatTableDataSource(this.servers);

  this.serversService.rebootServer(id).subscribe((response) => {
      while (server.status !== 'ONLINE') {
        interval(1000)
        .subscribe(() => {
          this.serversService.getServer(server.id).subscribe((rebooted) => {
            if (rebooted.status === 'ONLINE') {
              server.status = rebooted.status;
              return;
            }
          });
        });
      }
      this.servers.find(s =>
        s.id === server.id
      ).status = server.status;
      this.dataSource = new MatTableDataSource(this.servers);
    });
  }
  TurnOnServer(id) {
    this.serversService.turnOnServer(id).subscribe((response) => {
      this.servers.find(s =>
        s.id === response.id
      ).status = response.status;
      this.dataSource = new MatTableDataSource(this.servers);
   });
  }
  TurnOffServer(id) {
    this.serversService.turnOffServer(id).subscribe((response) => {
      this.servers.find(s =>
        s.id === response.id
      ).status = response.status;
      this.dataSource = new MatTableDataSource(this.servers);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
