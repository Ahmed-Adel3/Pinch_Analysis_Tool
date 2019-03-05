using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class SaveChartCommentModel
    {
        [Required]
        public int CaseId { get; set; }
        [Required]
        public string Chart { get; set; }
        [Required]
        public string  Comment { get; set; }
        [Required]
        public Boolean isDeleted { get; set; }
    }
}