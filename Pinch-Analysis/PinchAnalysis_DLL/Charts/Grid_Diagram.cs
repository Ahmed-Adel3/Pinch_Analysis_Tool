using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchAnalysis_DLL
{
    public static class Grid_Diagram
    {

        public static ExpandoObject draw (List<NormalStream> Streams, int formNumber,double HT, double CT)
        {
             //output
             List<HE> HotStreamsConnected = new List<HE>();
             List<HE> HotStreamsNotConnected = new List<HE>();
             List<HE> ColdStreamsConnected = new List<HE>();
             List<HE> ColdStreamsNotConnected = new List<HE>();
             List<Duty> HotStreamsQ = new List<Duty>();
             List<Duty> ColdStreamsQ = new List<Duty>();

            //other
             List<NormalStream> HotStreams = new List<NormalStream>();
             List<NormalStream> ColdStreams = new List<NormalStream>();
             int ConnectionIdCounter = 1;
             int originalHotStreamsCount= HotStreams.Count;

            Dictionary<int, string> indexNameMatch = new Dictionary<int, string>();
            
            double QTolerance = 0.001;

            HotStreams = Streams.Where(a => a.GetType() == typeof(hotStream)).OrderByDescending(a => a.SupplyTemp).ToList();
            ColdStreams = Streams.Where(a => a.GetType() == typeof(coldStream)).OrderByDescending(a => a.TargetTemp).ToList();

            //Get HotStreamsQ
            for (int i = 0; i < HotStreams.Count; i++)
            {
                HotStreamsQ.Add(new Duty(new Point(i+1,0),new Point(i+1, HotStreams[i].Duty)));
            }

            //Get ColdStreamsQ
            for (int i = 0; i < ColdStreams.Count; i++)
            {
                ColdStreamsQ.Add(new Duty(new Point(i + 1 + HotStreams.Count, 0),new Point(i+1+ HotStreams.Count, ColdStreams[i].Duty)));
            }

            List<int> IndexArr = Enumerable.Range(1, HotStreams.Count+ColdStreams.Count).ToList();

            //originalICount = 0;
            //check for Q equality with tolerance
            for (int i = 0; i < HotStreams.Count; i++)
            {
               // originalICount++;
               // int originalJCount = 0;
                for (int j = 0; j < ColdStreams.Count; j++)
                {
                    if (Math.Abs(HotStreams[i].Duty - ColdStreams[j].Duty) < QTolerance)
                    {
                        if (!HotStreams[i].connected && !ColdStreams[j].connected)
                        {
                            HotStreamsConnected.Add(new HE(new Point(i + 1, HotStreams[i].SupplyTemp), new Point(i + 1, HotStreams[i].TargetTemp), ConnectionIdCounter));
                            ColdStreamsConnected.Add(new HE(new Point(j + HotStreams.Count + 1, ColdStreams[j].SupplyTemp), new Point(j + HotStreams.Count + 1, ColdStreams[j].TargetTemp), ConnectionIdCounter));
                            indexNameMatch.Add(i + 1, HotStreams[i].name + " hot");
                            indexNameMatch.Add(j + HotStreams.Count + 1, ColdStreams[j].name + " cold");

                            IndexArr.Remove(i + 1);
                            IndexArr.Remove(j + HotStreams.Count + 1);
                            HotStreams[i].connected = true;
                            ColdStreams[j].connected = true;
                            ConnectionIdCounter++;
                            break;
                        }
                    }
                }
            }



            for (int i = 0; i < HotStreams.Count; i++)
            {
                //int indexer = IndexArr[0];
                if (HotStreams[i].connected == false)
                {
                    HotStreamsNotConnected.Add(new HE(new Point(IndexArr[0], HotStreams[i].SupplyTemp), new Point(IndexArr[0], HotStreams[i].TargetTemp), null));
                    indexNameMatch.Add(IndexArr[0], HotStreams[i].name);
                    IndexArr.Remove(IndexArr[0]);
                }
            }

            for (int i = 0; i < ColdStreams.Count; i++)
            {
                //int indexer = IndexArr[0];
                if (ColdStreams[i].connected == false)
                {
                    ColdStreamsNotConnected.Add(new HE(new Point(IndexArr[0], ColdStreams[i].SupplyTemp), new Point(IndexArr[0], ColdStreams[i].TargetTemp), null));
                    indexNameMatch.Add(IndexArr[0], ColdStreams[i].name);
                    IndexArr.Remove(IndexArr[0]);
                }
            }

            dynamic obj = new ExpandoObject();
            obj.HotStreamsConnected = HotStreamsConnected;
            obj.ColdStreamsConnected = ColdStreamsConnected;
            obj.HotStreamsNotConnected = HotStreamsNotConnected;
            obj.ColdStreamsNotConnected = ColdStreamsNotConnected;
            obj.HotStreamsQ = HotStreamsQ;
            obj.ColdStreamsQ = ColdStreamsQ;
            obj.indexNameMatch = indexNameMatch;

            // double? connectedRange = ColdStreamsConnected[ColdStreamsConnected.Count - 1].MidPoint.x - HotStreamsConnected[0].MidPoint.x;
            double? eachRangeValue = ((double)HotStreamsConnected.Count)/2;


            List<connectionLine> connLines = new List<connectionLine>();
            foreach (var item in HotStreamsConnected)
            {
                HE cold = ColdStreamsConnected.SingleOrDefault(a => a.ConnectionId == item.ConnectionId);
                connLines.Add(new connectionLine(item.MidPoint, cold.MidPoint, item.ConnectionId, eachRangeValue));
            }
            obj.connectionLines = connLines;
            obj.pinchLine = new connectionLine(new Point(1,HT),
                                               new Point(HotStreams.Count, HT),
                                               new Point(HotStreams.Count, CT),
                                               new Point(HotStreams.Count + ColdStreams.Count,CT));
            return obj;
        }
    }





    public class HE
    {
        public Point StreamIn { get; set; }
        public Point StreamOut { get; set; }
        public Point MidPoint { get; set; }
        public double? ConnectionId { get; set; }
       // public Color color { get; set; }

        public HE(Point _In,Point _Out, double? _connectionId )
        {
            StreamIn = _In;
            StreamOut = _Out;
            MidPoint = new Point(StreamIn.x, (StreamIn.y + StreamOut.y) / 2);
           // color = _color;
            ConnectionId = _connectionId;
        }
    }

    public class Duty
    {
        public Point DutyPoint1 { get; set; }
        public Point DutyPoint2 { get; set; }

        public Duty(Point _DutyPoint1, Point _DutyPoint2)
        {
            DutyPoint1 = _DutyPoint1;
            DutyPoint2 = _DutyPoint2;

            // color = _color;
        }
    }

    public class connectionLine
    {
        public Point midpointHot { get; set; }
        public Point upperMiddle { get; set; }
        public Point lowerMiddle { get; set; }
        public Point midpointCold { get; set; }
        public double? Rank { get; set; }
        public double? Range{ get; set; }

        public connectionLine(Point _midpointHot, Point _midpointCold,double? _Rank, double? _Range )
        {
            midpointHot = _midpointHot;
            midpointCold = _midpointCold;
            upperMiddle = new Point(_midpointHot.x + _Range, _midpointHot.y);
            lowerMiddle = new Point(upperMiddle.x, midpointCold.y);
        }
        public connectionLine(Point _midpointHot, Point _upperMiddle, Point _lowerMiddle, Point _midpointCold)
        {
            midpointHot = _midpointHot;
            midpointCold = _midpointCold;
            upperMiddle = _upperMiddle;
            lowerMiddle = _lowerMiddle;
        }

    }

  /*  public enum Color
    {
        red,
        blue,
        cyan,
        orange,
        glowRed,
        glowBlue
    }*/
}

