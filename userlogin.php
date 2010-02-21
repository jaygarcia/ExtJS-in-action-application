<?

$userName = $_REQUEST['user'];
if (strlen($userName) > 0) {
    setcookie(
        'loginCookie',
         $userName
   );
    print "{success : true}";
}

else {
    print "{success : false}";
}

?>