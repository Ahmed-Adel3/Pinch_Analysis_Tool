namespace TestApp
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btn_hot = new System.Windows.Forms.Button();
            this.btn_cold = new System.Windows.Forms.Button();
            this.btn_submit = new System.Windows.Forms.Button();
            this.panelHot = new System.Windows.Forms.Panel();
            this.panelCold = new System.Windows.Forms.Panel();
            this.txt_appTemp = new System.Windows.Forms.TextBox();
            this.txt_t = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.txt_tHot = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.txt_tCold = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // btn_hot
            // 
            this.btn_hot.Location = new System.Drawing.Point(133, 43);
            this.btn_hot.Name = "btn_hot";
            this.btn_hot.Size = new System.Drawing.Size(126, 38);
            this.btn_hot.TabIndex = 0;
            this.btn_hot.Text = "Add Hot Stream";
            this.btn_hot.UseVisualStyleBackColor = true;
            this.btn_hot.Click += new System.EventHandler(this.btn_hot_Click);
            // 
            // btn_cold
            // 
            this.btn_cold.Location = new System.Drawing.Point(487, 44);
            this.btn_cold.Name = "btn_cold";
            this.btn_cold.Size = new System.Drawing.Size(128, 36);
            this.btn_cold.TabIndex = 1;
            this.btn_cold.Text = "Add Cold Stream";
            this.btn_cold.UseVisualStyleBackColor = true;
            this.btn_cold.Click += new System.EventHandler(this.btn_cold_Click);
            // 
            // btn_submit
            // 
            this.btn_submit.Location = new System.Drawing.Point(365, 347);
            this.btn_submit.Name = "btn_submit";
            this.btn_submit.Size = new System.Drawing.Size(178, 20);
            this.btn_submit.TabIndex = 2;
            this.btn_submit.Text = "Submit";
            this.btn_submit.UseVisualStyleBackColor = true;
            this.btn_submit.Click += new System.EventHandler(this.btn_submit_Click);
            // 
            // panelHot
            // 
            this.panelHot.Location = new System.Drawing.Point(25, 113);
            this.panelHot.Name = "panelHot";
            this.panelHot.Size = new System.Drawing.Size(316, 220);
            this.panelHot.TabIndex = 3;
            // 
            // panelCold
            // 
            this.panelCold.Location = new System.Drawing.Point(384, 113);
            this.panelCold.Name = "panelCold";
            this.panelCold.Size = new System.Drawing.Size(315, 220);
            this.panelCold.TabIndex = 4;
            // 
            // txt_appTemp
            // 
            this.txt_appTemp.Location = new System.Drawing.Point(121, 347);
            this.txt_appTemp.Name = "txt_appTemp";
            this.txt_appTemp.Size = new System.Drawing.Size(238, 20);
            this.txt_appTemp.TabIndex = 5;
            this.txt_appTemp.Text = "Approach Temperature";
            // 
            // txt_t
            // 
            this.txt_t.Location = new System.Drawing.Point(347, 391);
            this.txt_t.Name = "txt_t";
            this.txt_t.Size = new System.Drawing.Size(172, 20);
            this.txt_t.TabIndex = 6;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(278, 394);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(44, 13);
            this.label1.TabIndex = 7;
            this.label1.Text = "Pinch T";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(253, 97);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(29, 13);
            this.label4.TabIndex = 8;
            this.label4.Text = "Duty";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(182, 97);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(38, 13);
            this.label3.TabIndex = 9;
            this.label3.Text = "Target";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(113, 97);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(39, 13);
            this.label2.TabIndex = 10;
            this.label2.Text = "Supply";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(608, 97);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(29, 13);
            this.label5.TabIndex = 11;
            this.label5.Text = "Duty";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(537, 97);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(38, 13);
            this.label6.TabIndex = 12;
            this.label6.Text = "Target";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(468, 97);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(39, 13);
            this.label7.TabIndex = 13;
            this.label7.Text = "Supply";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(278, 420);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(64, 13);
            this.label8.TabIndex = 15;
            this.label8.Text = "Pinch Hot T";
            // 
            // txt_tHot
            // 
            this.txt_tHot.Location = new System.Drawing.Point(347, 417);
            this.txt_tHot.Name = "txt_tHot";
            this.txt_tHot.Size = new System.Drawing.Size(172, 20);
            this.txt_tHot.TabIndex = 14;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(278, 446);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(68, 13);
            this.label9.TabIndex = 17;
            this.label9.Text = "Pinch Cold T";
            // 
            // txt_tCold
            // 
            this.txt_tCold.Location = new System.Drawing.Point(347, 443);
            this.txt_tCold.Name = "txt_tCold";
            this.txt_tCold.Size = new System.Drawing.Size(172, 20);
            this.txt_tCold.TabIndex = 16;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(722, 502);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.txt_tCold);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.txt_tHot);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.txt_t);
            this.Controls.Add(this.txt_appTemp);
            this.Controls.Add(this.panelCold);
            this.Controls.Add(this.panelHot);
            this.Controls.Add(this.btn_submit);
            this.Controls.Add(this.btn_cold);
            this.Controls.Add(this.btn_hot);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btn_hot;
        private System.Windows.Forms.Button btn_cold;
        private System.Windows.Forms.Button btn_submit;
        private System.Windows.Forms.Panel panelHot;
        private System.Windows.Forms.Panel panelCold;
        private System.Windows.Forms.TextBox txt_appTemp;
        private System.Windows.Forms.TextBox txt_t;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox txt_tHot;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.TextBox txt_tCold;
    }
}

