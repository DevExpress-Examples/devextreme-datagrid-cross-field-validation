using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models;
static class SampleData {
    public static List<EmployeeModel> Employees = [
        new EmployeeModel {
                ID = 1,
                FirstName = "John",
                BirthDate = new DateTime(1995, 1, 1),
                HireDate = new DateTime(1995, 1, 15)
        },
        new EmployeeModel {
            ID = 2,
            FirstName = "Olivia",
            BirthDate = new DateTime(1981, 6, 3),
            HireDate = new DateTime(2012, 5, 14)
        },
        new EmployeeModel {
            ID = 3,
            FirstName = "Robert",
            BirthDate = new DateTime(1974, 9, 7),
            HireDate = new DateTime(2002, 11, 8)
        },
        new EmployeeModel {
            ID = 4,
            FirstName = "Greta",
            BirthDate = new DateTime(1977, 11, 22),
            HireDate = new DateTime(1998, 4, 23)
        }
    ];
}
