using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models;
public class EmployeeModel {
    public int ID { get; set; }
    public string FirstName { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? HireDate { get; set; }
}
