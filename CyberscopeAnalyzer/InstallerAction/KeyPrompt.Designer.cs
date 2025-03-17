namespace InstallerAction
{
    partial class KeyPrompt
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
            this.label2 = new System.Windows.Forms.Label();
            this.apiKeyInput = new System.Windows.Forms.MaskedTextBox();
            this.button2 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(108, 36);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(73, 13);
            this.label2.TabIndex = 0;
            this.label2.Text = "Vul API key in";
            // 
            // apiKeyInput
            // 
            this.apiKeyInput.Location = new System.Drawing.Point(111, 53);
            this.apiKeyInput.Mask = "0000-0000-0000-0000";
            this.apiKeyInput.Name = "apiKeyInput";
            this.apiKeyInput.Size = new System.Drawing.Size(114, 20);
            this.apiKeyInput.TabIndex = 1;
            this.apiKeyInput.MaskInputRejected += new System.Windows.Forms.MaskInputRejectedEventHandler(this.apiKeyInput_MaskInputRejected);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(111, 97);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 2;
            this.button2.Text = "Installeren";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // KeyPrompt
            // 
            this.ClientSize = new System.Drawing.Size(575, 261);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.apiKeyInput);
            this.Controls.Add(this.label2);
            this.Name = "KeyPrompt";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.MaskedTextBox maskedTextBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.MaskedTextBox apiKeyInput;
        private System.Windows.Forms.Button button2;
    }
}

