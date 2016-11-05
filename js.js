$(function () {
	var arr1 = [
		{
			'name':'leo',
			'num':'01',
			'remarks':'vip',
			'type':'customer',
			'state':'off-line',
			'time':'2016-11-01',
			'loadtime':'Not yet logged in     '
		},
		{
			'name':'blue',
			'num':'02',
			'remarks':'ordinary',
			'type':'customer',
			'state':'off-line',
			'time':'2016-10-01',
			'loadtime':'Not yet logged in     '
		},
		{
			'name':'victor',
			'num':'03',
			'remarks':'manager',
			'type':'employee',
			'state':'off-line',
			'time':'2015-08-23',
			'loadtime':'Not yet logged in'
		}
	];
	var index = -1;
	$('#btn').find('.add').click(function () {
		
		$('#form1').css('display','none');
		$('#form').css({"display":"block","opacity":"0"});
		$('#form').animate({height:'210',opacity:'1'},300);
	})

	$('#onload').click(function () { 
		$('#form').css('display','none');
		$('#form1').css({"height":"210","display":"block"});
		$('#form1').animate({height:'95'},100);
	})

	var data1 = [{ id:0, text: 'customer' }, 
				{ id:1,text: 'employee' }]
	$("#select").select2({
		data: data1,
		placeholder:'请选择'
		// allowClear:true
	})
	$("#select2").select2({
		data: data1,
		placeholder:'请选择'
		// allowClear:true
	})

	// var res=$("#select").select2("data").text; 

	datatable(arr1);

	$("#submit").click(function(){ 

		var str = $('#form').serialize();

		if (test(add(str))) {
			arr1.push(add(str));
		} 
	 	datatable(arr1);
		$('#form')[0].reset();
	});

	$('#load').click(function (){

		var str = $('#form1').serialize(); 
		var json = load(str);
		if (json['name']) {
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i]['name']==json['name']) { 
					var oTime = new Date ();
	 				arr1[i]['loadtime'] = oTime.getFullYear()+'-'+(oTime.getMonth()+1)+'-'+oTime.getDate()+' '+oTime.getHours()+':'+oTime.getMinutes()+':'+oTime.getSeconds();
	 				arr1[i]['state'] = 'on-line';
	 				break;
				} else {
					if (i==(arr1.length-1)) {
						alert('输入的用户名不存在');
					}
				}
			}
		} else if(json['name']=='') {
			alert('输入的用户名为空');
		} 

		datatable(arr1);
	})

	//获取要操作的表格行数
	getindex();
	function getindex () {
			 $('#table').find('tbody').find('tr').click(function () {
			index = $(this).index(); 
		})
	}

	//数据删除
	$('#delete').click(function () {
		if (index == -1) {
			alert('请点击要操作的数据');
		} else {
			var n = $('#table').find('tbody').find('tr').eq(index).find('td').eq(0).html();
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i]['name']==n) {
					var re = confirm ('你确定要删除吗？');
					if (re) {
						arr1.splice(i,1);
						datatable(arr1);
						index = -1;
					} else { index = -1;}
				}
			}
		}
		index = -1;
	})

	//修改数据
	var num = null;
	$('#change').click(function () {
		if (index == -1) {
			alert('请点击要操作的数据');
		} else {
			var n = $('#table').find('tbody').find('tr').eq(index).find('td').eq(0).html();
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i]['name']==n) {
					num = arr1[i]['num'];  
					// $('#form3').find("input[name='name']").attr('value',n);
					for(var attr in arr1[i]) {
						$('#form3').find("input[name="+"'"+attr+"'"+"]").attr('value',arr1[i][attr]);
					}
				}
			}
			$('#form2').css('display','none');
			$('#changeform').css('height','0').css('display','block').animate({height:'272'});
		}
		index = -1;
	})
	

	$('#changeBtn').click(function () {
		var str = $('#form3').serialize();
		var json = changeadd(str); 
		if (changetest(json,num)) { 
			for (var j = 0; j < arr1.length; j++) {
				if(arr1[j]['num']==num) {
					for(var attr in json) {
						arr1[j][attr]=json[attr];
					}
				}
			}
			datatable(arr1);
			$('#changeform').css('display','none');
			$('#form2').css('display','block');
		} 
	})

	//搜索
	$('#config').daterangepicker( {
    	startDate:moment('2016/11/1'),
    	endDate:moment(),
     });
   	$('#config').on('apply.daterangepicker', function (ev,picker) {
   		// alert(picker.startDate.format('YYYY-MM-DD')+'  '+picker.endDate.format('YYYY-MM-DD'));
   		var arr2 = [];
   		var j = 0;
   		var start = picker.startDate.format('YYYY-MM-DD').split('-');
   		var end = picker.endDate.format('YYYY-MM-DD').split('-');
		// alert(start+'  '+end);
   		for (var i = 0; i < arr1.length; i++) {
   			var arrTime = arr1[i]['time'].split('-');
   			for (var k = 0; k < arrTime.length; k++) {
   				alert(start[k]+'  '+arrTime[k]+'  '+end[k]);
   				if (arrTime[k]>=start[k]&&arrTime[k]<=end[k]) {j++;}
   			} 
   			if (j==3) {
	   			arr2.push(arr1[i]);
	   			j=0;
	   		}
   		}
   		datatable(arr2);
   	})
    $('.search i').click(function() {
      $(this).parent().find('input').click();
    });

	function add (str) {
	 	var arr = str.split('&');
	 	var json = {};
	 	for (var i = 0; i < arr.length; i++) {
	 		var arr0 = arr[i].split('=');
	 		// var str = arr1[0];alert(str);
	 			json[arr0[0]]=arr0[1];
	 	}
	 	json['type']=json['type']==0?'customer':'employee';
	 	
	 	json['state'] = 'off-line';
	 	json['loadtime'] = 'not landed';
	 	var oTime = new Date ();
	 	date = oTime.getDate();
	 	date=date<10?('0'+date):date;
	 	mon = oTime.getMonth()+1;
	 	mon = mon<10?('0'+mon):mon;
	 	json['time'] = oTime.getFullYear()+'-'+mon+'-'+date;
	 	return json;
	}

	function load (str) {
		var arr = str.split('=');
	 	var json = {};
	 	json[arr[0]]=arr[1];
	 	return json;
	 }

	function test (json) {
		var test = true;
		
		for(var attr in json) {
			if (json[attr]=='') {
				alert('输入不能为空');
				test = false;
				break;
			}
		}
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i]['num']==json['num']) {
				test = false; 
				alert('输入的编码已存在');
			}
		}
		// alert(arr[i]['num']);
		return test;
	}

	function changetest (json,num) {
		var test = true;
		for(var attr in json) {
			if (json[attr]=='') {
				alert('输入不能为空');
				break;
				test = false;
			}
		}
		if (json['num']!=num) {
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i]['num']==json['num']) {
					test = false;  
					alert('输入的编码已存在');
					break;
				}
			}
		} 
		// alert(arr[i]['num']);
		return test;
	}

	function changeadd (str) {
	 	var arr = str.split('&');
	 	var json = {};
	 	for (var i = 0; i < arr.length; i++) {
	 		var arr0 = arr[i].split('=');
	 		// var str = arr1[0];alert(str);
	 			json[arr0[0]]=arr0[1];
	 	}
	 	json['type']=json['type']==0?'customer':'employee';
	 	if (json['state']=='on line') {
	 		json['state'] = oTime.getFullYear()+'-'+(oTime.getMonth()+1)+'-'+oTime.getDate()+' '+oTime.getHours()+':'+oTime.getMinutes()+':'+oTime.getSeconds();
	 	}
	 	return json;
	}

	function datatable (arr1) {
		$('#table').DataTable({
	 		"destroy": true,
	 		// "bProcessing": false,
    //         "bServerSide": false,
			"data": arr1,
	        //使用对象数组，一定要配置columns，告诉 DataTables 每列对应的属性
	        //data 这里是固定不变的，name，position，salary，office 为你数据里对应的属性
	        "columns": [
	        	{ "data":'name'},
	            { "data":'num'},
	            { "data":'type'},
	            { "data":'remarks'},
	            { "data":'state'},
	            { "data":'loadtime'},
	            { "data":'time'}
	        ]
	        
		});
		getindex();		
	}
				
	
})