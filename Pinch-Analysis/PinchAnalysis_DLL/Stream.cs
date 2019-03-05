using System;

namespace PinchAnalysis_DLL
{
    public abstract class Stream
    {
        //public double ApproachTemp { get; set; }

        public string name { get; set; }
        public double SupplyTemp { get; set; }
        public double TargetTemp { get; set; }

        public double intervalSupply { get; set; }
        public double intervalTarget { get; set; }

        public double Duty { get; set; }
        public double mass { get; set; }
        public double Cp { get; set; }
        public double MCp { get; set; }

        public int Units { get; set; }
        public Boolean connected { get; set; }


        public ExchangerType exchangerType { get; set; }

        public Stream(string _name, double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units, ExchangerType _exchangerType)
        {
            name = _name;
            SupplyTemp = _SupplyTemp;
            TargetTemp = _TargetTemp;
            Duty = _Duty;
            mass = _m;
            Cp = _Cp;
            Units = _Units;
            exchangerType = _exchangerType;
        }
    }

    public class NormalStream : Stream
    {
        public string utility { get; set; }

        public NormalStream(string _name, double _ApproachTemp, double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units, ExchangerType _exchangerType, string _utility)
            :base(_name, _SupplyTemp, _TargetTemp, _Duty, _m, _Cp, _Units, _exchangerType)
        {
            utility = _utility;
        }
    }


    public class hotStream : NormalStream
    {
        public hotStream(string _name, double _ApproachTemp, double _SupplyTemp, double _TargetTemp, double _Duty,double _m, double _Cp, int _Units, ExchangerType _exchangerType, string _utility) 
            :base(_name,_ApproachTemp,_SupplyTemp,_TargetTemp,_Duty, _m, _Cp, _Units, _exchangerType, _utility)
        {
            intervalSupply = SupplyTemp - (_ApproachTemp / 2);
            intervalTarget = TargetTemp - (_ApproachTemp / 2);

            if (Duty == -1) { Duty = (mass * Cp * (SupplyTemp - TargetTemp)); MCp = mass * Cp; }
            else MCp = Duty / (SupplyTemp - TargetTemp);
        }
    }

    public class coldStream : NormalStream
    {
        public coldStream(string _name, double _ApproachTemp, double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units, ExchangerType _utilityType, string _utility) 
            : base(_name, _ApproachTemp, _SupplyTemp, _TargetTemp, _Duty, _m, _Cp,_Units, _utilityType,_utility)
        {
            intervalSupply = SupplyTemp + (_ApproachTemp / 2);
            intervalTarget = TargetTemp + (_ApproachTemp / 2);

            if (Duty == -1) { Duty = (mass * Cp * (TargetTemp - SupplyTemp)); MCp = mass * Cp; }
            else MCp = Duty / (TargetTemp - SupplyTemp);
        }
    }

    public abstract class  UtilityStream : Stream
    {
        public double UtilityApproach { get; set; }
        public double Cost { get; set; }
        public double? OptimiumDuty { get; set; }
        public double? CurrentDuty { get; set; }

        public UtilityStream(string _name, double _ApproachTemp, double _UtilityApproach ,double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units, double _Cost)
             : base(_name, _SupplyTemp, _TargetTemp, _Duty, _m, _Cp, _Units,0)
        {
            UtilityApproach = _UtilityApproach;
            Cost = _Cost;
        }
    }

    public class HotUtilityStream : UtilityStream
    {
        public HotUtilityStream(string _name, double _ApproachTemp, double _UtilityApproach, double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units,double _Cost)
             : base(_name, _ApproachTemp,_UtilityApproach, _SupplyTemp, _TargetTemp, _Duty, _m, _Cp, _Units,_Cost)
        {
            intervalSupply = SupplyTemp - UtilityApproach + (_ApproachTemp/2);
            intervalTarget = TargetTemp - UtilityApproach + (_ApproachTemp / 2);

            if (Duty == -1) { Duty = (mass * Cp * (SupplyTemp - TargetTemp)); MCp = mass * Cp; }
            else MCp = Duty / (SupplyTemp - TargetTemp);
        }
    }

    public class ColdUtilityStream : UtilityStream
    {
        public ColdUtilityStream(string _name, double _ApproachTemp, double _UtilityApproach, double _SupplyTemp, double _TargetTemp, double _Duty, double _m, double _Cp, int _Units, double _Cost)
             : base(_name, _ApproachTemp, _UtilityApproach, _SupplyTemp, _TargetTemp, _Duty, _m, _Cp, _Units,_Cost)
        {
            intervalSupply = SupplyTemp + UtilityApproach - (_ApproachTemp / 2);
            intervalTarget = TargetTemp + UtilityApproach - (_ApproachTemp / 2);

            if (Duty == -1) { Duty = (mass * Cp * (SupplyTemp - TargetTemp)); MCp = mass * Cp; }
            else MCp = Duty / (SupplyTemp - TargetTemp);
        }
    }



    public enum ExchangerType
    {
        Heat_Exchanger,
        Cooler,
        Heater
    }
}
