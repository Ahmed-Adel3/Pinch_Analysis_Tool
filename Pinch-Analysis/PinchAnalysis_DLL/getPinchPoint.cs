using MoreLinq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;


namespace PinchAnalysis_DLL
{
    public class getPinchPoint
    {
        public int formNumber { get; set; }
        double tolerance = Math.Pow(10,-6);
        public List<NormalStream> streams;
        public List<UtilityStream> UtilityStreams;

        public List<Interval> intervals { get; set; }
        public List<Interval> distinctIntervals { get; set; }
        public List<Interval> sortedIntervals { get; set; }
        public List<Net> NetList { get; set; }
        public List<double> QList = new List<double>();
        public List<double> CpSummitionList = new List<double>();

        public List<double> AccSummition = new List<double>();
        public List<double> AccSummitionOrdered = new List<double>();

        public List<double> hotStreamsEnthalpies = new List<double>();
        public List<double> coldStreamsEnthalpies = new List<double>();
        public List<double> sumStreamsEnthalpies = new List<double>();
        public List<double> GccAccumilation = new List<double>();
        public List<double> GccEnthalpies = new List<double>();

        public List<double> IntervalTemps = new List<double>();
        public List<double> hotIntervals = new List<double>();
        public List<double> coldIntervals = new List<double>();

        public List<intervalEnthalpies> IntervalEnthalpies = new List<intervalEnthalpies>();
        public List<Point> HT_hotpoints = new List<Point>();
        public List<Point> HT_coldpoints = new List<Point>();
        public dynamic GCC_points = new ExpandoObject();
        public dynamic Grid_points = new ExpandoObject();

        List<HTT_Model> HTT_ModelList = new List<HTT_Model>();
        List<double?> UA_List = new List<double?>();

        public int Units { get; set; }

       public  double DtVar, CpVar, Accumulation, Qh, Qc, CurrentQh = 0,CurrentQc = 0,CurrentHeatRecovery=0,MaxHeatRecovery=0,CurrentApproach;
        int pinchPoint = -1;

        public getPinchPoint(List<NormalStream> _streams, List<UtilityStream>_UtilityStreams, List<Interval> _intervals, List<Net> _net,double ApproachTemp, int _Units, int _formNumber)
        {
            streams = _streams;
            UtilityStreams = _UtilityStreams;
            intervals = _intervals;
            NetList = _net;
            Units = _Units;
            formNumber = _formNumber;

            // Add Each Interval limit
            foreach (var item in streams)
            {
                intervals.Add(new Interval(item.intervalSupply, ApproachTemp));
                intervals.Add(new Interval(item.intervalTarget, ApproachTemp));
            }
            sortedIntervals = intervals.OrderByDescending(i => i.IntervalTemp).ToList();

            IntervalTemps = sortedIntervals.Select(a => a.IntervalTemp).Distinct().ToList();
            hotIntervals  = sortedIntervals.Select(a => a.HotInterval).Distinct().ToList();
            coldIntervals = sortedIntervals.Select(a => a.ColdInterval).Distinct().ToList();


            // Calculate Net for each Interval ( Delta T ,  Cp )
            for (int i = 0; i < hotIntervals.Count - 1; i++)
            {
                List<double> hotIntervalEnthalpies = new List<double>();
                List<double> coldIntervalEnthalpies = new List<double>();

                CpVar = 0;
                DtVar = hotIntervals[i] - hotIntervals[i + 1];
                double sumHotStreamE, sumColdStreamE;

                foreach (var item in streams)
                {
                    if (item.GetType() == typeof(hotStream))
                    {
                        if (!(item.TargetTemp >= hotIntervals[i] || item.SupplyTemp <= hotIntervals[i + 1]))
                        {
                            CpVar += item.MCp;
                            hotIntervalEnthalpies.Add(item.MCp * DtVar);
                        }
                        else
                        {
                            hotIntervalEnthalpies.Add(0);
                        }
                    }
                    else if (item.GetType() == typeof(coldStream))
                    {
                        if (!(item.SupplyTemp >= coldIntervals[i] || item.TargetTemp <= coldIntervals[i + 1]))
                        {
                            CpVar -= item.MCp;
                            coldIntervalEnthalpies.Add(-1 * item.MCp * DtVar);
                        }
                        else
                        {
                            coldIntervalEnthalpies.Add(0);
                        }
                    }
                }

                sumHotStreamE = hotIntervalEnthalpies.Sum();
                sumColdStreamE = coldIntervalEnthalpies.Sum();

                IntervalEnthalpies.Add(new intervalEnthalpies(hotIntervalEnthalpies, coldIntervalEnthalpies));

                hotStreamsEnthalpies.Add(sumHotStreamE);
                coldStreamsEnthalpies.Add(sumColdStreamE);

                sumStreamsEnthalpies.Add(sumHotStreamE + sumColdStreamE);
                CpSummitionList.Add(CpVar);
                NetList.Add(new Net(DtVar, CpVar));
            }


            GccAccumilation = sumStreamsEnthalpies.fibbonacci<double>();
            List<double> temp = NetList.Select(a => a.Dt).ToList();

            GccEnthalpies = getGccEnthalpies(GccAccumilation, -1*GccAccumilation.Min());
            List<double> temp2 = NetList.Select(a => a.NetSummition).ToList();


            Accumulation = 0;
        
            foreach (var item in NetList)
            {
                Accumulation += item.NetSummition; 
                AccSummition.Add(Accumulation);
            }

            AccSummitionOrdered= AccSummition.ToList<double>();
            var minValue= AccSummitionOrdered.Min();
            List<double> AccQ = new List<double>(); 
            Qh = -1 * minValue;
            QList.Add(Qh);
            Qc = Qh;

            for (int i = 0; i < NetList.Count; i++)
            {
                Qc += NetList[i].NetSummition;
                QList.Add(Qc);
                AccQ.Add(Qc);
                if (Qc < tolerance && Qc >( -1*tolerance))
                {
                    pinchPoint = i + 1;
                };
            }

        }

        public void drawGccDiagram()
        {
            for (int i = 0; i < UtilityStreams.Count; i++)
            {
                var UtilityStream = UtilityStreams[i];
                var ShiftedTemp = UtilityStreams[i].intervalSupply;

                if ((UtilityStream.GetType() == typeof(HotUtilityStream) && ShiftedTemp < IntervalTemps[pinchPoint]) ||
                     (UtilityStream.GetType() == typeof(ColdUtilityStream) && ShiftedTemp > IntervalTemps[pinchPoint]))
                {
                    UtilityStreams.Remove(UtilityStream);
                    i--;
                }
            }


            List<double> UtilityStreamsTemps = UtilityStreams.Select(a => a.intervalSupply).ToList();

            GCC_points = GCC_Diagram.draw(IntervalTemps, GccEnthalpies, ref UtilityStreams);
        }

        public void drawHTDiagram()
        {
            HT_hotpoints = TH_Diagram.draw(hotIntervals, hotStreamsEnthalpies, null);
            HT_coldpoints = TH_Diagram.draw(coldIntervals, coldStreamsEnthalpies, GccEnthalpies[GccEnthalpies.Count - 1]);
        }

        public void drawGridDiagram()
        {
            Grid_points = Grid_Diagram.draw(streams, formNumber, hotIntervals[pinchPoint], coldIntervals[pinchPoint]);
        }

        public double Get_Optimium_UA()
        {
            var firstHotPoint = HT_hotpoints[0];
            var lastColdPoint = HT_coldpoints[HT_coldpoints.Count - 1];

            List<ExtendedPoint> Extended_HT_Hot = FillExtendedPointListWithType(HT_hotpoints, 0);
            List<ExtendedPoint> Extended_HT_Cold = FillExtendedPointListWithType(HT_coldpoints, 1);

            List<ExtendedPoint> HT_pointsList = new List<ExtendedPoint>();
            HT_pointsList.AddRange(Extended_HT_Hot);
            HT_pointsList.AddRange(Extended_HT_Cold);
            HT_pointsList = HT_pointsList.GroupBy(a => a.x).Select(x => x.First()).ToList();
            HT_pointsList = HT_pointsList.OrderByDescending(a => a.x).ToList();
            HT_pointsList = HT_pointsList.Where(a => a.x <= firstHotPoint.x && a.x >= lastColdPoint.x).ToList();

            List<ExtendedPoint> interpolatedPoints = new List<ExtendedPoint>();

            for (int i = 0; i < HT_pointsList.Count; i++)
            {
                ExtendedPoint point1;
                ExtendedPoint point2;
                // for hot
                if (HT_pointsList[i].type == 1)
                {
                     point1 = Extended_HT_Hot.Where(a=>a.x > HT_pointsList[i].x).LastOrDefault();
                     point2 = Extended_HT_Hot.Where(a => a.x < HT_pointsList[i].x).FirstOrDefault();
                }
                else
                {
                    point1 = Extended_HT_Cold.Where(a => a.x > HT_pointsList[i].x).LastOrDefault();
                    point2 = Extended_HT_Cold.Where(a => a.x < HT_pointsList[i].x).FirstOrDefault();
                }
                interpolatedPoints.Add(ExtensionMethods.interpolatePoints(point1, point2, HT_pointsList[i].x));
            }

            foreach (var item in interpolatedPoints)
            {
                double? Matching_HT_pointsListX = HT_pointsList.Where(a => a.x == item.x).FirstOrDefault().y;
                var larger_Y = Nullable.Compare(Matching_HT_pointsListX, item.y) > 0 ? Matching_HT_pointsListX : item.y;
                var smaller_Y = Nullable.Compare(Matching_HT_pointsListX, item.y) < 0 ? Matching_HT_pointsListX : item.y;

                HTT_ModelList.Add(new HTT_Model(item.x, larger_Y , smaller_Y));
            }

            List<double?> LMTDList = new List<double?>();
            List<double?> dt1List = new List<double?>();
            List<double?> dt2List = new List<double?>();

            for (int i = 0; i < HTT_ModelList.Count-1; i++)
            {
                double? dt1 = HTT_ModelList[i].Y1 - HTT_ModelList[i].Y2;
                double? dt2 = HTT_ModelList[i+1].Y1 - HTT_ModelList[i+1].Y2;

                dt1List.Add(dt1);
                dt2List.Add(dt2);

                var larger_dt = Nullable.Compare(dt1, dt2) > 0 ? dt1 : dt2;
                var smaller_dt= Nullable.Compare(dt1, dt2) < 0 ? dt1 : dt2;

                double? LnValue = Math.Log((larger_dt/smaller_dt).GetValueOrDefault());
                double? LMTD = (larger_dt - smaller_dt) / LnValue;
                LMTDList.Add(LMTD);

                var UA = (HTT_ModelList[i].H - HTT_ModelList[i + 1].H) / LMTD;
                if (!Double.IsInfinity(UA.GetValueOrDefault()) && !Double.IsNaN(UA.GetValueOrDefault()))
                {
                    UA_List.Add(UA);
                }
                else return 0;
            }

            var optimum_UA = UA_List.Sum();
            return optimum_UA.GetValueOrDefault();
        }

        public List<ExtendedPoint> FillExtendedPointListWithType(List<Point> points, int type)
        {
            List<ExtendedPoint> extendedPoints = new List<ExtendedPoint>();
            foreach (var item in points)
            {
                extendedPoints.Add(new ExtendedPoint(item, type));
            }
            return extendedPoints;
        }

        public void getCurrentDuties()
        {
            foreach (var item in streams)
            {
                if (item.GetType() == typeof(hotStream) && (item.exchangerType != ExchangerType.Heat_Exchanger))
                {
                    CurrentQc += item.Duty;
                }
                else if (item.GetType() == typeof(coldStream) && (item.exchangerType != ExchangerType.Heat_Exchanger))
                {
                    CurrentQh += item.Duty;
                }
                else
                {
                    CurrentHeatRecovery += item.Duty / 2;
                }
            }
            MaxHeatRecovery = CurrentHeatRecovery + (CurrentQh - Qh);
        }

        /*   public void getCurrentDuties()
           {
               var streamsMapped = streams.Select(a => new { Duty=a.Duty, Type=(a.GetType()==typeof(hotStream))?0:1 }).ToList();
               //streams with utilities - streams with only one side - and TYPE IS UNIQUE
               //var SWU = streams.GroupBy(a => a.GetType()).Where(a => a.Count() == 1).Select(a => a.ElementAt(0)).ToList();
               //var SWU = streamsMapped.GroupBy(a => a.Duty&&a.Type).Where(a => a.Count() == 1).Select(a => a.ElementAt(0)).ToList();

               var HotStreamsMapped = streamsMapped.Where(a => a.Type == 0).ToList();
               var ColdStreamsMapped = streamsMapped.Where(a => a.Type == 0).ToList();
               var connectedStreamsDuties = new List<double>();

               for (int i = 0; i < HotStreamsMapped.Count; i++)
               {
                   for (int j = 0; j < ColdStreamsMapped.Count; j++)
                   {
                       if (HotStreamsMapped[i].Duty == ColdStreamsMapped[j].Duty)
                       {
                           HotStreamsMapped.RemoveAt(i);
                           ColdStreamsMapped.RemoveAt(j);
                           connectedStreamsDuties.Add(HotStreamsMapped[i].Duty);
                           i--; j--;
                       }
                   }
               }


               // //streams without utilities - streams with two sides - represents heat exchanger
               //var abs = streamsMapped.Where(a=>a.)
               //sum of Duties of heat exchangers  - streams with hot and cold side 
               CurrentHeatRecovery = connectedStreamsDuties.Sum();

               foreach (var item in HotStreamsMapped)
               {
                   CurrentQc += item.Duty;
               }
               foreach (var item in ColdStreamsMapped)
               {
                   CurrentQh += item.Duty;
               }
               MaxHeatRecovery = CurrentHeatRecovery + (CurrentQh - Qh);
           }*/

        public void getCurrentDutiesPerUtility()
        {
            foreach (var item in UtilityStreams)
            {
                if (item.GetType() == typeof(HotUtilityStream))
                {
                    item.CurrentDuty = streams.Where(a => a.GetType() == typeof(coldStream) && a.utility == item.name).Sum(a => a.Duty);
                }
                else if (item.GetType() == typeof(ColdUtilityStream))
                {
                    item.CurrentDuty = streams.Where(a => a.GetType() == typeof(hotStream) && a.utility == item.name).Sum(a => a.Duty);
                }
            }
        }

        public Boolean TAppLimitReached()
        {
            return Qh >= CurrentQh;
        }

        public List<double> getGccEnthalpies(List<double> GccAccumilation, double pinchEnthalpy)
        {
            List<double> temp = GccAccumilation.Select(a => a+ pinchEnthalpy).ToList(); ;
            temp.Insert(0, pinchEnthalpy);
            return temp;
        } 

        public Solution Answer()
        {
            var i = pinchPoint;
            return new Solution(IntervalTemps[i], hotIntervals[i], coldIntervals[i], CurrentApproach,Qh, Qc,Units,MaxHeatRecovery,CurrentQh,CurrentQc,CurrentHeatRecovery,HT_hotpoints,HT_coldpoints,GCC_points,Grid_points);
        }
    }

    public class HTT_Model
    {
        public double? H { get; set; }
        public double? Y1 { get; set; }
        public double? Y2 { get; set; }

        public HTT_Model(double? _H, double? _Y1, double? _Y2)
        {
            H = _H;
            Y1 = _Y1;
            Y2 = _Y2;
        }
    }
}
