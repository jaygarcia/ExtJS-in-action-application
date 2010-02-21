<?
class Department {};
date_default_timezone_set('America/New_York');
class Departments extends Controller {
    var $id, $name, $description;

    /**
     * @constructor Departments
     * @return void
     */
    function Departments() {
        parent::Controller();
        $this->load->model('DepartmentsModel', 'departmentsModel');
        
        $this->id         =  $this->input->get_post('id', TRUE);
        $this->department =  new Department();
        $this->department->dateActive  = $this->input->get_post('dateActive', TRUE);
        $this->department->id          = $this->input->get_post('id', TRUE);
        $this->department->description = $this->input->get_post('description', TRUE);
        $this->department->name        = $this->input->get_post('name', TRUE);
        
    }
    /**
     * @function getList returns list of departments via JSON data
     * @return void
     */
    function getList() {

        $data = json_encode($this->departmentsModel->getDepartments());
        print $data;
    }

    /**
     * @function getEmployees returns a list of employees for a particular
     * @return void
     */
    function getEmployees() {
        if ($this->id) {
            print json_encode($this->departmentsModel->getEmployees($this->id));
        }
        else {
            $this->_printSuccessFalse();
        }
    }

    function getDepartment() {
        if ($this->id) {
            $data = $this->departmentsModel->getDepartment($this->id);

            $this->_printSuccessTrue($data);
        }
        else {
            $this->_printSuccessFalse();
        }
    }


    function setDepartment() {
    
        if ($this->department) {
            $data = $this->departmentsModel->setDepartment($this->department);

            if ($data) {
                $this->_printSuccessTrue(array(
                    "data" => $data
                ));
            }
            else {
                $this->_printSuccessFalse('No data?');
            }
        }
        else {
            $this->_printSuccessFalse('Unknown error');       
        }
    }


    function unsetDepartment() {
        if ($this->id) {
            if ($this->departmentsModel->unsetDepartment($this->id)) {
                $this->_printSuccessTrue();
            }
            else {
                $this->_printSuccessFalse();
            }
        }
    }

    private   function _printSuccessTrue($data = null) {
        if ($data && is_object($data)){
            $data->success  = true;
            print json_encode($data);
        }
        else if ($data && is_array($data)){
            $data['success'] = true;
            print json_encode($data);
        }
        else {
            print "{success:true}";
        }

    }

    private function _printSuccessFalse($msg='') {
         print json_encode(array(
            'success' => false,
            'message' => $msg
         ));
    }

}


?>