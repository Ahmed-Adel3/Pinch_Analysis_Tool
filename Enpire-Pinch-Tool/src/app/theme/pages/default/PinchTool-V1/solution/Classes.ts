import { style } from "@angular/core";

export class Solution {

    IntervalTemp: number;
    HotIntervalTemp: number;
    ColdIntervalTemp: number;
    Qhot: number;
    Qcold: number;
    CurrentQhot:number;
    CurrentQcold:number;
    MaxHeatRecovery:number;
    CurrentHeatRecovery:number;
    CurrentApproachTemp:number;
    Units: number;
    HT_hotPoints: Array<Point>;
    HT_coldPoints: Array<Point>;
    GCC_Points;

    Grid_Points;
    hotStreamsConnected;
    coldStreamsConnected;
    hotStreamsNotConnected;
    coldStreamsNotConnected;
    hotStreamsQ;
    coldStreamsQ;
    connectionLines;
    PinchLine;
    indexNameMatch;

    constructor() {
    }

    FillProperties(GridData, count) {
        this.hotStreamsConnected = GridData.hotStreamsConnected;
        this.coldStreamsConnected = GridData.coldStreamsConnected;
        this.hotStreamsNotConnected = GridData.hotStreamsNotConnected;
        this.coldStreamsNotConnected = GridData.coldStreamsNotConnected;
        this.hotStreamsQ = GridData.hotStreamsQ;
        this.coldStreamsQ = GridData.coldStreamsQ;
        this.connectionLines = GridData.connectionLines;
        this.PinchLine = GridData.pinchLine;

        let st = this.drawStreams();
        let Q = this.drawQ();

        let first1 = { "values": [{ "x": 0, "y": 0 }, { "x": 0, "y": 0 }], "type": "line", "yAxis": 1, "key": "DEMO_F1", "color": "#000000", "strokeWidth": 0 }
        let last1 = { "values": [{ "x": count + 1, "y": 0 }, { "x": count + 1, "y": 0 }], "type": "line", "yAxis": 1, "key": "DEMO_L1", "color": "#000000", "strokeWidth": 0 }
        let first2 = { "values": [{ "x": 0, "y": 0 }, { "x": 0, "y": 0 }], "type": "line", "yAxis": 2, "key": "(0,0)", "color": "#000000", "strokeWidth": 0 }
        let last2 = { "values": [{ "x": count + 1, "y": 0 }, { "x": count + 1, "y": 0 }], "type": "line", "yAxis": 2, "key": "(0," + (count + 1) + ")", "color": "#000000", "strokeWidth": 0 }

        let dataArr = [first1, last1, first2, last2, ...st[0], ...st[1], ...st[2], ...st[3], ...st[4], ...st[5], ...Q[0], ...Q[1]];
        return dataArr;
    }

    drawStreams() {
        let streams = [];
        streams.push(this.hotStreamsConnected.map((a, index) => { const obj = { "values": [a.streamIn, a.streamOut], type: "line", yAxis: 1, "key": a.streamIn.x + ' HC', "color": '#DD120D', strokeWidth: 14 }; return obj }))
        streams.push(this.coldStreamsConnected.map((a, index) => { const obj = { "values": [a.streamIn, a.streamOut], type: "line", yAxis: 1, "key": a.streamIn.x + ' CC', "color": '#1120FB', strokeWidth: 14 }; return obj }))
        streams.push(this.hotStreamsNotConnected.map((a, index) => { const obj = { "values": [a.streamIn, a.streamOut], type: "line", yAxis: 1, "key": a.streamIn.x + ' HN', "color": '#770402', strokeWidth: 14 }; return obj }))
        streams.push(this.coldStreamsNotConnected.map((a, index) => { const obj = { "values": [a.streamIn, a.streamOut], type: "line", yAxis: 1, "key": a.streamIn.x + ' CN', "color": '#00065b', strokeWidth: 14 }; return obj }))
        streams.push(this.connectionLines.map((a, index) => { const obj = { "values": [a.midpointHot, a.upperMiddle, a.lowerMiddle, a.midpointCold], type: "line", yAxis: 1, "key": a.midpointHot.x + ' CL', "color": '#ff7f0e', classed: 'dashed' }; return obj }))
        streams.push({ "values": [this.PinchLine.midpointHot, this.PinchLine.upperMiddle, this.PinchLine.lowerMiddle, this.PinchLine.midpointCold], type: "line", yAxis: 1, "key": this.PinchLine.midpointHot.x + ' PL', "color": '#000000', classed: 'dashed' })
        return streams;
    }

    drawQ() {
        let Qlines = [];
        Qlines.push(this.hotStreamsQ.map(a => { const obj = { "values": [a.dutyPoint1, a.dutyPoint2], type: "line", yAxis: 2, "key": a.dutyPoint1.x + ' HQ', color: '#FC9EA5', strokeWidth: 8 }; return obj }));
        Qlines.push(this.coldStreamsQ.map(a => { const obj = { "values": [a.dutyPoint1, a.dutyPoint2], type: "line", yAxis: 2, "key": a.dutyPoint1.x + ' CQ', color: '#BDD7EE', strokeWidth: 8 }; return obj }));
        return Qlines;
    }

}

export class Point {
    x: number;
    y: number;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y
    }
}

export class Units {
    temperature: string;
    duty: string;
}