using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public class Solution
    {
        public double IntervalTemp { get; set; }
        public double HotIntervalTemp { get; set; }
        public double ColdIntervalTemp { get; set; }
        public double CurrentApproachTemp { get; set; }

        public double Qhot { get; set; }
        public double Qcold { get; set; }

        public double MaxHeatRecovery { get; set; }
        public double CurrentQhot { get; set; }
        public double CurrentQcold { get; set; }
        public double CurrentHeatRecovery { get; set; }

        public int Units { get; set; }

        public List<Point> HT_hotPoints  { get; set; }
        public List<Point> HT_coldPoints { get; set; }
        public ExpandoObject GCC_Points    { get; set; }
        public ExpandoObject Grid_Points { get; set; }

        public Solution( double _IntervalTemp, double _HotIntervalTemp, double _ColdIntervalTemp, double _CurrentApproachTemp,
                         double _Qhot, double _Qcold, int _Units,
                         double _MaxHeatRecovery,double _CurrentQhot,double _CurrentQcold,double _CurrentHeatRecovery,
                         List<Point> _HT_hotpoints, List<Point> _HT_coldpoints, ExpandoObject _GCC_Points,ExpandoObject _Grid_points )
        {
            IntervalTemp = _IntervalTemp;
            HotIntervalTemp = _HotIntervalTemp;
            ColdIntervalTemp = _ColdIntervalTemp;
            CurrentApproachTemp = _CurrentApproachTemp;

            Units = _Units;

            Qhot = _Qhot;
            Qcold = _Qcold;

            HT_hotPoints = _HT_hotpoints;
            HT_coldPoints = _HT_coldpoints;
            GCC_Points = _GCC_Points;
            Grid_Points = _Grid_points;

            MaxHeatRecovery = _MaxHeatRecovery;
            CurrentQhot = _CurrentQhot;
            CurrentQcold = _CurrentQcold;
            CurrentHeatRecovery = _CurrentHeatRecovery;
        }

        public Solution(double _IntervalTemp, double _HotIntervalTemp, double _ColdIntervalTemp, double _CurrentApproachTemp,
                 double _Qhot, double _Qcold,
                 double _MaxHeatRecovery, double _CurrentQhot, double _CurrentQcold, double _CurrentHeatRecovery)
        {
            IntervalTemp = _IntervalTemp;
            HotIntervalTemp = _HotIntervalTemp;
            ColdIntervalTemp = _ColdIntervalTemp;
            CurrentApproachTemp = _CurrentApproachTemp;

            Qhot = _Qhot;
            Qcold = _Qcold;

            MaxHeatRecovery = _MaxHeatRecovery;
            CurrentQhot = _CurrentQhot;
            CurrentQcold = _CurrentQcold;
            CurrentHeatRecovery = _CurrentHeatRecovery;

        }
    }
}
