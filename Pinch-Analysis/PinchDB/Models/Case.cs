using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchDB.Models
{
    public class Case
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("user")]
        public string UserId { get; set; }
        public string CaseInput { get; set; }
        public string CaseName { get; set; }
        public string CaseDescription { get; set; }
        public string HT_Comment { get; set; }
        public string GCC_Comment { get; set; }
        public string Grid_Comment { get; set; }
        public Boolean isDeleted { get; set; }

        public DateTime Date { get; set; }

        public virtual User user { get; set; }

        public Case()
        {
            Date = DateTime.Now;
        }
    }
}
