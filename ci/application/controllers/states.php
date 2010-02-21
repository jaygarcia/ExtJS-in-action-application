<?
date_default_timezone_set('America/New_York');
class States extends Controller {


    function getList() {
        $this->load->model('StatesModel', 'statesModel');

        print json_encode($this->statesModel->getList());
    }
}
?>