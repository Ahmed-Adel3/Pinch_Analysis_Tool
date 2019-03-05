using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public class Point
    {
        public double? x { get; set; }
        public double? y { get; set; }

        public Point( double? _X,double? _Y)
        {
            x = _X;
            y = _Y;
        }
    }
}
