<?
class StatesModel extends Model {

    function getList() {
        $query = $this->db->get('states');
        return $query->result(); 
    }
}
?>