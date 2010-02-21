<?php

class App extends Controller {

	function App()
	{
		parent::Controller();	
	}
	
	function index()
	{
		$this->load->view('appview');
	}
}

/* End of file app.php */
/* Location: ./system/application/controllers/app.php */