using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public class intervalEnthalpies
    {
        public List<double> Hot { get; set; }
        public List<double> Cold { get; set; }

        public intervalEnthalpies(List<double> _Hot , List<double> _Cold)
        {
            Hot = _Hot;
            Cold = _Cold;
        }
    }
}
