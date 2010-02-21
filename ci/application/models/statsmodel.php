<?

/**
 * This model has lots of copy and paste code.
 * I know it's dirty, but time is running short for me to deliver this book. :(
 */

class StatsModel extends Model {

    function getYearlyStats() {
        $startYear = 2000;

        $date = new DateTime();
        $endYear = $date->format('Y');

        $stats = array();
        $lastNumFires = $lastNewHires = 0;

        while ($startYear <= $endYear) {
            // New hires
            $this->db->select('count(id) as total');
            $this->db->like('dateHired', $startYear);

            $numNewHires = $this->db->get('employees')->result();
            $numNewHires = $numNewHires[0];
            $numNewHires = $numNewHires->total;

            // Fired folks  :(
            $this->db->select('count(id) as total');
            $this->db->like('dateFired', "$startYear");

            $numFires = $this->db->get('employees')->result();
            $numFires = $numFires[0];
            $numFires = $numFires->total;

            if ($numFires < 1) {
                $numFires = 0;
            }
            $data  = array(
                'newHires'  => $numNewHires,
                'numFires'  => $numFires,
                'year'      => $startYear,
                'prevHired' => $lastNewHires - $lastNumFires,
                'total'     => $numNewHires + $lastNewHires - $numFires - $lastNumFires,
                'numFired'  => $numFires * -1
            );

            $lastNewHires = $numNewHires + $lastNewHires;
            $lastNumFires = $numFires;

            array_push($stats, $data);
            $startYear++;
        }
        return $stats;

    }

    function getDeptBreakdown($targetYear) {
        $this->db->where('dateInactive is  NULL');

        $departments = $this->db->get('departments')->result();

        $returnDepartments = array();

        foreach ($departments as $ind => $department) {
            $this->db->select('count(id) as total');
            $this->db->where('departmentId', $department->id);
            $this->db->like('dateHired', $targetYear);

            $numNewHires = $this->db->get('employees')->result();
            $numNewHires = $numNewHires[0];
            $numNewHires = $numNewHires->total;

            // Fired folks  :(
            $this->db->select('count(id) as total');
            $this->db->where('departmentId', $department->id);
            $this->db->like('dateFired', $targetYear);

            $numFires = $this->db->get('employees')->result();
            $numFires = $numFires[0];
            $numFires = $numFires->total;

            // I am cheating
            $startYear = 2000;
            if ($targetYear > $startYear) {
                $lastNewHires = 0;
                while ($startYear < $targetYear) {
                   // Fired folks  :(
                    $this->db->select('count(id) as total');
                    $this->db->where('departmentId', $department->id);
                    $this->db->like('dateFired', "$startYear");

                    $innerNumFired = $this->db->get('employees')->result();
                    $innerNumFired = $innerNumFired[0];
                    $innerNumFired = $innerNumFired->total * -1;

                    //Hired
                    $this->db->select('count(id) as total');
                    $this->db->where('departmentId', $department->id);
                    $this->db->like('dateHired', $startYear);

                    $innerNumHired = $this->db->get('employees')->result();
                    $innerNumHired = $innerNumHired[0];
                    $innerNumHired = $innerNumHired->total;

                    $lastNewHires += $innerNumFired + $innerNumHired;
                    $startYear++;
                }

            }
            else {
                $lastNewHires=0;
            }

            $trueTotal = $numNewHires + $lastNewHires - $numFires;
            if ($trueTotal > 0) {
                $department->newHires  = $numNewHires;
                $department->prevHired = $lastNewHires;
                $department->numFired  = $numFires * -1;
                $department->total     = $trueTotal;
                array_push($returnDepartments, $department);
            }
        }

        return $returnDepartments;
    }

}