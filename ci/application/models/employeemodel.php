<?

class EmployeeModel extends Model {

    function getEmployee($empId) {
        if ($empId) {
            $this->db->where('id', $empId);
            $rows = $this->db->get('employees')->result();
            $employee = $rows[0];
            
            $employee->success = true;
            return $employee;
        }
    }

    function setEmployee($data)  {
        if ($data) {
            if (is_object($data)) {

                if (strlen($data->dateFired) < 2) {
                    unset($data->dateFired);
                }
                $this->db->set($data);
                $this->db->where('id', $data->id);
                $this->db->update('employees');

                return $this->getEmployee($data->id);
            }
            else if (isset($data['id']) && $data['id'] > 0) {
                if (strlen($data['dateFired']) < 2) {
                    unset($data['dateFired']);
                }
                $this->db->set($data);
                $this->db->where('id', $data['id']);
                $this->db->update('employees');

                return $this->getEmployee($data['id']);
            }
            else {
                unset($data['dateFired']);
                $this->db->set($data);
                $this->db->insert('employees');
                $id = $this->db->insert_id();
                if ($id) {
                    return $this->getEmployee($id);
                }
                else {
                    return FALSE;
                }

            }
        }

    }

    
    function setDepartment($depId,$empId) {
        if ($empId && $depId) {
            $this->db->set('departmentId', $depId);
            $this->db->where('id', $empId);
            $this->db->update('employees');
        }
    }

    function assocEmployeesToDepartment($departmentId, $employeeIds) {
        foreach ($employeeIds as $ind => $employee) {
            $this->setDepartment($departmentId, $employee->id);
        }
        return array('success' => TRUE);
    }


    function listEmployees($id = null) {
        if ($id) {
            $where = array(
                'departmentId' => $id,
                'dateFired' => NULL
            );
            $this->db->where($where);
        }
        $this->db->order_by('upper(lastName)', 'ASC');
        $employees = $this->db->get('employees')->result();

        return $employees;
    }

    function deleteEmployee($id = null) {
        if ($id) {
            $dt = new DateTime();

            $this->db->where('id', $id);
            $this->db->set('dateFired', $dt->format('d/m/Y'));
        }
        $this->db->update('employees');
         return array('success'=>TRUE);
    }

    function deleteEmployees($employees = null) {
        if ($employees) {
            foreach ($employees as $ind => $employee) {
               $this->deleteEmployee($employee->id);
            }
            return array('success'=>TRUE);
        }
        else {
            return false;
        }
    }

    // Generates the proper phone number and email data
//    function genRandNums() {
//        return array(
//            rand(100, 999),
//            rand(100, 999),
//            rand(1000, 9999)
//        );
//    }
//
//    function fixEmployees () {
//        $employees = $this->listEmployees();
//
//
//        foreach ($employees as $ind => $employee) {
//            $nums = $this->genRandNums();
//            $hNumber = $nums[0] . "-" . $nums[1] . "-" . $nums[2];
//
//            $nums = $this->genRandNums();
//            $mNumber = $nums[0] . "-" . $nums[1] . "-" . $nums[2];
//
//            $nums = $this->genRandNums();
//            $oNumber = $nums[0] . "-" . $nums[1] . "-" . $nums[2];
//
//            print $employee->id . " : ";
//            print $hNumber . " : ";
//            print $mNumber . " : ";
//            print $oNumber . " : ";
//
////            $employee->email = strtolower($employee->firstName) . "." . strtolower($employee->lastName) . "@tkeconsulting.com";
//
//
////            print $employee->email;
//            $employee->officePhone = $oNumber;
//            $employee->homePhone = $hNumber;
//            $employee->mobilePHone = $mNumber;
//            $employee->dateFired = NULL;
//
//            print "<br />";
//            $this->setEmployee($employee);
//
//        }
//
//    }
//

//     // Corrects the dateHired data
//     function fixEmployees () {
//         $employees = $this->listEmployees();
//
//         $X = 0;
//         foreach ($employees as $ind => $employee) {
//             $dateHired = explode('/', $employee->dateHired);
//
//             if ($dateHired[2] > 2009) {
//                 $newYear = $dateHired[2] - 10;
//                 print $X . " : " . $employee->id . " : " . $newYear . '<br/>';
//
//                 $employee->dateHired = $dateHired[0] . "/" . $dateHired[1] . "/" . $newYear;
//                 $this->setEmployee($employee);
//                 $X++;
//             }
//
//         }
//
//     }

//     // Corrects the dateFire to dateHire + 1 year
//     function fixEmployees () {
//
//        $where = array('dateFired IS NOT NULL' => NULL);
//        $this->db->where($where);
//
//        $this->db->order_by('upper(lastName)', 'ASC');
//        $employees = $this->db->get('employees')->result();
//
//         foreach ($employees as $ind => $employee) {
//             $dateHired = explode('/', $employee->dateHired);
//
//             $newYear = $dateHired[2] + 1;
//             print  $employee->id . " : " . $newYear . '<br/>';
//
//             $employee->dateFired = $dateHired[0] . "/" . $dateHired[1] . "/" . $newYear;
//
//             $this->setEmployee($employee);
//
//         }
//
//     }

}
?>