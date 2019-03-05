import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { GetSolutionService } from '../get-solution.service';
import { OptimizeService } from './optimize.service';
import { Units } from '../Classes';
import { LoadCaseService as LoadCaseService1 } from '../../../PinchTool-V1/pinch-form/load-case.service'
import { LoadCaseService as LoadCaseService2 } from '../../../PinchTool-V1/pinch-form2/load-case.service'
import { Router } from '@angular/router';
import { PinchCalculationService } from '../../pinch-form/pinch-calculation.service';
import { PinchCalculation2Service} from '../../pinch-form2/pinch-calculation2.service';


@Component({
  selector: 'app-optimize-t',
  templateUrl:'./optimize-t.component.html',
  styles: ['./optimize-t.component.css']
})
export class OptimizeTComponent implements OnInit {

  optimizeForm:FormGroup;
  coldUtilityStreams;
  hotUtilityStreams;

  HotUtilitiesCost:FormArray;
  ColdUtilitiesCost:FormArray;

  chartData;

  OptimumTDiagramOptions;
  OptimumTDiagramData;

  Units = new Units()
  
  
  constructor(private fb: FormBuilder, 
              private gs:GetSolutionService, 
              private optimize:OptimizeService,
              private lc1: LoadCaseService1,
              private lc2: LoadCaseService2,
              private router: Router,
              private _PC1: PinchCalculationService,
              private _PC2:PinchCalculation2Service,
              private SolutionService: GetSolutionService,) { }

  ngOnInit() {
    this.coldUtilityStreams = this.gs.body.coldUtilityStreams
    this.hotUtilityStreams = this.gs.body.hotUtilityStreams

    if (this.gs.body.Units === 0) {
      this.Units.temperature = "°C"
      this.Units.duty = "MM Kcal/hr"
    }
    else if (this.gs.body.Units === 1) {
      this.Units.temperature = "°F"
      this.Units.duty = "MM BTU/hr"
    }
    
    this.optimizeForm = this.fb.group({
      CapitalCost: [500000000, Validators.required],
      LifeTime: [175200,Validators.required],
      HotUtilitiesCost: this.fb.array([]),
      ColdUtilitiesCost: this.fb.array([]),      
    })

    this.HotUtilitiesCost = this.optimizeForm.get('HotUtilitiesCost') as FormArray;
    this.ColdUtilitiesCost = this.optimizeForm.get('ColdUtilitiesCost') as FormArray;
    
    var a = [200,150,100,90];
    var b = [50,20,30,20,20,30];
    
    for( let i = 0; i< this.coldUtilityStreams.length; i++) {
      this.ColdUtilitiesCost.push( this.fb.group({
        Name: [this.coldUtilityStreams[i].Name],
        Cost: [b[i], Validators.required]
      }))
    }

    for( let i = 0; i< this.hotUtilityStreams.length; i++) {
      this.HotUtilitiesCost.push( this.fb.group({
        Name: [this.hotUtilityStreams[i].Name],
        Cost: [a[i], Validators.required]
      }))
    }
    //this.HotStreams.push(this.createItem('hot'));
  }

  SaveData(data) {
    for( let i = 0; i< this.ColdUtilitiesCost.length; i++) {
      this.coldUtilityStreams[i].Cost = data.ColdUtilitiesCost[i].Cost
    }

    for( let i = 0; i< this.HotUtilitiesCost.length; i++) {
      this.hotUtilityStreams[i].Cost = data.HotUtilitiesCost[i].Cost
    }
    this.gs.body.LifeTime = data.LifeTime;
    this.gs.body.DollarPerUA = data.CapitalCost;
    this.gs.body.optimize = true;
    
    this.SendDataStreams();
  }

  SendDataStreams() {
    if (this.gs.body !== undefined) {
      const service = this.optimize.postStreamsOptimize(this.gs.body);
      service.subscribe(res => {
      this.chartData = res.json();
      this.ShowChart();
      }); 
    }  
    else {
      const service = this.optimize.postStreamsOptimize(this.gs.body);
      service.subscribe(res => {
      this.chartData = res.json();
      this.ShowChart();
      }); 
    }
  }

  ShowChart() {
      this.OptimumTDiagramOptions = {
          chart: {
              type: 'lineChart',
              height: 800,
              margin: {
                  top: 20,
                  right: 20,
                  bottom: 40,
                  left: 55
              },
              x: function(d) { return d.x },
              y: function(d) { return d.y },
              useInteractiveGuideline: false,
              xAxis: {
                  axisLabel: 'Approach T '+ this.Units.temperature,
              },
              yAxis: {
                  axisLabel: '$/h',
                  tickFormat: function(d) {
                      return d3.format('.00f')(d);
                  },
                  axisLabelDistance: -10,
              },
              // padData: true,
              //xDomain: this.HT_xDomain,
              //yDomain: this.HT_yDomain,
              showXAxis: true,
              showYAxis: true,
              useVoronoi: true,
              clipVoronoi: true,
              showLegend: false,
          },
      };
      //this.HT_DiagramOptions2.chart.useVoronoi = false
      var OPT = this.chartData.optimumT;

      this.OptimumTDiagramData =
          [{
              values: this.chartData.capexLine,
              key: 'CAPEX  || $/h = ',
              color: '#FE2D00',
          },
          {
              values: this.chartData.opexLine,
              key: 'OPEX || $/h= ',
              color: '#0692F2',
          },
          {
              values: this.chartData.totalCostLine,
              key: 'Total Cost || $/h= ',
              color: '#36ea00',
          },
          {
            values: [{x:0,y:OPT.y},{x:OPT.x,y:OPT.y},{x:OPT.x,y:0}],
            key: 'Optimum Temp',
            color: '#b3eaad',
        }];
  }

  LoadOptimumCase() {
    this.gs.body.Approach= this.chartData.optimumT.x;
    this.gs.body.optimize = false;
    let PCBody = this.gs.body;
    if (this.gs.body.hotStreams !== undefined) {
      const service = this._PC1.postData(PCBody, PCBody.hotStreams,PCBody.coldStreams, PCBody.DutyType, PCBody.Utilities);
      this.SolutionService.body = service.body;
      service.response.subscribe(res => {
          this.SolutionService.response = res;
          this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
      });
    }
    else {
      const service = this._PC2.postData(PCBody, PCBody.DutyType,PCBody.Exchangers, PCBody.Utilities);
      this.SolutionService.body = service.body;
      service.response.subscribe(res => {
          this.SolutionService.response = res;
          this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
      });
    }

  }
}
