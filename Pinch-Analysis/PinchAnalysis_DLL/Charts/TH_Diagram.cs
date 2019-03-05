using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public static class TH_Diagram
    {
        public static List<Point> draw(List<double> tempIntervals, List<double> Enthalpies, double? shift)
        {
            List<Point> points = new List<Point>();

            if (shift == null)
            {
                double Sum = Enthalpies.Sum();
                // int flag = 0;
                for (int i = 0; i < tempIntervals.Count; i++)
                {
                    points.Add(new Point(Math.Round(Sum, 2), tempIntervals[i]));
                    if (i == tempIntervals.Count - 1) continue;
                    Sum -= Enthalpies[i];
                }
            }
            else
            {
                double shiftVal = shift.HasValue ? shift.Value : 0;
                double Sum = -1 * Enthalpies.Sum() + shiftVal;
                for (int i = 0; i < tempIntervals.Count - 1; i++)
                {
                    points.Add(new Point(Math.Round(Sum, 2), tempIntervals[i]));
                    if (i == tempIntervals.Count - 1) continue;
                    Sum += Enthalpies[i];
                }
            }
            removeEdges(ref points);
            return points;
        }


        public static void removeEdges(ref List<Point> points)
        {
            for (int i = 0; i < points.Count - 1; i++)
            {
                if (points[i].x == points[i + 1].x)
                {
                    points.Remove(points[i]);
                    i--;
                }
                else break;
            }

            for (int i = points.Count - 1; i > 0; i--)
            {
                if (points[i].x == points[i - 1].x)
                {
                    points.Remove(points[i]);
                }
                else break;
            }
        }
    }
}
