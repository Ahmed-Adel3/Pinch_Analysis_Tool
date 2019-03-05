using System;
using System.Collections.Generic;
using System.Text;

namespace PinchAnalysis_DLL
{
    public class Net
    {
        public double Dt { get; set; }
        public double CpSummition { get; set; }
        public double NetSummition { get; set; }

        public Net(double _Dt, double _CpSummition)
        {
            Dt = _Dt;
            CpSummition = _CpSummition;
            NetSummition = Dt * CpSummition;
        }
    }
}
