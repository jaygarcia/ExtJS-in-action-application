<?
date_default_timezone_set('America/New_York');
/**
* TODO: Ensure the director associations are manage properly.
 * That is when an employee is removed or fired, a check is made to
 * clear that employee from director status if the employee is fired or
 * moved to a different department.
*/

class Employees extends Controller {

    function __construct() {
        parent::Controller();
        $this->_loadModels();

    }

    function getEmployee() {
        $empId  =  $this->input->get_post('id', TRUE);
        if (isset($empId)) {
            $employee = $this->employeeModel->getEmployee($empId);
            $return = array(
                'success' => true,
                'data'    => $employee
            );
            print json_encode($return);
        }
    }


    function setEmployee() {
        $firstName = $this->input->get_post('firstName', TRUE);
        $lastName  = $this->input->get_post('lastName', TRUE);

        if (isset($firstName) && isset($lastName)) {
            // strict control on what columns are set for the database insert/update
            $data = array(
                'id'           => $this->input->get_post('id', TRUE),
                'firstName'    => $firstName,
                'lastName'     => $lastName,
                'middle'       => $this->input->get_post('middle', TRUE),
                'title'        => $this->input->get_post('title', TRUE),
                'street'       => $this->input->get_post('street', TRUE),
                'city'         => $this->input->get_post('city', TRUE),
                'state'        => $this->input->get_post('state', TRUE),
                'zip'          => $this->input->get_post('zip', TRUE),
                'departmentId' => $this->input->get_post('departmentId', TRUE),
                'dateHired'    => $this->input->get_post('dateHired', TRUE),
                'dateFired'    => $this->input->get_post('dateFired', TRUE),
                'dob'          => $this->input->get_post('dob', TRUE),
                'rate'         => $this->input->get_post('rate', TRUE),
                'officePhone'  => $this->input->get_post('officePhone', TRUE),
                'homePhone'    => $this->input->get_post('homePhone', TRUE),
                'mobilePhone'  => $this->input->get_post('mobilePhone', TRUE),
                'email'        => $this->input->get_post('email', TRUE)
            );

           
            $employee = $this->employeeModel->setEmployee($data);
            $return = array(
                'success' => (isset($employee)) ? TRUE : FALSE,
                'data'    => $employee
            );
        }
        else {
            $return = array(
                'success' => false,
                'msg'     => "firstName and lastName fields must be left blank!"
            );
        }
        print json_encode($return);
    }

    function listForDepartment() {
        $deptId  =  $this->input->get_post('id', TRUE);
        if (strlen($deptId) > 0) {
            $employees = $this->employeeModel->listEmployees($deptId);
            foreach ($employees as $ind => $employee) {
                $employee->fullName = $employee->lastName . ', ' . $employee->firstName;
            }
            $return = $employees;
        }
        else {
            $return = array(
                'success' => FALSE,
                'msg'     => 'Need department id to query.'
            );
        }
        print json_encode($return);
    }

    function listEmployees() {
        print json_encode($this->employeeModel->listEmployees());
    }

    function deleteEmployee() {
        $empId  =  $this->input->get_post('id', TRUE);
        if (strlen($empId) > 0) {
            $return = $this->employeeModel->deleteEmployee($empId);
        }
        else {
            $return = array(
                'success' => FALSE,
                'msg'     => 'No employee IDs to delete'
            );
        }
        print json_encode($return);
    }

    function deleteEmployees() {
        $employeeIds =  $this->input->get_post('employeeIds', TRUE);
        if (strlen($employeeIds) > 0) {
            $employeeIds = json_decode($employeeIds);
            $return =  $this->employeeModel->deleteEmployees($employeeIds);
        }
        else {
            $return = array(
                'success' => FALSE,
                'msg'     => 'No employee IDs to delete'
            );
        }
        print json_encode($return);
    }

    function assocToDepartment() {
        $departmentId = $this->input->get_post('departmentId', TRUE);
        $employeeIds  = $this->input->get_post('employeeIds', TRUE);

        if (strlen($departmentId) > 0 && strlen($employeeIds) > 1) {
            $employeeIds = json_decode($employeeIds);
            $return = $this->employeeModel->assocEmployeesToDepartment($departmentId, $employeeIds);
        }
        else {
            $return = array(
                'success' => FALSE,
                'msg'     => 'departmentId or employeeIds are required!'
            );

        }
        print json_encode($return);
    }
//
//    function fixEmployees() {
//        $this->employeeModel->fixEmployees();
//    }

    private function _loadModels () {
        $this->load->model('EmployeeModel', 'employeeModel');
    }
}