define(['lib/tools','app/eventmapechart','app/drawoverlays'], function($$,chart,draw) {
	/**
	 * @DateTime 2016-12-02
	 * @param    {[type]}
	 * @return   {[type]}
	 */
	$.getJSON('json/pollutedata.json', function(data){
		if(data) {
			var render = data.data;
			createMap(render);
			chart.createCharts(render);
		}
	});


	var map = new BMap.Map("map");
	var centerPoint = new BMap.Point(114.060381,22.550367);
	map.centerAndZoom(centerPoint, 18);
	map.enableScrollWheelZoom(true); //开启鼠标滑轮放大缩小地图
	map.addControl(new BMap.NavigationControl()); //添加一个放大缩小偏移控件{ type: BMAP_NAVIGATION_CONTROL_SMALL }
	map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));    //右上角，默认地图控件
	map.setCurrentCity("深圳");


	function createMap(polluteData){
		var beforeId = 0;
		var selfOverlay = [];  //自定义覆盖物
		var _data = polluteData; 
		var markerData = _data.events;

		var optionList = document.getElementById('option-list');
		

		selfOverlay = draw.drawOverlay(map, polluteData);  //绘出覆盖物
		createMarker(map, markerData);

		//给覆盖物增加点击事件（网格事件）
		map.addEventListener('click', function(e) {
			if(e.overlay) {
				var self = e.overlay;
				var _id = self.id;
				if(!!_id && beforeId !== _id) {
					beforeId = chart.createCharts(_data, _id);
				}
			}
		});
	}

	//生成事件小图标，点击跳转至详情页
	function createMarker(_map, events) {
		for(var i in events) {
			var content = events[i].e_intro;
			var url = events[i].e_detailurl;
			var pointArr = events[i].e_point.split(',');
			var lat = parseFloat(pointArr[0]),
				lng = parseFloat(pointArr[1]);
			var point = new BMap.Point(lat,lng);
			// console.log(point)
			addMarker(_map, point, content, url)
		}
	}

	function addMarker(_map, point, cont, url) {
		var marker = new BMap.Marker(point);
		_map.addOverlay(marker);
		var sContent ="<div class='myclass'><strong>"+ cont.e_title +"</strong><p style='width:200px;'>"+ cont.e_cont +"<a href='"+ url +"' target='_blank'>事件详情&gt;&gt;</a></p></div>";
		var infoWindow = new BMap.InfoWindow(sContent);
		marker.addEventListener("click", function(){          
			this.openInfoWindow(infoWindow);
			// infoWindow.redraw();	
		});
		//marker.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动
	}


	

	//跳转至编辑页面
	var toEdit = document.getElementById("addnew");
	toEdit.onclick = function() {
		open('editGrid.html');
	}
});
