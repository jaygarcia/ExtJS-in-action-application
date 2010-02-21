<?
date_default_timezone_set('America/New_York');
class Stats extends Controller {

    function __construct() {
        parent::Controller();

        $this->load->model('StatsModel', 'statsModel');
    }

    function getYearlyStats() {
        print json_encode($this->statsModel->getYearlyStats());
    }

    function getDeptBreakdown() {
        $year = $this->input->get_post('year', TRUE);
        print json_encode($this->statsModel->getDeptBreakdown($year));
    }

    function getSalaryRanges() {
        $year = $this->input->get_post('year', TRUE);
        $departmentId = $this->input->get_post('departmentId', TRUE);
        print json_encode($this->statsModel->getSalaryRanges($year, $departmentId));
    }
}
?>