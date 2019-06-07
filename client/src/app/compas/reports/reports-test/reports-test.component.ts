import { Component, OnInit, ViewChild } from '@angular/core';
declare var $;

@Component({
  selector: 'app-reports-test',
  templateUrl: './reports-test.component.html',
  styleUrls: ['./reports-test.component.css']
})
export class ReportsTestComponent implements OnInit {

  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;

  ngOnInit(): void {
    this.dtOptions = {

      ajax: 'assets/data.json',

      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    };
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
  }
}


