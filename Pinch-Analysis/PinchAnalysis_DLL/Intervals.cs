using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace PinchAnalysis_DLL
{
    public class Interval
    {
        public double IntervalTemp { get; set; }
        public double HotInterval  { get; set; }
        public double ColdInterval { get; set; }

        public Interval( double _temp, double ApproachTemp)
        {
            IntervalTemp = _temp;
            HotInterval = _temp + ( ApproachTemp / 2);
            ColdInterval = _temp - ( ApproachTemp / 2);
         }
    }
}