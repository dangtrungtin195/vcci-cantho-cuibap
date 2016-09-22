<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<head>
	<style>

img{
max-width:99px !important;
padding:5px;
border: 4px solid #cccccc;margin:10px}

img:hover{background:#666666}

#thongbaonhe{width:100%,height:100px;background:#666666;padding:10px;color:white;font-size:15px;font-weight:bold}
</style>

	

	<script language="javascript">
	function addsmilie(code)
	{
		opener.document.fcb_form.hmess.value = opener.document.fcb_form.hmess.value + code;
	}
	</script>

	<title>Chatbox</title>


</head>

<body>
<div id="thongbaonhe">

<span>Để dùng mặt cười ở forum , bạn chỉ việc click vào hình mặt cười bạn muốn. Mặt cười sẽ tự chèn vào khung chat</span>

</div>

<?
$smilieperrow = "10";
$randomsmilie = "10";
$filematcuoi = "fcb_smilies.txt";

if ($_REQUEST['do'] == 'fcb_allsmilies')
{
$smfiletg = file($filematcuoi);
$count = 0;
$smilieicon = '<tr>';
foreach ($smfiletg as $smbit)
{
	$count++;
	$smbit = explode(" => ", $smbit);
	$smbit[0] = str_replace('"', '\"', $smbit[0]);
	$smbit[0] = str_replace('\\', '\\\\', $smbit[0]);
	$smilieicon .= "<td align='center' style='padding: 3px; border-right: 1px solid #f4f4f4; border-bottom: 1px solid #f4f4f4;'><a href='javascript:addsmilie(\"$smbit[0] \")'><img src='$smbit[1]' border='0'></a></td>";
	if ($count % $smilieperrow == 0) { $smilieicon .= '</tr><tr>'; }
}
	$smilieicon .= '</tr>';
	
	print $smilieicon;

		
}

if ($_REQUEST['do'] == 'fcb_randomsmilies')
{
$smfiletg = file($filematcuoi);
$sl = sizeof($smfiletg);
	$count = 0;
	$rand_smilies = array_rand($smfiletg, $randomsmilie);
	for ($i = 0; $i < $randomsmilie; $i++)
	{
		$count++;
		$smbit = $smfiletg[$rand_smilies[$i]];
		$smbit = explode(" => ", $smbit);
		$smbit[0] = str_replace('\\', '\\\\', $smbit[0]);
		$smbit[0] = str_replace('"', '\"', $smbit[0]);
		echo "<a href='javascript:addsmilie(\"$smbit[0]\")'><img src='$smbit[1]' border='0'></a> ";
	}
}
?>

</body>
</html>