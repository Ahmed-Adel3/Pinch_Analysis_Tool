using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public static class ExtensionMethods
    {
        public static List<double> fibbonacci<T>(this List<double> list)
        {
            List<double> temp = new List<double>();
            temp.Add(list[0]);
            for (int i = 1; i < list.Count; i++)
            {
                temp.Add(list[i] + temp[i - 1]);
            }
            return temp;
        }

        public static List<T> Clone<T>(this List<T> listToClone) where T : ICloneable
        {
            return listToClone.Select(item => (T)item.Clone()).ToList();
        }

        public static ExtendedPoint interpolatePoints(ExtendedPoint point1 , ExtendedPoint point2 ,  double? X)
        {
            int newType = (point1.type == 0) ? 2 : 3;
            double? Y =point1.y - (((point1.x - X) * (point1.y - point2.y)) / (point1.x - point2.x));

            return new ExtendedPoint(new Point(X, Y), newType);
        }

        public static List<NormalStream> CloneStreamsWithNewApproach(List<NormalStream> streams, double newApproach)
        {
            List<NormalStream> newStreams = new List<NormalStream>();
            foreach (var item in streams)
            {
                if (item.GetType() == typeof(coldStream))
                {
                    newStreams.Add(new coldStream(item.name,newApproach,item.SupplyTemp,item.TargetTemp,item.Duty,item.mass,item.Cp,item.Units,item.exchangerType,item.utility));
                }
                else
                {
                    newStreams.Add(new hotStream(item.name, newApproach, item.SupplyTemp, item.TargetTemp, item.Duty, item.mass, item.Cp, item.Units, item.exchangerType, item.utility));
                }
            }
            return newStreams;
        }
    }
}
