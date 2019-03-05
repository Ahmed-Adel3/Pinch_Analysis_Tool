using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PinchDB.Models
{
    public class Role : IdentityRole
    {
        public Role() : base()
        {
            this.IsDeleted = false;
        }
        public Role(string name) : base(name)
        {
            this.IsDeleted = false;
        }
        public bool IsDeleted { get; set; }
    }
}
