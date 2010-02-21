<?

class DepartmentsModel extends Model {
    
    function getDepartments() {
        $this->db->where('dateInactive is NULL');
        $this->db->order_by('upper(name)', 'ASC');
        
        return $this->db->get('departments')->result();
    }

    function getDepartment($id = null, $fetchEmployees = false) {
        if ($id) {
            $this->db->where('id', $id);

            if ($departmentInfo =  $this->db->get('departments')->result()) {
                $department = $departmentInfo[0];
                if ($fetchEmployees) {
                    $this->_loadEmployeeModel();
                    $department->employees = $this->_employeeModel->listEmployees($id);
                    return $department;
                }
                else {
                    return $department;
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    /**
     * @function setDepartment set the attributes for a department
     * @param  $departmentObj
     * @return #M#CDepartmentsModel.getDepartment|?
     */
    function setDepartment($department = array()) {
        $this->department = $department;

        // update
        if ($department->id && $department->name) {

            $this->db->where('id', $department->id);
            $this->db->update('departments', $department);

            return $this->getDepartment($department->id, true);
        }
        // insert
        else if (! $department->id && $department->name) {
            $department->dateInactive = null;
            $this->db->insert('departments', $department);

            $this->id = $this->db->insert_id();

            return $this->getDepartment($this->id, true);
        }
        else {
            return null;
        }
    }

    function associateEmployees($departmentId, $employees) {
        $this->_loadEmployeeModel();

        if ($departmentId && is_array($employees)) {
            foreach ($employees as $empToSet) {
                if ($empToSet->id) {
                    $this->_employeeModel->setDepartment($empToSet->id, $departmentId);
                }
            }
        }
    }
//
//    function disassociateEmployees($id, $employees) {
//        $this->_loadEmployeeModel();
//
//        if ($id && is_array($employees)) {
//            foreach ($employees as $empToUnset) {
//                $employee = $this->_employeeModel->getEmployee($empToUnset->id);
//                if ($employee->departmentId === $this->department->id) {
//                    $this->_employeeModel->deleteEmployee($employee->id);
//                }
//            }
//        }
//    }

    function unsetDepartment($id) {
        if ($id) {
            $this->_loadEmployeeModel();
            $this->department = $this->getDepartment($id);
            $employees = $this->_employeeModel->listEmployees($id);

            $dt = new DateTime();

            $this->db->set('dateInactive', $dt->format('d/m/Y'));
            $this->db->where('id', $id);
            $this->db->update('departments');
            return true;
        }
        else {
           return false;
        }

    }

    function _loadEmployeeModel() {
        if (! isset($this->_employeeModel)) {
            $CI =& get_instance();
            $CI->load->model('EmployeeModel', 'employeeModel');
            $this->_employeeModel = $CI->employeeModel;
        }
    }

}

?>