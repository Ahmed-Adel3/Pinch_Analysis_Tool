using PinchAnalysis_DLL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{

    public abstract class PinchDataModels {

        public int DutyType { get; set; }
        [Required]
        public double Approach { get; set; }

        public List<HotUtilityStream> hotUtilityStreams { get; set; }

        public List<ColdUtilityStream> coldUtilityStreams { get; set; }
        public int Units { get; set; }
        public Boolean optimize { get; set; }
        public double DollarPerUA { get; set; }
        public double LifeTime { get; set; }

    }

    public class StreamModel : PinchDataModels
    { 
        [Required]
        public List<HotStream> hotStreams { get; set; }
        [Required]
        public List<ColdStream> coldStreams { get; set; }
        [Required]
        public string CaseName { get; set; }
    }

    public class ExchangerModel : PinchDataModels
    {
        [Required]
        public List<Exchanger> Exchangers { get; set; }
    }

    public class Exchanger
    {
        public string name { get; set; }
        public HotGroup hotGroup { get; set; }
        public ColdGroup coldGroup { get; set; }
        public double duty { get; set; }
        public string utility { get; set; }

        public ExchangerType exchangerType { get; set; }
    }

    public class CaseModel
    {
        [Required]
        public string CaseInputs { get; set; }
        [Required]
        public string CaseName { get; set; }
        public string CaseDescription { get; set; }
    }

    public class HotGroup
    {
        public double hotSupply { get; set; }
        public double hotTarget { get; set; }
    }

    public class ColdGroup
    {
        public double coldSupply { get; set; }
        public double coldTarget { get; set; }
    }


    public class Stream
    {
        [Required]
        public string name { get; set; }

        [Required]
        public double Supply { get; set; }

        [Required]
        public double Target { get; set; }

        [Required]
        public double Duty { get; set; }

        [Required]
        public ExchangerType exchangerType { get; set; }

        public Stream(string _name, double _Supply, double _Target, double _Duty, ExchangerType _exchangerType)
        {
            name = _name;
            Supply = _Supply;
            Target = _Target;
            Duty = _Duty;
            exchangerType = _exchangerType;
        }
    }

    public class NormalStream : Stream
    {
        public string utility { get; set; }

        public NormalStream(string _name, double _Supply, double _Target, double _Duty, ExchangerType _exchangerType, string _utility)
            : base(_name, _Supply, _Target, _Duty, _exchangerType)
        {
            name = _name;
            Supply = _Supply;
            Target = _Target;
            Duty = _Duty;
            exchangerType = _exchangerType;
            utility = _utility;
        }
    }

    public class HotStream:NormalStream
    {
        public HotStream(string _name, double _SupplyTemp, double _TargetTemp, double _Duty, ExchangerType _exchangerType, string _utility)
                        : base(_name, _SupplyTemp, _TargetTemp, _Duty, _exchangerType, _utility)
        {
        }
    }

    public class ColdStream : NormalStream
    {
        public ColdStream(string _name, double _SupplyTemp, double _TargetTemp, double _Duty, ExchangerType _exchangerType ,string _utility)
                : base(_name, _SupplyTemp, _TargetTemp, _Duty, _exchangerType, _utility)
        {
        }
    }

    public class UtilityStream : Stream
    {
        [Required]
        public double UtilityApproach  { get; set; }
        public double Cost { get; set; }
        public double? OptimiumDuty { get; set; }
        public double? CurrentDuty { get; set; }


        public UtilityStream(string _name, double _UtilityApproach, double _SupplyTemp, double _TargetTemp, double _Duty,double _Cost)
                : base(_name, _SupplyTemp, _TargetTemp, _Duty,0)
        {
            UtilityApproach = _UtilityApproach;
            Cost = _Cost;
        }
    }

    public class HotUtilityStream : UtilityStream
    {
        public HotUtilityStream(string _name, double _UtilityApproach, double _SupplyTemp, double _TargetTemp, double _Duty, double _Cost)
                : base(_name, _UtilityApproach , _SupplyTemp, _TargetTemp, _Duty,_Cost)
        {

        }
    }

    public class ColdUtilityStream : UtilityStream
    {
        public ColdUtilityStream(string _name, double _UtilityApproach, double _SupplyTemp, double _TargetTemp, double _Duty,double _Cost)
                : base(_name, _UtilityApproach, _SupplyTemp, _TargetTemp, _Duty,_Cost)
        {

        }
    }

}