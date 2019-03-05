using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using PinchAnalysis_DLL;

namespace TestApp
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        int pointX = 80;
        int pointYH = 40;
        int pointYC = 40;

        private void btn_hot_Click(object sender, EventArgs e)
        {
            TextBox boxSupply = new TextBox();
            TextBox boxTarget = new TextBox();
            TextBox boxDuty = new TextBox();
            Label lbl = new Label();

            
            boxSupply.Text = "Supply";
            boxTarget.Text = "Target";
            boxDuty.Text = "Duty";

            boxSupply.Size = new Size(60, 40);
            boxTarget.Size = new Size(60, 40);
            boxDuty.Size = new Size(60, 40);

            lbl.Location = new Point(pointX - 30, pointYH);
            boxSupply.Location=new Point(pointX, pointYH);
            boxTarget.Location = new Point(pointX+70, pointYH);
            boxDuty.Location = new Point(pointX+140, pointYH);

            panelHot.Controls.Add(boxSupply);
            panelHot.Controls.Add(boxTarget);
            panelHot.Controls.Add(boxDuty);
            panelHot.Controls.Add(lbl);

            int x = panelHot.Controls.Count / 4;

            lbl.Text = "H" + x;
            boxSupply.Name = "Hot_Supply" + x;
            boxTarget.Name = "Hot_Target" + x;
            boxDuty.Name = "Hot_Duty" + x;

            panelHot.Show();
            panelHot.Refresh();
            pointYH += 30;
        }

        private void btn_cold_Click(object sender, EventArgs e)
        {
            TextBox boxSupply = new TextBox();
            TextBox boxTarget = new TextBox();
            TextBox boxDuty = new TextBox();
            Label lbl = new Label();

            boxSupply.Text = "Supply";
            boxTarget.Text = "Target";
            boxDuty.Text = "Duty";

            boxSupply.Size = new Size(60, 40);
            boxTarget.Size = new Size(60, 40);
            boxDuty.Size = new Size(60, 40);

            lbl.Location = new Point(pointX - 30, pointYC);
            boxSupply.Location = new Point(pointX, pointYC);
            boxTarget.Location = new Point(pointX + 70, pointYC);
            boxDuty.Location = new Point(pointX + 140, pointYC);

            panelCold.Controls.Add(boxSupply);
            panelCold.Controls.Add(boxTarget);
            panelCold.Controls.Add(boxDuty);
            panelCold.Controls.Add(lbl);

            int x = panelCold.Controls.Count / 4;

            lbl.Text = "C" + x;
            boxSupply.Name = "cold_Supply" + x;
            boxTarget.Name = "cold_Target" + x;
            boxDuty.Name = "cold_Duty" + x;

            panelCold.Show();
            panelCold.Refresh();
            pointYC += 30;
        }

        private void btn_submit_Click(object sender, EventArgs e)
        {
            int H = panelHot.Controls.Count /4;
            int C = panelCold.Controls.Count / 4;
            List<Stream> Streams = new List<Stream>();
            var appr = double.Parse(txt_appTemp.Text);

            for (int i = 0; i < H; i++)
            {
                var j = i + 1;
                string s = "Hot_Supply" + j.ToString();
                var d = panelHot.Controls;
                var supp = double.Parse(((TextBox)panelHot.Controls["Hot_Supply"+j.ToString()]).Text);
                var targ = double.Parse(((TextBox)panelHot.Controls["Hot_Target" +j.ToString()]).Text); ;
                var duty = double.Parse(((TextBox)panelHot.Controls["Hot_Duty" +j.ToString()]).Text); ;
                Streams.Add(new hotStream(appr, supp, targ, duty));
            }

            for (int i = 0; i < C; i++)
            {
                var j = i + 1;
                var supp = double.Parse(((TextBox)panelCold.Controls["Cold_Supply" + j.ToString()]).Text);
                var targ = double.Parse(((TextBox)panelCold.Controls["Cold_Target" + j.ToString()]).Text); ;
                var duty = double.Parse(((TextBox)panelCold.Controls["Cold_Duty" + j.ToString()]).Text); ;
                Streams.Add(new coldStream(appr, supp, targ, duty));
            }

            List<Interval> interval = new List<Interval>();
            List<Net> net = new List<Net>();
            getPinchPoint trial = new getPinchPoint(Streams,interval,net,appr);

            Interval answer = trial.Answer();

            txt_t.Text = answer.IntervalTemp.ToString();
            txt_tHot.Text = answer.HotInterval.ToString();
            txt_tCold.Text = answer.ColdInterval.ToString();

        }
    }
}
