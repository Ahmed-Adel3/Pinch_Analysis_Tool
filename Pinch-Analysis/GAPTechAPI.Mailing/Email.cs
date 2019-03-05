using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace GAPTechAPI.Mailing
{
    public class Email
    {
        private MailConfiguration senderInfo;

        public Email(MailConfiguration config)
        {
            this.senderInfo = config;
        }
        /// <summary>
        /// Sends email to the specified receiver.
        /// </summary>
        /// <param name="receiverEmail">The email of the receiver.</param>
        /// <param name="subject">Email subject.</param>
        /// <param name="htmlBody">Email body in HTML format.</param>
        public void Send(string receiverEmail, string subject, string htmlBody)
        {
            MailAddress receiver = new MailAddress(receiverEmail);

            using (MailMessage message =
                new MailMessage(this.senderInfo.Sender, receiver)
                {
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                })
            {
                this.senderInfo.GetSenderClient().Send(message);
            }
        }
    }
}
