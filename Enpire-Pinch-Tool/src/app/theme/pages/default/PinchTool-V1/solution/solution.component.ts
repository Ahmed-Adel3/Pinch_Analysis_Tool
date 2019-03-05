import { Component, OnInit, ViewChild, ElementRef, ComponentRef } from '@angular/core';
import { GetSolutionService } from './get-solution.service';
import { Solution, Units, Point } from './Classes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response } from '@angular/http';
import { saveSvgAsPng, svgAsPngUri, svgAsDataUri } from 'save-svg-As-Png'
import { svg } from 'd3';
import { Router } from '@angular/router';
import { AccountDataService } from '../../../../layouts/header-nav/account-data.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SaveCaseService } from './save-case.service';
import { LoadCaseService as LoadCaseService1 } from '../pinch-form/load-case.service'
import { LoadCaseService as LoadCaseService2 } from '../pinch-form2/load-case.service'

declare var Stimulsoft: any;

@Component({
    selector: 'app-solution',
    templateUrl: './solution.component.html',
    styleUrls: ['./solution.component.css']
})
export class SolutionComponent implements OnInit {

    HT_DiagramOptions;
    HT_DiagramOptions2;

    HT_DiagramData;
    GCC_DiagramOptions;
    GCC_DiagramOptions2;

    GCC_DiagramData;
    Grid_DiagramOptions;
    Grid_DiagramOptions2;

    Grid_DiagramData;
    body;

    hotPoints;
    coldPoints;
    GccPoints;
    HotUtilities = new Array();
    ColdUtilities= new Array();
    HotUtilitiesResult;
    ColdUtilitiesResult;
    StreamsWithUtilities;

    ShiftedHotUtilities;
    ShiftedColdUtilities;

    Units = new Units();
    res;

    HT_xDomain;
    HT_yDomain;
    GCC_xDomain;
    GCC_yDomain;

    pinchPointArr;

    HT_img;
    GCC_img;
    Grid_img;

    username;
    email;

    caseId = '';

    // Reactive forms for chart comments 
    THCommentForm: FormGroup;
    GCCCommentForm: FormGroup;
    GridCommentForm: FormGroup;
    THComment: string = '';
    GCCComment: string = '';
    GridComment: string = '';

    //ReactiveForm for Report pages -->Checkbox
    ReportPagesForm: FormGroup;
    ReportPages = [
        { name: 'Input Data', selected: false },
        { name: 'T-H Diagram', selected: false },
        { name: 'GCC Diagram', selected: false },
        { name: 'Grid Diagram', selected: false }
    ]
    boxesChecked;

    viewer: any = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
    report: any = new Stimulsoft.Report.StiReport();

    solution = new Solution();

    saveCaseButtonDisabled = false;

    flagForComment = 0;

    private ComponentRef: ComponentRef<Component>;

    constructor(private SolutionService: GetSolutionService,
        private http: Http,
        private router: Router,
        private _aData: AccountDataService,
        private fb: FormBuilder,
        private sc: SaveCaseService,
        private lc1:LoadCaseService1,
        private lc2:LoadCaseService2 ) { 
        }

    ngOnInit() {
        this.res = this.SolutionService.response;
        if (this.res === undefined) { 
                this.router.navigate(['']);
         }
        else{
        this.GetDataFromResponse();
        this.body = this.SolutionService.body;

        if (this.solution.Units === 0) {
            this.Units.temperature = "°C"
            this.Units.duty = "MM Kcal/hr"
        }
        else if (this.solution.Units === 1) {
            this.Units.temperature = "°F"
            this.Units.duty = "MM BTU/hr"
        }
        this.map_Points();
        this.getUtilitiesResults();
        this.pinchPointArr = this.get_pinchPoint()
        let GCC_Domain = this.get_Domains([...this.GccPoints,
        ...this.HotUtilities.map(a => { let obj = { x: a.point1.x, y: a.point1.y }; return obj }),
        ...this.HotUtilities.map(a => { let obj = { x: a.point2.x, y: a.point2.y }; return obj }),
        ]);
        let hot_HT_Domain = this.get_Domains(this.hotPoints)
        let cold_HT_Domain = this.get_Domains(this.coldPoints)
        let final_Domain_HT = this.get_largest_border(hot_HT_Domain, cold_HT_Domain)

        this.HT_xDomain = final_Domain_HT[0];
        this.HT_yDomain = final_Domain_HT[1];

        this.GCC_xDomain = GCC_Domain[0];
        this.GCC_yDomain = GCC_Domain[1];

        this.draw_HT_Diagram();
        this.draw_GCC_Diagram();
        this.draw_Grid_Diagram();

        this._aData.getData().subscribe(data => {
            this.username = data.userName;
            this.email = data.email;
        });

        this.THCommentForm = this.fb.group({ comment: [null] })
        this.GCCCommentForm = this.fb.group({ comment: [null] })
        this.GridCommentForm = this.fb.group({ comment: [null] })

        const arr = this.ReportPages.map(page => new FormControl(page.selected));
        this.ReportPagesForm = this.fb.group({ ReportPages: new FormArray(arr, this.minSelectedCheckboxes(1)) })
     }
    }

    GetDataFromResponse() {
        this.solution.IntervalTemp = this.res.json()['intervalTemp'];
        this.solution.HotIntervalTemp = this.res.json()['hotIntervalTemp'];
        this.solution.ColdIntervalTemp = this.res.json()['coldIntervalTemp'];
        this.solution.Qhot = this.res.json()['qhot'];
        this.solution.Qcold = this.res.json()['qcold'];
        this.solution.CurrentQhot = this.res.json()['currentQhot'];
        this.solution.CurrentQcold = this.res.json()['currentQcold'];
        this.solution.MaxHeatRecovery = this.res.json()['maxHeatRecovery'];
        this.solution.CurrentHeatRecovery = this.res.json()['currentHeatRecovery'];
        this.solution.CurrentApproachTemp = this.res.json()['currentApproachTemp'];
        
        this.solution.Units = this.res.json()['units'];
        this.solution.HT_hotPoints = this.res.json()['hT_hotPoints'];
        this.solution.HT_coldPoints = this.res.json()['hT_coldPoints'];
        this.solution.GCC_Points = this.res.json()['gcC_Points'];
        this.solution.Grid_Points = this.res.json()['grid_Points'];

    }

    map_Points() {
        this.hotPoints = this.solution.HT_hotPoints.map(a => { const obj = { x: Math.round((a.x / 1000000) * 10) / 10, y: a.y }; return obj })
        this.coldPoints = this.solution.HT_coldPoints.map(a => { const obj = { x: Math.round((a.x / 1000000) * 10) / 10, y: a.y }; return obj })

        this.GccPoints = this.solution.GCC_Points.gccPoints.map(a => { const obj = { x: Math.round((a.x / 1000000) * 10) / 10, y: a.y }; return obj })
        this.HotUtilities = this.solution.GCC_Points.hotUtilities;
        this.ColdUtilities = this.solution.GCC_Points.coldUtilities;
        
        this.ShiftedHotUtilities = this.solution.GCC_Points.shiftedHotUtilities;
        this.ShiftedColdUtilities = this.solution.GCC_Points.shiftedColdUtilities;
    }

    getUtilitiesResults(){
        if(this.body.Exchangers === undefined) {
            var st = [...this.body.hotStreams.filter(a=>a.Utility!==""),...this.body.coldStreams.filter(a=>a.Utility!=="")]
            this.StreamsWithUtilities = st.map ( a=> { const obj = { Duty:a.Duty,Utility:a.Utility }; return obj})
        } else {
            this.StreamsWithUtilities = this.body.Exchangers.filter(a=>a.Utility!=="").map( a=> { const obj = { Duty:a.Duty,Utility:a.Utility }; return obj})
        }

        this.HotUtilitiesResult = this.HotUtilities.map( a=> { 
            var currD = 0;
            this.StreamsWithUtilities.forEach(b => {
                if (b.Utility === a.name ) currD+=b.Duty/1000000
            });
            const obj = { name:a.name, optimumDuty:(a.point2.x - a.point1.x).toFixed(2), currentDuty:currD.toFixed(2)}; 
            return obj}).reverse()


        this.ColdUtilitiesResult = this.ColdUtilities.map( a=> { 
            var currD = 0;
            this.StreamsWithUtilities.forEach(b => {
                if (b.Utility === a.name ) currD+=b.Duty/1000000
            });
            const obj = { name:a.name, optimumDuty:(a.point2.x - a.point1.x).toFixed(2), currentDuty:currD.toFixed(2)}; 
            return obj})
    }

    get_Domains(points: Point[]) {
        let topX = Math.max.apply(Math, points.map(a => a.x));
        let bottomX = Math.min.apply(Math, points.map(a => a.x));
        let topY = Math.max.apply(Math, points.map(a => a.y));
        let bottomY = Math.min.apply(Math, points.map(a => a.y));

        let shiftX = Math.round(topX - bottomX) / 10;
        let shiftY = Math.round(topY - bottomY) / 10;

        return [[0, Math.round(topX + shiftX)], [Math.round(bottomY - shiftY), Math.round(topY + shiftY)]];
    }

    get_largest_border(...Args) {
        let topX = Math.round(Math.max.apply(Math, Args.map(a => a[0][1])) * 10) / 10;
        let bottomX = Math.round(Math.min.apply(Math, Args.map(a => a[0][0])) * 10) / 10;
        let topY = Math.round(Math.max.apply(Math, Args.map(a => a[1][1])) * 10) / 10;
        let bottomY = Math.round(Math.min.apply(Math, Args.map(a => a[1][0])) * 10) / 10;

        return [[bottomX, topX], [bottomY, topY]];
    }

    get_pinchPoint() {
        let xh, xc;
        let yh = this.solution.HotIntervalTemp;
        let yc = this.solution.ColdIntervalTemp;

        let PointH = this.hotPoints.find(a => a.y === yh)

        if (PointH !== undefined) {
            xh = PointH.x;
            xc = xh;
            return [new Point(xh, yh), new Point(xc, yc)];
        } else {
            return [new Point(0, 0), new Point(0, 0)]
        }
    }

    draw_HT_Diagram() {

        this.HT_DiagramOptions = {
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
                    axisLabel: 'Enthalpy, ' + this.Units.duty
                },
                yAxis: {
                    axisLabel: 'Temperature, ' + this.Units.temperature,
                    tickFormat: function(d) {
                        return d3.format('.00f')(d);
                    },
                    axisLabelDistance: -10,
                },
                // padData: true,
                xDomain: this.HT_xDomain,
                yDomain: this.HT_yDomain,
                showXAxis: true,
                showYAxis: true,
                useVoronoi: true,
                clipVoronoi: true,
                showLegend: false
            },

        };
        this.HT_DiagramOptions2 = JSON.parse(JSON.stringify(this.HT_DiagramOptions))
        this.HT_DiagramOptions2.chart.useVoronoi = false

        this.HT_DiagramData =
            [{
                values: this.hotPoints,
                key: 'Hot Streams || Temp= ',
                color: '#FE2D00',
            },
            {
                values: this.coldPoints,
                key: 'Cold Streams || Temp= ',
                color: '#0692F2',
            },
            {
                values: this.pinchPointArr,
                key: 'Pinch Point || Temp= ',
                color: '#36ea00',
            }];
    }

    draw_GCC_Diagram() {

        this.GCC_DiagramOptions = {
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
                y: function(d) { return d.y; },
                useInteractiveGuideline: false,
                xAxis: {
                    axisLabel: 'Enthalpy, ' + this.Units.duty
                },
                yAxis: {
                    axisLabel: 'Temperature, ' + this.Units.temperature,
                    tickFormat: function(d) {
                        return d3.format('.f')(d);
                    },
                    axisLabelDistance: -10
                },
                // padData: true,
                xDomain: this.GCC_xDomain,
                yDomain: this.GCC_yDomain,
                useVoronoi: true,
                showLegend: false,
            }
        };

        this.GCC_DiagramOptions2 = JSON.parse(JSON.stringify(this.GCC_DiagramOptions))
        this.GCC_DiagramOptions2.chart.useVoronoi = false

        let GCCDiagramLines = [];
        let pointsLine = {
            values: this.GccPoints,
            key: 'GCC Line || Temp= ',
            color: '#0f7200'
        }
        this.RoundGccValues(this.HotUtilities)
        this.RoundGccValues(this.ColdUtilities)
        this.RoundGccValues(this.ShiftedHotUtilities)
        this.RoundGccValues(this.ShiftedColdUtilities)
               
        let hotUtilityLines = this.HotUtilities.map((a) => { const obj = { values: [a.point1, a.point2], key: a.name + ' (' + (a.point2.x - a.point1.x).toFixed(2) + ' ' + this.Units.duty + ') at Temp= ', color: '#ff0000' }; return obj })
        let coldUtilityLines = this.ColdUtilities.map((a) => { const obj = { values: [a.point1, a.point2], key: a.name + ' (' + (a.point2.x - a.point1.x).toFixed(2) + ' ' + this.Units.duty + ') at Temp= ', color: '#00bbff' }; return obj })
        let shiftedHotUtilityLines = this.ShiftedHotUtilities.map((a) => { const obj = { values: [a.point1, a.point2], key: 'Shifted: ' + a.name + ' (' + (a.point2.x - a.point1.x).toFixed(2) + ' ' + this.Units.duty + ') at Temp= ', color: '#840000' }; return obj })
        let shiftedColdUtilityLines = this.ShiftedColdUtilities.map((a) => { const obj = { values: [a.point1, a.point2], key: 'Shifted: ' + a.name + ' (' + (a.point2.x - a.point1.x).toFixed(2) + ' ' + this.Units.duty + ') at Temp= ', color: '#0316bf' }; return obj })

        GCCDiagramLines = [pointsLine, ...hotUtilityLines, ...coldUtilityLines, ...shiftedHotUtilityLines, ...shiftedColdUtilityLines]
        this.GCC_DiagramData = GCCDiagramLines.filter(a => a.values[0].x !== a.values[1].x);
    }

    RoundGccValues(array) {
        array.forEach(a => {
            a.point1.x=a.point1.x.toFixed(2);
            a.point1.y=a.point1.y.toFixed(2);
            a.point2.x=a.point2.x.toFixed(2);
            a.point2.y=a.point2.y.toFixed(2); });    
    }

    draw_Grid_Diagram() {
        let count = this.solution.Grid_Points.hotStreamsConnected.length +
            this.solution.Grid_Points.hotStreamsNotConnected.length +
            this.solution.Grid_Points.coldStreamsConnected.length +
            this.solution.Grid_Points.coldStreamsNotConnected.length


        let indexNameMatch = this.solution.Grid_Points.indexNameMatch
        let xValues1 = Object.values(indexNameMatch);

        this.Grid_DiagramOptions = {
            chart: {
                type: 'multiChart',
                height: 900,
                margin: {
                    top: 50,
                    right: 80,
                    bottom: 150,
                    left: 80
                },
                color: d3.scale.category10().range(),
                xAxis: {
                    tickValues: Array.from({ length: xValues1.length }, (v, k) => k + 1),
                    showMaxMin: false,
                    rotateLabels: -45,
                    axisLabel: "Streams",
                    tickFormat: function(d) {
                        return indexNameMatch[d];
                    },

                },
                yAxis1: {
                    ticks: 20,
                    axisLabel: "Temperature " + this.Units.temperature,
                    tickFormat: function(d) {
                        return d3.format(',f')(d);
                    },

                },
                yAxis2: {
                    ticks: 20,
                    axisLabel: "Duty " + this.Units.duty,
                    tickFormat: function(d) {
                        return d3.format(',0f')(d / 1000000);
                    }
                },
                showLegend: false,
                padData: true,
                useVoronoi: true,
            }
        };

        this.Grid_DiagramOptions2 = {
            chart: {
                type: 'multiChart',
                height: 900,
                margin: {
                    top: 50,
                    right: 80,
                    bottom: 150,
                    left: 80
                },
                color: d3.scale.category10().range(),
                xAxis: {
                    tickValues: Array.from({ length: xValues1.length }, (v, k) => k + 1),
                    showMaxMin: false,
                    rotateLabels: -45,
                    axisLabel: "Heat Exchanger",
                    tickFormat: function(d) {
                        return indexNameMatch[d];
                    },

                },
                yAxis1: {
                    ticks: 20,
                    axisLabel: "Temperature " + this.Units.temperature,
                    tickFormat: function(d) {
                        return d3.format(',f')(d);
                    },

                },
                yAxis2: {
                    ticks: 20,
                    axisLabel: "Duty " + this.Units.duty,
                    tickFormat: function(d) {
                        return d3.format(',0f')(d / 1000000);
                    }
                },
                showLegend: false,
                padData: true,
                useVoronoi: false,
            }
        };
        this.Grid_DiagramData = this.solution.FillProperties(this.solution.Grid_Points, count);
    }

    manipulateComment(chart: string, e) {
        if (this.flagForComment === 0) {
            this.saveCase(chart, e);
            this.flagForComment = 1;
        }
        else {
            this.showAndSaveComment(chart, e)
        }
    }

    showAndSaveComment(chart: string, e) {
        switch (chart) {
            case "TH":
                if (e !== '') { this.THComment = e['comment'] } else this.THComment = '';
                break;

            case "GCC":
                if (e !== '') { this.GCCComment = e['comment'] } else this.GCCComment = '';
                break;

            case "Grid":
                if (e !== '') { this.GridComment = e['comment'] } else this.GridComment = '';
                break;
        }
        this.sc.saveComment(this.caseId, e['comment'], chart).subscribe(data => { }, error => { });
    }

    submitReportPages(e) {
        this.boxesChecked = e.ReportPages
    }

    generateReport() {
        this.ExportImageForReport();
        document.getElementById('generateReport').classList.add('m-loader', 'm-loader--light', 'm-loader--right');
        this.SetTimeOutFunction();
        this.SetTimeOutFunction();
    }

    ExportImageForReport() {
        d3.selectAll(".nv-group,rect").style("fill-opacity", "0");
        d3.selectAll(".nvd3 .nv-background").style("fill", "white");

        d3.select("svg").style("font-family", "Arial");

        let svg0 = document.getElementsByTagName("svg")[0]
        let svg1 = document.getElementsByTagName("svg")[1]
        let svg2 = document.getElementsByTagName("svg")[2]

        svgAsPngUri(svg0, { scale: 1, encoderOptions: 1, /*height:1000,width:0 */ }, (uri) => {
            this.HT_img = uri
        });

        svgAsPngUri(svg1, { scale: 1, encoderOptions: 1, /*height:0.8,width:0.8*/ }, (uri) => {
            this.GCC_img = uri
        });

        svgAsPngUri(svg2, { scale: 1, encoderOptions: 1, /*height:0.8,width:0.8*/ }, (uri) => {
            this.Grid_img = uri
        });
    }

    ExportImage(name: string) {

        let time: number = (name === "Grid") ? 3000 : 500;

        d3.selectAll(".nv-group,rect").style("fill-opacity", "0");
        d3.selectAll(".nvd3 .nv-background").style("fill", "white");
        d3.select("svg").style("font-family", "Arial");

        let svg = document.getElementsByTagName("svg")[0]

        let voroniTags = svg.getElementsByClassName("nv-point-paths")

        for (let i = 0; i < voroniTags.length; i++) {
            voroniTags[i].setAttribute("visibility", "hidden");
        }
        saveSvgAsPng(svg, name + "-diagram.png", { scale: 1, });

        setTimeout(() => {
            for (let i = 0; i < voroniTags.length; i++) {
                voroniTags[i].setAttribute("visibility", "visible");
            }
        }, time)
    }

    SetTimeOutFunction() {
        let sol = this.solution;
        let fileName = "";
        let dataSet: any;

        let UtilitiesDuties = [...this.HotUtilities, ...this.ColdUtilities];
        let UtilitiesMapped = UtilitiesDuties.map(a => { let obj = { Name: a.name, Duty: (a.point2.x - a.point1.x).toFixed(2) }; return obj })

        let rep = this.report;

        setTimeout(() => {

            if (this.body.hotStreams !== undefined) {
                let HS = this.body.hotStreams.map(a => { let obj = { Name: a.Name, Supply: a.Supply, Target: a.Target, Duty: Math.round((a.Duty / 1000000) * 10) / 10, Utility: a.Utility }; return obj });
                let CS = this.body.coldStreams.map(a => { let obj = { Name: a.Name, Supply: a.Supply, Target: a.Target, Duty: Math.round((a.Duty / 1000000) * 10) / 10, Utility: a.Utility }; return obj });
                let Solution = {
                    BasicInfo: {
                        CaseName: this.body.CaseName,
                        CaseDescription: this.body.CaseDescription,
                        ApproachTemperature: this.body.Approach,
                    },
                    UtilitiesDuties: UtilitiesMapped,
                    Results: {
                        IntervalTemp: sol.IntervalTemp,
                        HotInterval: sol.HotIntervalTemp,
                        ColdInterval: sol.ColdIntervalTemp,
                        HotDuty: Math.round((sol.Qhot / 1000000) * 10) / 10,
                        ColdDuty: Math.round((sol.Qcold / 1000000) * 10) / 10,
                    },
                    Units: {
                        temperature: this.Units.temperature,
                        duty: this.Units.duty
                    },
                    HotStreams: HS,
                    ColdStreams: CS,
                    HotUtilities: this.body.hotUtilityStreams,
                    ColdUtilities: this.body.coldUtilityStreams,
                    Diagrams: {
                        HT_Diagram: this.HT_img,
                        GCC_Diagram: this.GCC_img,
                        Grid_Diagram: this.Grid_img,
                    },
                    UserData: {
                        username: this.username,
                        email: this.email
                    },
                    comments: {
                        THComment: this.THComment,
                        GCCComment: this.GCCComment,
                        GridComment: this.GridComment
                    }
                }
                rep.loadFile("./reports/ByStreamReport.mrt");
                this.removeReportPages(this.boxesChecked, rep, 0)
                dataSet = new Stimulsoft.System.Data.DataSet("Solution");
                dataSet.readJson(Solution);
                this.report.regData("Solution", "Solution", dataSet);
                this.viewer.report = rep;
                this.viewer.renderHtml("Report");
                document.getElementById('generateReport').classList.remove('m-loader', 'm-loader--light', 'm-loader--right');
            }
            else {
                let HE = this.body.Exchangers.map(a => {
                    let obj;
                    if (a.hotGroup !== undefined && a.coldGroup !== undefined) {
                        obj = { Name: a.Name, hotSupply: a.hotGroup.hotSupply, hotTarget: a.hotGroup.hotTarget, coldSupply: a.coldGroup.coldSupply, coldTarget: a.coldGroup.coldTarget, Duty: Math.round((a.Duty / 1000000) * 10) / 10, Type: "Heat Exchanger", Utility: a.UtilityMatch };
                    }
                    else if (a.hotGroup === undefined) {
                        obj = { Name: a.Name, hotSupply: "---", hotTarget: "---", coldSupply: a.coldGroup.coldSupply, coldTarget: a.coldGroup.coldTarget, Duty: Math.round((a.Duty / 1000000) * 10) / 10, Type: "Cooler", Utility: a.UtilityMatch };
                    }
                    else {
                        obj = { Name: a.Name, hotSupply: a.hotGroup.hotSupply, hotTarget: a.hotGroup.hotTarget, coldSupply: "---", coldTarget: "---", Duty: Math.round((a.Duty / 1000000) * 10) / 10, Type: "Heater", Utility: a.UtilityMatch };
                    }
                    return obj
                });

                let Solution = {
                    BasicInfo: {
                        CaseName: this.body.CaseName,
                        CaseDescription: this.body.CaseDescription,
                        ApproachTemperature: this.body.Approach
                    },
                    HotUtilities: this.body.hotUtilityStreams,
                    ColdUtilities: this.body.coldUtilityStreams,
                    UtilitiesDuties: UtilitiesMapped,
                    Results: {
                        IntervalTemp: sol.IntervalTemp,
                        HotInterval: sol.HotIntervalTemp,
                        ColdInterval: sol.ColdIntervalTemp,
                        HotDuty: Math.round((sol.Qhot / 1000000) * 10) / 10,
                        ColdDuty: Math.round((sol.Qcold / 1000000) * 10) / 10,
                    },
                    Units: {
                        temperature: this.Units.temperature,
                        duty: this.Units.duty
                    },
                    HeatExchangers: HE,
                    Diagrams: {
                        HT_Diagram: this.HT_img,
                        GCC_Diagram: this.GCC_img,
                        Grid_Diagram: this.Grid_img,
                    },
                    UserData: {
                        username: this.username,
                        email: this.email
                    },
                    comments: {
                        THComment: this.THComment,
                        GCCComment: this.GCCComment,
                        GridComment: this.GridComment
                    }
                }
                this.report.loadFile("./reports/ByExchangerReport.mrt");
                this.removeReportPages(this.boxesChecked, rep, 1)
                dataSet = new Stimulsoft.System.Data.DataSet("Solution");
                dataSet.readJson(Solution);
                this.report.regData("Solution", "Solution", dataSet);
                this.viewer.report = this.report;
                this.viewer.renderHtml("Report");
                document.getElementById('generateReport').classList.remove('m-loader', 'm-loader--light', 'm-loader--right');
            }
        }, 3000)
    }

    removeReportPages(arr, report, form) {
        if (this.HotUtilities.length < 1) report.pages.remove(report.pages.getByName("Hot_Utilities"))
        if (this.ColdUtilities.length < 1) report.pages.remove(report.pages.getByName("Cold_Utilities"))

        if (arr[0] === false && form === 0) {
            report.pages.remove(report.pages.getByName("Input_HS"));
            report.pages.remove(report.pages.getByName("Input_CS"));
            if (this.HotUtilities.length > 0) { report.pages.remove(report.pages.getByName("Hot_Utilities")); }
            if (this.ColdUtilities.length > 0) { report.pages.remove(report.pages.getByName("Cold_Utilities")); }
        }
        else if (arr[0] === false && form === 1) {
            report.pages.remove(report.pages.getByName("Input_S"));
            if (this.HotUtilities.length > 0) { report.pages.remove(report.pages.getByName("Hot_Utilities")); }
            if (this.ColdUtilities.length > 0) { report.pages.remove(report.pages.getByName("Cold_Utilities")); }
        }

        /*if (arr[1] === false) { report.pages.remove(report.pages.getByName("Results")); }*/
        if (arr[1] === false) { report.pages.remove(report.pages.getByName("T_H_Diagram")); }
        if (arr[2] === false) { report.pages.remove(report.pages.getByName("GCC_Diagram")); }
        if (arr[3] === false) { report.pages.remove(report.pages.getByName("Grid_Diagram")); }
    }

    minSelectedCheckboxes(min = 1) {
        const validator: ValidatorFn = (formArray: FormArray) => {
            const totalSelected = formArray.controls
                // get a list of checkbox values (boolean)
                .map(control => control.value)
                // total up the number of checked checkboxes
                .reduce((prev, next) => next ? prev + next : prev, 0);

            // if the total is not greater than the minimum, return the error message
            return totalSelected >= min ? null : { required: true };
        };

        return validator;
    }

    saveCase(chart: string, e) {
        this.sc.saveCase(this.SolutionService.body).subscribe(
            data => {
                this.caseId = data;
                this.showAndSaveComment(chart, e)
            },
            error => { });

        this.saveCaseButtonDisabled = true
    }

    BackToForm() {
        if (this.body.hotStreams !== undefined) {
            this.lc1.case = this.body;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byStream' }]);
        } else {
            this.lc2.case = this.body;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/byExchanger' }]);
        }
    }



}

