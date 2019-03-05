using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public static class GCC_Diagram
    {
        public static ExpandoObject draw(List<double> tempIntervals, List<double> GccEnthalpies, ref List<UtilityStream> UtilityStreams)
        {
            List<Point> points = new List<Point>();
            for (int i = 0; i < tempIntervals.Count; i++)
            {
                points.Add(new Point(Math.Round(GccEnthalpies[i], 2), tempIntervals[i]));
            }

            List<ExtendedPoint> PointsWithUtility = points.Select(a => new ExtendedPoint(a.x, a.y,false,null,null,null,null,null)).ToList();

            List<Pocket> Pockets = DetectPockets(points);

            for (int i = 0; i < UtilityStreams.Count; i++)
            {
                int StreamType = (UtilityStreams[i].GetType() == typeof(HotUtilityStream)) ? 0 : 1;
                PointsWithUtility.Add(new ExtendedPoint(null, UtilityStreams[i].intervalSupply, true, UtilityStreams[i].intervalSupply, UtilityStreams[i].intervalTarget,UtilityStreams[i].UtilityApproach,StreamType, UtilityStreams[i].name));
            }


            List<ExtendedPoint> SortedPoints = PointsWithUtility.OrderByDescending(a => a.y).ToList();
            List<ExtendedPoint> InterpolatedPoints = InterpolateEnthalpies(SortedPoints);
            List<ExtendedPoint> OnlyUtilityPoints = InterpolatedPoints.Where(a => a.isUtility == true).ToList();
            List<ExtendedPoint> HotUtilityPoints = OnlyUtilityPoints.Where(a => a.type == 0).ToList();
            List<ExtendedPoint> ColdUtilityPoints = InterpolatedPoints.Where(a => a.type == 1).ToList();


            List<line> UtilityLines = new List<line>();

            foreach (var utility in OnlyUtilityPoints)
            {
                double? rightY =(utility.type == 0)?utility.Target:utility.Supply;
                double? leftY = (utility.type == 0)?utility.Supply:utility.Target;

                if (utility.type == 0)
                {
                    UtilityLines.Add(new line(new Point(0, rightY), new Point(utility.x / 1000000, leftY), utility.type,utility.UtilityApproach,utility.Name));
                }
                else
                {
                    UtilityLines.Add(new line(new Point(0, leftY), new Point(utility.x / 1000000, rightY), utility.type,utility.UtilityApproach,utility.Name));
                }
            }

            List<line> HotUtilityLines = EditUtilitiesEnthalpies( UtilityLines.Where(a=>a.type == 0).Reverse().ToList() , Pockets.Where(a=>a.type ==0).ToList());
            List<line> ColdUtilityLines = EditUtilitiesEnthalpies(UtilityLines.Where(a => a.type == 1).ToList(), Pockets.Where(a => a.type == 1).ToList());
            List<line> ShiftedHotUtilityLines = HotUtilityLines.Clone().Select(a => { a.Point1.y = a.Point1.y + a.Shift; a.Point2.y = a.Point2.y + a.Shift; return a; }).ToList();
            List<line> ShiftedColdUtilityLines = ColdUtilityLines.Clone().Select(a => { a.Point1.y = a.Point1.y - a.Shift; a.Point2.y = a.Point2.y - a.Shift; return a; }).ToList();


            foreach (var item in UtilityStreams)
            {
                if (item.GetType() == typeof(HotUtilityStream))
                {
                    var util = HotUtilityLines.Where(a => a.Name == item.name).FirstOrDefault();
                    item.OptimiumDuty = util.Point2.x - util.Point1.x;
                }
                else if (item.GetType() == typeof(ColdUtilityStream))
                {
                    var util = ColdUtilityLines.Where(a => a.Name == item.name).FirstOrDefault();
                    item.OptimiumDuty = util.Point2.x - util.Point1.x;
                }
            }

            dynamic obj = new ExpandoObject();
            obj.GCCPoints = points;
            obj.HotUtilities = HotUtilityLines;
            obj.ColdUtilities = ColdUtilityLines;
            obj.ShiftedHotUtilities = ShiftedHotUtilityLines;
            obj.ShiftedColdUtilities = ShiftedColdUtilityLines;

            return obj;
        }

        public static List<ExtendedPoint> InterpolateEnthalpies (List<ExtendedPoint> PFI ) // PFI => points before Interpolation
        {
            int startNulls = 0;
            int endNulls = 0;

            foreach (var item in PFI)
            {
                if (item.x == null) startNulls++;
                else break;
            }

            foreach (var item in PFI.Reverse<Point>())
            {
                if (item.x == null) endNulls++;
                else break;
            }

            if (startNulls > 0)
            {
                for (int i = 0; i <= startNulls; i++)
                {
                    PFI[i].x = PFI[i + 1].x;
                }
            }

            if (endNulls > 0)
            {
                for (int i = 0; i <= endNulls; i++)
                {
                    PFI[PFI.Count-i-1].x = PFI[PFI.Count-endNulls - 1].x;
                }
            }

            for (int i = 0; i < PFI.Count; i++)
            {
                if (PFI[i].x == null)
                {
                    int SuccessiveNulls = 0;
                    for (int j = i+1; j < PFI.Count; j++)
                    {
                        if (PFI[j].x == null) SuccessiveNulls++;
                        else break;
                    }
                    for (int k = 0; k <= SuccessiveNulls; k++)
                    {
                        PFI[i + k].x = (((PFI[i + k].y - PFI[i - 1].y) * (PFI[i+ SuccessiveNulls + 1].x - PFI[i - 1].x)) / (PFI[i+SuccessiveNulls + 1].y - PFI[i - 1].y)) + PFI[i - 1].x;
                    }
                }
            }
            return PFI;
        }

        public static List<Pocket> DetectPockets (List<Point> points)
        {
            List<Pocket> PocketPoints = new List<Pocket>();

            int type = 0;
            int? rank = 0;
            for (int i = 0; i < points.Count; i++)
            {
                if (points[i].x == 0)
                {
                    type = 1;
                    rank = 0;
                }

                if (i == 0 || i == points.Count - 1)
                {
                    if( (i == 0 && points[i].x < points[i+1].x) || (i == points.Count - 1 && points[i].x < points[i-1].x ))
                    {
                        PocketPoints.Add(new Pocket(points[i].x, points[i].y, type, rank));
                        rank++;
                    }
                }
                else if (points[i].x < points[i+1].x &&
                    points[i].x < points[i - 1].x &&
                    points[i].x != 0)
                {
                    PocketPoints.Add(new Pocket(points[i].x,points[i].y,type,rank));
                    rank++;
                }
            }
            return PocketPoints;
        }

        //public static 

        public static List<line> EditUtilitiesEnthalpies(List<line> lines,List<Pocket> pockets)
        {
            double minXPocket;
            double firstX;
            double lastX = double.MaxValue;

            for (int i = 0; i < lines.Count; i++)
            {
                List<Pocket> NextPockets;
                if (pockets.Count != 0 && pockets[0].type == 1)
                {
                    NextPockets = pockets.Where(a => a.y <= lines[i].Point2.y).ToList();
                }
                else
                {
                    NextPockets = pockets.Where(a => a.y >= lines[i].Point2.y).ToList();

                }
                minXPocket =(NextPockets.Count == 0)? double.MaxValue: NextPockets.Select(a => a.x).Min().GetValueOrDefault()/1000000;
                minXPocket = Math.Round(minXPocket, 2);

                firstX =(i!=0)? lastX : 0;
                lastX = Math.Min(minXPocket, lines[i].Point2.x.GetValueOrDefault());
                lines[i].Point1.x = firstX;
                lines[i].Point2.x = lastX;
            }
            return lines;
        }
    }


    public class ExtendedPoint : Point
    {
        public Boolean isUtility { get; set; }
        public int? type { get; set; }  //0 => hot , 1 => cold
        public double? Supply { get; set; }
        public double? Target { get; set; }
        public double? UtilityApproach { get; set; }
        public string Name { get; set; }

        public ExtendedPoint(double? _x , double? _y , Boolean _IsUtility,double? _supply , double? _target,double? _utilityApproach, int? _type, string _name)
            :base(_x,_y)
        {
            isUtility = _IsUtility;
            Target = _target;
            Supply = _supply;
            type = _type;
            UtilityApproach = _utilityApproach;
            Name = _name;
        }
        public ExtendedPoint(Point _point, int? _type)
            : base(_point.x, _point.y)
        {
            type = _type;
        }
    }

    public class Pocket : Point
    {
        public int? type { get; set; }  //0 => hot , 1 => cold
        public int? rank { get; set; }  


        public Pocket(double? _x , double? _y , int? _type, int? _rank)
            : base(_x, _y)
        {
            type = _type;
            rank = _rank;
        }
    }

    public class line :ICloneable
    {
        public Point Point1 { get; set; }
        public Point Point2 { get; set; }
        public int? type { get; set; }  //0 => hot , 1 => cold
        public double? Shift { get; set; }
        public string Name { get; set; }

        public line(Point _1, Point _2, int? _type, double? _shift, string _name)
        {
            Point1 = _1;
            Point2 = _2;
            type = _type;
            Shift =(_shift.HasValue)?Math.Round(_shift.Value,1):_shift;
            Name = _name;
        }

        public object Clone()
        {
            return new line(
                new Point(this.Point1.x, this.Point1.y),
                new Point(this.Point2.x, this.Point2.y),
                this.type, this.Shift,this.Name);
        }
    }
}
