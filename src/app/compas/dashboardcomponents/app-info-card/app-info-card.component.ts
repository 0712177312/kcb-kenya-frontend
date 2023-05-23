import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as c3 from 'c3';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-app-info-card',
  templateUrl: './app-info-card.component.html',
  styleUrls: ['./app-info-card.component.css']
})
export class AppInfoCardComponent implements OnInit {

  constructor(private dsvc: DashboardService ) { }
  dash: any = {};

  public lineChartData: Array<any> = [
    { data: [12, 0, 0, 0, 0, 0], label: 'Customers' }
  ];
  public lineChartLabels: Array<any> = [
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024'
  ];
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      point: {
        radius: 2
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#4dc8ff',
      pointBackgroundColor: '#4dc8ff',
      pointBorderColor: '#4dc8ff',
      pointHoverBackgroundColor: '#4dc8ff',
      pointHoverBorderColor: '#4dc8ff'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  ngOnInit() {
     this.getInfoCard();
  }

  getInfoCard() {
    this.dsvc.getInforCard().subscribe(data => {
      console.log("Info Card", data)
        this.dash = JSON.parse(data);
    }, error => {
      console.log('error');
    });
  }
  // ngAfterViewInit() {
  //   (<any>$('#ravenue')).sparkline([6, 10, 9, 11, 9, 10, 12], {
  //     type: 'bar',
  //     height: '55',
  //     barWidth: '4',
  //     width: '100%',
  //     resize: true,
  //     barSpacing: '8',
  //     barColor: '#2961ff'
  //   });

  //   const chart = c3.generate({
  //     bindto: '#foo',
  //     data: {
  //       columns: [['data', 91.4]],
  //       type: 'gauge'
  //     },
  //     gauge: {
  //       label: {
  //         format: function(value, ratio) {
  //           return value;
  //         },
  //         show: false
  //       },
  //       min: 0,
  //       max: 100,
  //       units: ' %',
  //       width: 15
  //     },
  //     legend: {
  //       hide: true
  //     },
  //     size: {
  //       height: 80
  //     },
  //     color: {
  //       pattern: ['#7e74fb']
  //     }
  //   });
  // }
}
