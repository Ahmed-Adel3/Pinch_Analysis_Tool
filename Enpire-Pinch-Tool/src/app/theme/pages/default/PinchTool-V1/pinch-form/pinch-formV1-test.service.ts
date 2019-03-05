import { Injectable } from '@angular/core';
import { PinchCalculationService } from './pinch-calculation.service';
import { GetSolutionService } from '../solution/get-solution.service';
import { Router } from '@angular/router';

@Injectable()
export class PinchFormV1TestService {


    constructor(private _PC: PinchCalculationService,
        private SolutionService: GetSolutionService,
        private router: Router) {
    }

    body1 ={
        "hotStreams": [
          {
            "Name": "1r1",
            "Supply": 311,
            "Target": 280,
            "Duty": 20940000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r2o",
            "Supply": 339,
            "Target": 311,
            "Duty": 17100000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1ro",
            "Supply": 360,
            "Target": 339,
            "Duty": 18740000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r8",
            "Supply": 390,
            "Target": 360,
            "Duty": 16760000.000000002,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r7",
            "Supply": 400,
            "Target": 390,
            "Duty": 5480000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "ro",
            "Supply": 280,
            "Target": 225,
            "Duty": 20620000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "ro",
            "Supply": 225,
            "Target": 185,
            "Duty": 14800000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r0",
            "Supply": 152,
            "Target": 50,
            "Duty": 47960000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r8",
            "Supply": 145,
            "Target": 50,
            "Duty": 3600000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "ro",
            "Supply": 118,
            "Target": 48,
            "Duty": 1670000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "ro",
            "Supply": 121,
            "Target": 48,
            "Duty": 1760000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r0",
            "Supply": 118,
            "Target": 48,
            "Duty": 1120000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r1",
            "Supply": 52,
            "Target": 40,
            "Duty": 70000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1o1",
            "Supply": 332,
            "Target": 315,
            "Duty": 3230000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r1",
            "Supply": 140,
            "Target": 97,
            "Duty": 15120000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r5",
            "Supply": 124,
            "Target": 55,
            "Duty": 11010000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "155",
            "Supply": 221,
            "Target": 55,
            "Duty": 6510000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r6",
            "Supply": 55,
            "Target": 38,
            "Duty": 560000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "3r0",
            "Supply": 319,
            "Target": 262,
            "Duty": 2530000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "3r2",
            "Supply": 359,
            "Target": 305,
            "Duty": 1730000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "141",
            "Supply": 90,
            "Target": 55,
            "Duty": 3310000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "r00",
            "Supply": 55,
            "Target": 40,
            "Duty": 1060000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "180",
            "Supply": 304,
            "Target": 238,
            "Duty": 4960000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2f8",
            "Supply": 190,
            "Target": 104,
            "Duty": 3480000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2r1",
            "Supply": 65,
            "Target": 40,
            "Duty": 620000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2j0",
            "Supply": 66,
            "Target": 65,
            "Duty": 3880000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r6",
            "Supply": 225,
            "Target": 217,
            "Duty": 3000000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "195",
            "Supply": 217,
            "Target": 48,
            "Duty": 13880000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2j9",
            "Supply": 143,
            "Target": 54,
            "Duty": 3330000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2r0",
            "Supply": 54,
            "Target": 40,
            "Duty": 510000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2p4",
            "Supply": 48,
            "Target": 40,
            "Duty": 210000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "257",
            "Supply": 80,
            "Target": 48,
            "Duty": 3000000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r2",
            "Supply": 315,
            "Target": 293,
            "Duty": 4240000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "3l0",
            "Supply": 276,
            "Target": 232,
            "Duty": 2830000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "3r1",
            "Supply": 232,
            "Target": 90,
            "Duty": 6580000,
            "exchangerType": 0,
            "Utility": ""
          }
        ],
        "coldStreams": [
          {
            "Name": "1r6",
            "Supply": 142,
            "Target": 261,
            "Duty": 20940000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1m8",
            "Supply": 191,
            "Target": 309,
            "Duty": 17100000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r9",
            "Supply": 261,
            "Target": 330,
            "Duty": 18740000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1t0",
            "Supply": 268,
            "Target": 333,
            "Duty": 16760000.000000002,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1l2",
            "Supply": 303,
            "Target": 433,
            "Duty": 15680000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1m0",
            "Supply": 303,
            "Target": 372,
            "Duty": 9920000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1er4",
            "Supply": 355,
            "Target": 370,
            "Duty": 5480000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "tg0",
            "Supply": 52,
            "Target": 203,
            "Duty": 20620000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "7yr",
            "Supply": 80,
            "Target": 203,
            "Duty": 14800000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "gc84",
            "Supply": 43,
            "Target": 65,
            "Duty": 2460000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "10r",
            "Supply": 308,
            "Target": 378,
            "Duty": 20160000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1yr2",
            "Supply": 284,
            "Target": 307,
            "Duty": 3230000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1hgt9",
            "Supply": 216,
            "Target": 221,
            "Duty": 2530000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "1r9",
            "Supply": 293,
            "Target": 304,
            "Duty": 1730000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "yu23",
            "Supply": 179,
            "Target": 190,
            "Duty": 4960000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "20r",
            "Supply": 104,
            "Target": 160,
            "Duty": 4019999.9999999995,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2mn8",
            "Supply": 41,
            "Target": 104,
            "Duty": 3480000,
            "exchangerType": 0,
            "Utility": ""
          },
          {
            "Name": "2r5",
            "Supply": 135,
            "Target": 142,
            "Duty": 3000000,
            "exchangerType": 0,
            "Utility": ""
          }
        ],
        "Approach": 20,
        "CaseName": "Test Case 1",
        "CaseDescription": "",
        "DutyType": 0,
        "Units": 0,
        "Utilities":{
        "HotUtilities": [],
        "ColdUtilities": [],
        },
        "optimize": false,
        "LifeTime":175200,
        "DollarPerUA":500000000
      }

    body2= {
      "hotStreams": [
        {
          "Name": "339",
          "Supply": 139,
          "Target": 113,
          "Duty": 1010000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "407",
          "Supply": 89,
          "Target": 43,
          "Duty": 1060000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "545",
          "Supply": 89,
          "Target": 52,
          "Duty": 500000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "560",
          "Supply": 125,
          "Target": 46,
          "Duty": 20000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "570",
          "Supply": 73,
          "Target": 49,
          "Duty": 300000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "501",
          "Supply": 68,
          "Target": 63,
          "Duty": 9360000,
          "exchangerType": 1,
          "Utility": "Air Cooler"
        },
        {
          "Name": "504",
          "Supply": 63,
          "Target": 57,
          "Duty": 2640000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1301",
          "Supply": 440,
          "Target": 275,
          "Duty": 20002000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1303",
          "Supply": 275,
          "Target": 133,
          "Duty": 17756000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1503",
          "Supply": 85,
          "Target": 45,
          "Duty": 6660000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1709",
          "Supply": 210,
          "Target": 118,
          "Duty": 7370000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1609",
          "Supply": 118,
          "Target": 63,
          "Duty": 2073000,
          "exchangerType": 1,
          "Utility": "Air Cooler"
        },
        {
          "Name": "1609-1",
          "Supply": 63,
          "Target": 58,
          "Duty": 302000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1606",
          "Supply": 58,
          "Target": 35,
          "Duty": 97000,
          "exchangerType": 1,
          "Utility": "Air Cooler"
        },
        {
          "Name": "1702",
          "Supply": 91,
          "Target": 76,
          "Duty": 3270000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1712",
          "Supply": 108,
          "Target": 90,
          "Duty": 1385000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1105",
          "Supply": 120,
          "Target": 94,
          "Duty": 870000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1107",
          "Supply": 107,
          "Target": 49,
          "Duty": 234000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1114",
          "Supply": 73,
          "Target": 63,
          "Duty": 7121000,
          "exchangerType": 1,
          "Utility": "Air Cooler"
        },
        {
          "Name": "1114-1",
          "Supply": 63,
          "Target": 44,
          "Duty": 3240000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "vent",
          "Supply": 45,
          "Target": 44,
          "Duty": 292000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1205",
          "Supply": 205,
          "Target": 83,
          "Duty": 38690000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1206",
          "Supply": 83,
          "Target": 44,
          "Duty": 10480000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1301",
          "Supply": 67,
          "Target": 63,
          "Duty": 10700000,
          "exchangerType": 1,
          "Utility": "Air Cooler"
        },
        {
          "Name": "1302",
          "Supply": 63,
          "Target": 44,
          "Duty": 10000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1307",
          "Supply": 125,
          "Target": 44,
          "Duty": 75000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1403",
          "Supply": 46,
          "Target": 45,
          "Duty": 53000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1408",
          "Supply": 134,
          "Target": 49,
          "Duty": 3120000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1502",
          "Supply": 175,
          "Target": 150,
          "Duty": 4000000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1502-1",
          "Supply": 150,
          "Target": 77,
          "Duty": 1000000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1505",
          "Supply": 77,
          "Target": 49,
          "Duty": 70000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1508",
          "Supply": 182,
          "Target": 151,
          "Duty": 2020000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1509",
          "Supply": 151,
          "Target": 60,
          "Duty": 760000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "2101",
          "Supply": 120,
          "Target": 49,
          "Duty": 435000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "5111",
          "Supply": 110,
          "Target": 63,
          "Duty": 888000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1414",
          "Supply": 181,
          "Target": 180,
          "Duty": 2315000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "5102",
          "Supply": 180.9,
          "Target": 107,
          "Duty": 432000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1701",
          "Supply": 139,
          "Target": 55,
          "Duty": 3020000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1707",
          "Supply": 130,
          "Target": 55,
          "Duty": 1863000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        },
        {
          "Name": "1712",
          "Supply": 130,
          "Target": 44,
          "Duty": 65000,
          "exchangerType": 1,
          "Utility": "Water Cooler"
        }
      ],
      "coldStreams": [
        {
          "Name": "330",
          "Supply": 118,
          "Target": 162,
          "Duty": 1150000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "327",
          "Supply": 57,
          "Target": 119,
          "Duty": 1010000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "332",
          "Supply": 139,
          "Target": 143,
          "Duty": 3000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "452",
          "Supply": 115,
          "Target": 116,
          "Duty": 1000000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "553",
          "Supply": 125,
          "Target": 127,
          "Duty": 12640000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "1101",
          "Supply": 63,
          "Target": 64,
          "Duty": 1100000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "1102",
          "Supply": 63.1,
          "Target": 90,
          "Duty": 246000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "1511",
          "Supply": 99,
          "Target": 175,
          "Duty": 7370000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T1409 btm",
          "Supply": 200,
          "Target": 201,
          "Duty": 3190000,
          "exchangerType": 2,
          "Utility": "HP Steam"
        },
        {
          "Name": "TWS1",
          "Supply": 60,
          "Target": 85,
          "Duty": 3270000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1706",
          "Supply": 206,
          "Target": 215,
          "Duty": 972000,
          "exchangerType": 2,
          "Utility": "HP Steam"
        },
        {
          "Name": "TWS2",
          "Supply": 60,
          "Target": 85,
          "Duty": 1385000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2101 btm",
          "Supply": 120,
          "Target": 121,
          "Duty": 3280000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2102 btm",
          "Supply": 107,
          "Target": 108,
          "Duty": 3520000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "1213",
          "Supply": 49,
          "Target": 188,
          "Duty": 38690000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1214",
          "Supply": 188,
          "Target": 189,
          "Duty": 1050000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2301 btm",
          "Supply": 89,
          "Target": 90,
          "Duty": 11000000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "T2302 btm",
          "Supply": 125,
          "Target": 126,
          "Duty": 3250000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2401 btm",
          "Supply": 170,
          "Target": 171,
          "Duty": 1510000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2402 btm",
          "Supply": 197,
          "Target": 198,
          "Duty": 5080000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "1304",
          "Supply": 89,
          "Target": 120,
          "Duty": 2620000,
          "exchangerType": 2,
          "Utility": "LP Steam"
        },
        {
          "Name": "T2403 btm",
          "Supply": 184,
          "Target": 185,
          "Duty": 4570000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2103 btm",
          "Supply": 120,
          "Target": 121,
          "Duty": 1980000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T5501 btm",
          "Supply": 195,
          "Target": 196,
          "Duty": 3620000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2701 btm",
          "Supply": 175,
          "Target": 176,
          "Duty": 3140000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "T2702 btm",
          "Supply": 148,
          "Target": 149,
          "Duty": 2210000,
          "exchangerType": 2,
          "Utility": "MP Steam"
        },
        {
          "Name": "LP Steam",
          "Supply": 160,
          "Target": 161,
          "Duty": 8335000.000000001,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "BFW",
          "Supply": 95,
          "Target": 160,
          "Duty": 37758000,
          "exchangerType": 0,
          "Utility": ""
        }
      ],
      "Approach": 20,
      "CaseName": "New Test Case 2",
      "CaseDescription": "Description of Test Case 2",
      "DutyType": 0,
      "Units": 0,
      "Utilities":{
      "HotUtilities": [
        {
          "Name": "HP Steam",
          "Supply": 400,
          "Target": 399,
          "UtilityApproach": 100
        },
        {
          "Name": "MP Steam",
          "Supply": 280,
          "Target": 279,
          "UtilityApproach": 10
        },
        {
          "Name": "LP Steam",
          "Supply": 160,
          "Target": 159,
          "UtilityApproach": 10
        }
      ],
      "ColdUtilities": [
        {
          "Name": "BFW Heater",
          "Supply": 95,
          "Target": 96,
          "UtilityApproach": 10
        },
        {
          "Name": "Air Cooler",
          "Supply": 50,
          "Target": 70,
          "UtilityApproach": 20
        },
        {
          "Name": "Water Cooler",
          "Supply": 35,
          "Target": 45,
          "UtilityApproach": 10
        },
        {
          "Name": "Chilled Water",
          "Supply": 20,
          "Target": 25,
          "UtilityApproach": 5
        }
      ],
      },
      "optimize": false
    }

    body4= {
      "hotStreams": [
        {
          "Name": "339",
          "Supply": 139,
          "Target": 113,
          "Duty": 1010000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "407",
          "Supply": 89,
          "Target": 43,
          "Duty": 1060000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "545",
          "Supply": 89,
          "Target": 52,
          "Duty": 500000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "560",
          "Supply": 125,
          "Target": 46,
          "Duty": 20000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "570",
          "Supply": 73,
          "Target": 49,
          "Duty": 300000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "501",
          "Supply": 68,
          "Target": 63,
          "Duty": 9360000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "504",
          "Supply": 63,
          "Target": 57,
          "Duty": 2640000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1301",
          "Supply": 440,
          "Target": 275,
          "Duty": 20002000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1303",
          "Supply": 275,
          "Target": 133,
          "Duty": 17756000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1503",
          "Supply": 85,
          "Target": 45,
          "Duty": 6660000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1709",
          "Supply": 210,
          "Target": 118,
          "Duty": 7370000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1609",
          "Supply": 118,
          "Target": 63,
          "Duty": 2073000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1609-1",
          "Supply": 63,
          "Target": 58,
          "Duty": 302000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1606",
          "Supply": 58,
          "Target": 35,
          "Duty": 97000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1702",
          "Supply": 91,
          "Target": 76,
          "Duty": 3270000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1712",
          "Supply": 108,
          "Target": 90,
          "Duty": 1385000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1105",
          "Supply": 120,
          "Target": 94,
          "Duty": 870000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1107",
          "Supply": 107,
          "Target": 49,
          "Duty": 234000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1114",
          "Supply": 73,
          "Target": 63,
          "Duty": 7121000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1114-1",
          "Supply": 63,
          "Target": 44,
          "Duty": 3240000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "vent",
          "Supply": 44.1,
          "Target": 44,
          "Duty": 292000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1205",
          "Supply": 205,
          "Target": 83,
          "Duty": 38690000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1206",
          "Supply": 83,
          "Target": 44,
          "Duty": 10480000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1301",
          "Supply": 67,
          "Target": 63,
          "Duty": 10700000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1302",
          "Supply": 63,
          "Target": 44,
          "Duty": 10000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1307",
          "Supply": 125,
          "Target": 44,
          "Duty": 75000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1403",
          "Supply": 46,
          "Target": 45.9,
          "Duty": 53000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1408",
          "Supply": 134,
          "Target": 49,
          "Duty": 3120000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1502",
          "Supply": 175,
          "Target": 150,
          "Duty": 4000000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1502-1",
          "Supply": 150,
          "Target": 77,
          "Duty": 1000000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1505",
          "Supply": 77,
          "Target": 49,
          "Duty": 70000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1508",
          "Supply": 182,
          "Target": 151,
          "Duty": 2020000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1509",
          "Supply": 151,
          "Target": 60,
          "Duty": 760000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "2101",
          "Supply": 120,
          "Target": 49,
          "Duty": 435000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "5111",
          "Supply": 110,
          "Target": 63,
          "Duty": 888000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1414",
          "Supply": 181,
          "Target": 180.9,
          "Duty": 2315000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "5102",
          "Supply": 180.9,
          "Target": 107,
          "Duty": 432000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1701",
          "Supply": 139,
          "Target": 55,
          "Duty": 3020000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1707",
          "Supply": 130,
          "Target": 55,
          "Duty": 1863000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1712",
          "Supply": 130,
          "Target": 44,
          "Duty": 65000,
          "exchangerType": 0,
          "Utility": ""
        }
      ],
      "coldStreams": [
        {
          "Name": "330",
          "Supply": 118,
          "Target": 162,
          "Duty": 1150000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "327",
          "Supply": 57,
          "Target": 119,
          "Duty": 1010000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "332",
          "Supply": 139,
          "Target": 143,
          "Duty": 3000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "452",
          "Supply": 115,
          "Target": 115.1,
          "Duty": 1000000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "553",
          "Supply": 125,
          "Target": 127,
          "Duty": 12640000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1101",
          "Supply": 63,
          "Target": 63.1,
          "Duty": 1100000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1102",
          "Supply": 63.1,
          "Target": 90,
          "Duty": 246000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1511",
          "Supply": 99,
          "Target": 175,
          "Duty": 7370000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T1409 btm",
          "Supply": 200,
          "Target": 200.1,
          "Duty": 3190000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "TWS1",
          "Supply": 60,
          "Target": 85,
          "Duty": 3270000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1706",
          "Supply": 206,
          "Target": 215,
          "Duty": 972000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "TWS2",
          "Supply": 60,
          "Target": 85,
          "Duty": 1385000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2101 btm",
          "Supply": 120,
          "Target": 120.1,
          "Duty": 3280000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2102 btm",
          "Supply": 107,
          "Target": 107.1,
          "Duty": 3520000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1213",
          "Supply": 49,
          "Target": 188,
          "Duty": 38690000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1214",
          "Supply": 188,
          "Target": 188.1,
          "Duty": 1050000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2301 btm",
          "Supply": 89,
          "Target": 89.1,
          "Duty": 11000000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2302 btm",
          "Supply": 125,
          "Target": 125.1,
          "Duty": 3250000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2401 btm",
          "Supply": 170,
          "Target": 170.1,
          "Duty": 1510000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2402 btm",
          "Supply": 197,
          "Target": 197.1,
          "Duty": 5080000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "1304",
          "Supply": 89,
          "Target": 120,
          "Duty": 2620000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2403 btm",
          "Supply": 184,
          "Target": 184.1,
          "Duty": 4570000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2103 btm",
          "Supply": 120,
          "Target": 120.1,
          "Duty": 1980000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T5501 btm",
          "Supply": 195,
          "Target": 195.1,
          "Duty": 3620000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2701 btm",
          "Supply": 175,
          "Target": 175.1,
          "Duty": 3140000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "T2702 btm",
          "Supply": 148,
          "Target": 148.1,
          "Duty": 2210000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "LP Steam",
          "Supply": 160,
          "Target": 161,
          "Duty": 8335000,
          "exchangerType": 0,
          "Utility": ""
        },
        {
          "Name": "BFW",
          "Supply": 95,
          "Target": 160,
          "Duty": 37758000,
          "exchangerType": 0,
          "Utility": ""
        }
      ],
            "Approach": 32,
            "CaseName": "CAAASE",
            "CaseDescription": "",
            "DutyType": 0,
            "Units": 0, 
            "Utilities":{
            "HotUtilities": [
              {
                "Name": "Fired Heater",
                "Supply": 600,
                "Target": 400,
                "UtilityApproach": 20
              },
              {
                "Name": "HP Steam",
                "Supply": 253.3,
                "Target": 252.3,
                "UtilityApproach": 10
              },
              {
                "Name": "MP Steam",
                "Supply": 212.3,
                "Target": 211.3,
                "UtilityApproach": 10
              },
              {
                "Name": "LP Steam",
                "Supply": 155.4,
                "Target": 154.4,
                "UtilityApproach": 10
              }
            ],
            "ColdUtilities": [
              {
                "Name": "WHB - HP",
                "Supply": 253.2,
                "Target": 252.2,
                "UtilityApproach": 20
              },
              {
                "Name": "WHB - MP",
                "Supply": 212.3,
                "Target": 211.3,
                "UtilityApproach": 20
              },
              {
                "Name": "WHB - LP",
                "Supply": 155.4,
                "Target": 154.4,
                "UtilityApproach": 10
              },
              {
                "Name": "BFW Heating",
                "Supply": 99.6,
                "Target": 98.6,
                "UtilityApproach": 5
              },
              {
                "Name": "Air Cooling",
                "Supply": 40,
                "Target": 50,
                "UtilityApproach": 20
              },
              {
                "Name": "Cooling Water",
                "Supply": 25,
                "Target": 30,
                "UtilityApproach": 10
              }
            ],    
            },
            "optimize": false,
            "LifeTime":175200,
            "DollarPerUA":500000000
          }
          

   
      TestData1() {
        const service = this._PC.postData(this.body1, this.body1.hotStreams, this.body1.coldStreams, this.body1.DutyType, this.body1.Utilities);
        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
            this.SolutionService.response = res;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }

    TestData2() {
        const service = this._PC.postData(this.body2, this.body2.hotStreams, this.body2.coldStreams, this.body2.DutyType, this.body2.Utilities);
        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
            this.SolutionService.response = res;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }

    TestData4() {
        const service = this._PC.postData(this.body4, this.body4.hotStreams, this.body4.coldStreams, this.body4.DutyType, this.body4.Utilities);
        this.SolutionService.body = service.body;
        service.response.subscribe(res => {
            this.SolutionService.response = res;
            this.router.navigate(['pleasewait', { 'redirectTo': 'pinchV1/Solution' }]);
        });
    }

}
