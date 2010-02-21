<?

$userName = $_REQUEST['user'];
if (strlen($userName) > 0) {
    setcookie(
        'loginCookie',
         "",
        time() - 3600
   );
    print "{success : true}";
}

else {
    print "{success : false}";
}

?>