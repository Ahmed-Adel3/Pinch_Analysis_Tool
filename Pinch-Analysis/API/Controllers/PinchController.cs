using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PinchAnalysis_DLL;
using API.Models;
using System.Dynamic;

namespace API.Controllers
{
    [Authorize]
    [RoutePrefix("api/PinchAnalysis")]
    public class PinchController : ApiController
    {
        List<int> a = new List<int>();
        public int formNumber { get; set; }
        public int MaxApproach { get; set; }
        double CurrentApproach = -1;
        double CurrentQh = 0;
        Dictionary<double, double> test = new Dictionary<double, double>();

        List<PinchAnalysis_DLL.NormalStream> Streams = new List<PinchAnalysis_DLL.NormalStream>();
        List<PinchAnalysis_DLL.UtilityStream> UtilityStreams = new List<PinchAnalysis_DLL.UtilityStream>();

        [HttpPost]
        [Route("postStreams")]
        public IHttpActionResult postStreams(StreamModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // check if no utilities entered --> match streams together
            if(model.hotUtilityStreams.Count == 0 && model.coldUtilityStreams.Count == 0)
            {
                foreach (var item in model.hotStreams)
                {
                    item.exchangerType = ExchangerType.Cooler;
                }

                foreach (var item in model.coldStreams)
                {
                    item.exchangerType = ExchangerType.Heater;
                }

                var HS = model.hotStreams;
                var CS = model.coldStreams;

                for (int i = 0; i < HS.Count; i++)
                {
                    for (int j = 0; j < CS.Count; j++)
                    {
                        if (CS[j].exchangerType == ExchangerType.Heat_Exchanger) continue;
                        if (HS[i].Duty == CS[j].Duty)
                        {
                            HS[i].exchangerType = ExchangerType.Heat_Exchanger;
                            CS[j].exchangerType = ExchangerType.Heat_Exchanger;
                        }
                    }
                }
            }


            foreach (var item in model.hotStreams)
            {
                if (model.DutyType == 0)
                    Streams.Add(new PinchAnalysis_DLL.hotStream(item.name, model.Approach, item.Supply, item.Target, item.Duty,0,0, model.Units, item.exchangerType ,item.utility));
                else Streams.Add(new PinchAnalysis_DLL.hotStream(item.name, model.Approach, item.Supply, item.Target, -1,1,item.Duty, model.Units, item.exchangerType, item.utility));
            }

            foreach (var item in model.coldStreams)
            {
                if (model.DutyType == 0)
                    Streams.Add(new PinchAnalysis_DLL.coldStream(item.name, model.Approach, item.Supply, item.Target, item.Duty, 0, 0, model.Units, item.exchangerType,item.utility));
                else Streams.Add(new PinchAnalysis_DLL.coldStream(item.name, model.Approach, item.Supply, item.Target, -1, 1, item.Duty, model.Units, item.exchangerType, item.utility));
            }

            UtilityStreams = FillUtilityStreamLists(UtilityStreams, model);

            this.formNumber = 1;
            if (model.optimize == false) return Calculate(Streams, UtilityStreams, model.Approach);
            else return null;
        }

        [HttpPost]
        [Route("postExchangers")]
        public IHttpActionResult postExchangers(ExchangerModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            List<PinchAnalysis_DLL.NormalStream> Streams = new List<PinchAnalysis_DLL.NormalStream>();

            foreach (var exchanger in model.Exchangers)
            {
                double hotDuty;
                double coldDuty;

                if (model.DutyType == 0)
                {
                    if (exchanger.exchangerType != ExchangerType.Cooler) { hotDuty = exchanger.duty / (exchanger.hotGroup.hotSupply - exchanger.hotGroup.hotTarget); }
                    if (exchanger.exchangerType != ExchangerType.Heater) coldDuty = exchanger.duty / (exchanger.coldGroup.coldTarget - exchanger.coldGroup.coldSupply);
                }
                else
                {
                    hotDuty = coldDuty = exchanger.duty;
                }


                if (exchanger.exchangerType != ExchangerType.Cooler )
                {
                    hotStream hotStream = new hotStream(exchanger.name, model.Approach, exchanger.hotGroup.hotSupply, exchanger.hotGroup.hotTarget, exchanger.duty, 0, 0, model.Units, exchanger.exchangerType, exchanger.utility);
                    Streams.Add(hotStream);
                }
                if (exchanger.exchangerType != ExchangerType.Heater)
                {
                    coldStream coldStream = new coldStream(exchanger.name, model.Approach, exchanger.coldGroup.coldSupply, exchanger.coldGroup.coldTarget, exchanger.duty, 0, 0, model.Units, exchanger.exchangerType, exchanger.utility);
                    Streams.Add(coldStream);
                }
            }
            //List<PinchAnalysis_DLL.UtilityStream> UtilityStreams = new List<PinchAnalysis_DLL.UtilityStream>();
            UtilityStreams = FillUtilityStreamLists(UtilityStreams, model);

            this.formNumber = 2;

            if (model.optimize == false) return Calculate(Streams, UtilityStreams, model.Approach);
            else return null;
        }

        [HttpPost]
        [Route("postStreamsOptimize")]
        public IHttpActionResult postStreamsOptimize(StreamModel model)
        {
            MaxApproach = GetMaxTemp(model,0);
            
            List <CostCalc> CostCalcList = new List<CostCalc>();
            List<Point> CAPEXLine = new List<Point>();
            List<Point> OPEXLine = new List<Point>();
            List<Point> TotalCostLine = new List<Point>();

            for (int i = 1; i <= MaxApproach;  i++)
            {
                getPinchPoint trial =PinchFun(model, i, 0);

                double? HotUtilityCostPerHour = trial.UtilityStreams.Where(a => a.GetType() == typeof(PinchAnalysis_DLL.HotUtilityStream)).Sum(a => a.OptimiumDuty * a.Cost);
                double? ColdUtilityCostPerHour = trial.UtilityStreams.Where(a => a.GetType() == typeof(PinchAnalysis_DLL.ColdUtilityStream)).Sum(a => a.OptimiumDuty * a.Cost);

                var cold = trial.UtilityStreams.Where(a => a.GetType() == typeof(PinchAnalysis_DLL.ColdUtilityStream));


                CostCalc row = new CostCalc(trial.MaxHeatRecovery, trial.Get_Optimium_UA()/1000000, model.DollarPerUA, model.LifeTime,HotUtilityCostPerHour, ColdUtilityCostPerHour);
                CostCalcList.Add(row);
                CAPEXLine.Add(new Point(i, row.HourlyCAPEX));
                OPEXLine.Add(new Point(i, row.TotalOPEX));
                TotalCostLine.Add(new Point(i, row.TotalCost));


                Streams.Clear();
                UtilityStreams.Clear();
            }

            var OptimumTotalCost = TotalCostLine.OrderBy(a => a.y).FirstOrDefault();
            Point OptimumT = new Point(OptimumTotalCost.x, OptimumTotalCost.y);

            dynamic obj = new ExpandoObject();
            obj.CAPEXLine = CAPEXLine;
            obj.OPEXLine = OPEXLine;
            obj.TotalCostLine = TotalCostLine;
            obj.OptimumT = OptimumT;

            return Ok(obj);
        }
      

        [HttpPost]
        [Route("postExchangersOptimize")]
        public IHttpActionResult postExchangersOptimize(ExchangerModel model)
        {
            MaxApproach = GetMaxTemp(model, 1);

            List<CostCalc> CostCalcList = new List<CostCalc>();
            List<Point> CAPEXLine = new List<Point>();
            List<Point> OPEXLine = new List<Point>();
            List<Point> TotalCostLine = new List<Point>();

            for (int i = 1; i <= MaxApproach; i++)
            {
                getPinchPoint trial =PinchFun(model, i, 1);

                double? HotUtilityCostPerHour = trial.UtilityStreams.Where(a => a.GetType() == typeof(PinchAnalysis_DLL.HotUtilityStream)).Sum(a => a.OptimiumDuty * a.Cost);
                double? ColdUtilityCostPerHour = trial.UtilityStreams.Where(a => a.GetType() == typeof(PinchAnalysis_DLL.ColdUtilityStream)).Sum(a => a.OptimiumDuty * a.Cost);

                CostCalc row = new CostCalc(trial.MaxHeatRecovery, trial.Get_Optimium_UA() / 1000000, model.DollarPerUA, model.LifeTime, HotUtilityCostPerHour, ColdUtilityCostPerHour);
                CostCalcList.Add(row);
                CAPEXLine.Add(new Point(i, row.HourlyCAPEX));
                OPEXLine.Add(new Point(i, row.TotalOPEX));
                TotalCostLine.Add(new Point(i, row.TotalCost));


                Streams.Clear();
                UtilityStreams.Clear();
            }

            double OptimumT = CostCalcList.Min(a => a.TotalCost).GetValueOrDefault();

            dynamic obj = new ExpandoObject();
            obj.CAPEXLine = CAPEXLine;
            obj.OPEXLine = OPEXLine;
            obj.TotalCostLine = TotalCostLine;
            obj.OptimumT = OptimumT;

            return Ok(obj);
        }

        public int GetMaxTemp(PinchDataModels model, int type)
        {
            for (int i = 1; i <= 100; i++)
            {
                model.Approach = i;
                if (type == 0)
                { postStreams((StreamModel)model); }
                else
                { postExchangers((ExchangerModel)model); }

                List<Interval> interval = new List<Interval>();
                List<Net> net = new List<Net>();
                getPinchPoint trial = new getPinchPoint(Streams, UtilityStreams, interval, net, model.Approach, model.Units, this.formNumber);
                trial.getCurrentDuties();
                if (trial.TAppLimitReached())
                {
                    Streams.Clear();
                    UtilityStreams.Clear();
                    return i;
                }
                Streams.Clear();
                UtilityStreams.Clear();
            }
            return 100;
        }

        public void CalculateCurrentApproach(StreamModel model, int type)
        {
            MaxApproach = GetMaxTemp(model, type);

            for (int i = 1; i <= MaxApproach; i++)
            {
                getPinchPoint trial = PinchFun(model, i, type);
                trial.getCurrentDuties();
                if (trial.Qh == trial.CurrentQc)
                {
                    trial.CurrentApproach = i;
                }
            }
        }

        public getPinchPoint PinchFun (PinchDataModels model, int approach, int type)
        {
            model.Approach = approach;
            if (type == 0)
            { postStreams((StreamModel)model); }
            else
            { postExchangers((ExchangerModel)model); }

            List<Interval> interval = new List<Interval>();
            List<Net> net = new List<Net>();
            getPinchPoint trial = new getPinchPoint(Streams, UtilityStreams, interval, net, model.Approach, model.Units, this.formNumber);
            trial.getCurrentDuties();
            trial.drawGccDiagram();
            trial.drawHTDiagram();
            return trial;
        }

        public IHttpActionResult Calculate(List<PinchAnalysis_DLL.NormalStream> streams, List<PinchAnalysis_DLL.UtilityStream> UtilityStreams, double ApproachTemp)
        {
            List<Interval> interval = new List<Interval>();
            List<Net> net = new List<Net>();

            if (CurrentApproach == -1)
            {
                CurrentApproach = Bisection(1, 100, 0.01, streams);
            }
            getPinchPoint getPinch = new getPinchPoint(streams,UtilityStreams, interval, net, ApproachTemp,streams[0].Units,this.formNumber);
            getPinch.drawGccDiagram();
            getPinch.drawHTDiagram();
            getPinch.drawGridDiagram();
            getPinch.getCurrentDuties();
            getPinch.getCurrentDutiesPerUtility();
            getPinch.CurrentApproach = CurrentApproach;
            Solution answer = getPinch.Answer();
            return Ok(answer);
        }

        public double getQh(double approach, List<PinchAnalysis_DLL.NormalStream> streams)
        {
            List<PinchAnalysis_DLL.NormalStream> NewStreams = ExtensionMethods.CloneStreamsWithNewApproach(streams, approach);
            List<Interval> trialInterval = new List<Interval>();
            List<Net> trialNet = new List<Net>();
            getPinchPoint trial = new getPinchPoint(NewStreams, UtilityStreams, trialInterval, trialNet, approach, NewStreams[0].Units, this.formNumber);
            if (approach == 1)
            {
                trial.getCurrentDuties();
                CurrentQh = trial.CurrentQh;
            }
            return Math.Abs(CurrentQh - Math.Abs(trial.Qh));
        }

        public double Bisection(double intervalBegin, double intervalEnd, double precision, List<PinchAnalysis_DLL.NormalStream> streams)
        {
            double middle = 0;
            double BeginValue = getQh(intervalBegin, streams);
            double EndValue = getQh(intervalEnd, streams);

            while (Math.Abs(intervalBegin - intervalEnd) > precision)
            {
                middle = (intervalBegin + intervalEnd) / 2;
                if (BeginValue < EndValue) 
                {
                    test.Add(intervalEnd, EndValue / 1000000);

                    intervalEnd = middle;
                    EndValue = getQh(intervalEnd, streams);
                }
                else
                {
                    test.Add(intervalBegin, BeginValue / 1000000);

                    intervalBegin = middle;
                    BeginValue = getQh(intervalBegin, streams);
                }
            }
            return intervalBegin;
        }


        public List<PinchAnalysis_DLL.UtilityStream> FillUtilityStreamLists(List<PinchAnalysis_DLL.UtilityStream> UtilityStreams, PinchDataModels model)
        {

            if (model.hotUtilityStreams != null)
            {
                foreach (var item in model.hotUtilityStreams)
                {
                    if (model.DutyType == 0)
                        UtilityStreams.Add(new PinchAnalysis_DLL.HotUtilityStream(item.name, model.Approach, item.UtilityApproach, item.Supply, item.Target, item.Duty, 0, 0, model.Units, item.Cost));
                    else UtilityStreams.Add(new PinchAnalysis_DLL.HotUtilityStream(item.name, model.Approach, item.UtilityApproach, item.Supply, item.Target, -1, 1, item.Duty, model.Units, item.Cost));
                }
            }

            if (model.coldUtilityStreams != null)
            {
                foreach (var item in model.coldUtilityStreams)
                {
                    if (model.DutyType == 0)
                        UtilityStreams.Add(new PinchAnalysis_DLL.ColdUtilityStream(item.name, model.Approach, item.UtilityApproach, item.Supply, item.Target, item.Duty, 0, 0, model.Units, item.Cost));
                    else UtilityStreams.Add(new PinchAnalysis_DLL.ColdUtilityStream(item.name, model.Approach, item.UtilityApproach, item.Supply, item.Target, -1, 1, item.Duty, model.Units, item.Cost));
                }
            }
            return UtilityStreams;
        }
    }

    public class CostCalc
    {
        public double HXDuty { get; set; }
        public double UA { get; set; }
        public double HourlyCAPEX { get; set; }
        public double? HotUtilityCostPerHour { get; set; }
        public double? ColdUtilityCostPerHour { get; set; }
        public double? TotalOPEX { get; set; }
        public double? TotalCost { get; set; }

        public CostCalc(double _HXDUty, double _UA, double _DollarPerUA, double _lifetime, double? _HotUtilityCostPerHour, double? _ColdUtilityCostPerHour)
        {
            HXDuty = _HXDUty;
            UA = _UA;
            HotUtilityCostPerHour = _HotUtilityCostPerHour;
            ColdUtilityCostPerHour = _ColdUtilityCostPerHour;
            HourlyCAPEX = UA * _DollarPerUA / _lifetime;
            TotalOPEX = ColdUtilityCostPerHour + HotUtilityCostPerHour;
            TotalCost = TotalOPEX + HourlyCAPEX;
        }
    }
}
