using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace GAPTechAPI.Mailing
{
    public class MailConfiguration
    {
        public string Host { set; get; }
        public int Port { set; get; }
        public bool EnableSsl { set; get; }
        private SmtpDeliveryMethod SmtpDeliveryMethod = SmtpDeliveryMethod.Network;
        private bool UseDefaultCredentials = false;
        private NetworkCredential Credentials;
        internal MailAddress Sender { set; get; }

        /// <summary>
        /// Initializes a new instance of the EmailConfig class by using 
        /// the givin sender information.
        /// </summary>
        /// <param name="senderAddress">Sender email address.</param>
        /// <param name="displayName">The display name for the sender.</param>
        /// <param name="password">Sender email password.</param>
        public MailConfiguration(string senderAddress, string displayName, string password)
        {
            this.Sender = new MailAddress(senderAddress, displayName);
            this.Credentials = new NetworkCredential(senderAddress, password);
        }
        /// <summary>
        /// Gets the configured sender client.
        /// </summary>
        /// <returns>Ready to use SMTPClient object.</returns>
        public SmtpClient GetSenderClient()
        {
            SmtpClient smtp = new SmtpClient
            {
                Host = this.Host,
                Port = this.Port,
                EnableSsl = this.EnableSsl,
                DeliveryMethod = this.SmtpDeliveryMethod,
                UseDefaultCredentials = this.UseDefaultCredentials,
                Credentials = this.Credentials
            };

            return smtp;
        }
    }
}
