using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace InstallerAction
{
    public partial class KeyPrompt : Form
    {
        public KeyPrompt()
        {
            InitializeComponent();
        }

        private void apiKeyInput_MaskInputRejected(object sender, MaskInputRejectedEventArgs e)
        {
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Get the API key from the input field
            string apiKey = apiKeyInput.Text;

            RegistryKey registryKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\CyberscopeAnalyzer");
            registryKey.SetValue("DeviceKey", apiKey);
            registryKey.Close();

            MessageBox.Show("API key opgeslagen!");
            this.Close();
        }
    }
}
