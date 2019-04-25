import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { DashboardService } from '../../services/dashboard.service';
declare var require: any;
// const data: any = require('./data.json');




@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  stats: any = {};

  dt: any;
  _data: any = {};

  lineChart: any = {};
  constructor(private apiService: DashboardService ) {
   }



  ngOnInit() {
    console.log('works...');
    // this.chartInit();
  }

  // chartInit() {
  //   this.apiService.getStats().subscribe(resp => {
  //     this.stats = resp;
  //     this._data = this.stats.line;
  //     console.log('use data', this._data);
  //     this.lineChart.type = 'Line';
  //     this.lineChart.data = this._data,
  //     this.lineChart.options = {
  //       low: 0,
  //       high: 200,
  //       showArea: true,
  //       fullWidth: true,
  //       axisY: {
  //         onlyInteger: true,
  //         scaleMinSpace: 40,
  //         offset: 20,
  //         labelInterpolationFnc: function(value: number): string {
  //           return value / 5 + 'k';
  //         }
  //       }
  //     };
  //   });

  // }

}
