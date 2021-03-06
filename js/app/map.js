define(['lib/tools', 'app/eventmapechart', 'app/drawoverlays'], function($$, chart, draw) {
    /**
     * @DateTime 2016-12-02
     * @param    {[type]}
     * @return   {[type]}
     */
    var map = new BMap.Map('map', { enableMapClick: false }); //创建地图实例  {enableMapClick:false}  设置地图不可点击功能
    $.getJSON('json/pollutedata.json', function(data) {
        if (data) {
            initMap(map, data);
            createMap(map, data);
            chart.createCharts(data);

        }
    });




    function initMap(map, data) {
        var lat = data["center-point"].lat;
        var lng = data["center-point"].lng;
        var centerPoint = new BMap.Point(lat, lng); //创建点坐标
        map.centerAndZoom(centerPoint, 18); //初始化地图，设置中心点坐标和地图级别
        // map.enableScrollWheelZoom(true); //开启鼠标滑轮放大缩小地图
        map.addControl(new BMap.NavigationControl()); //添加一个放大缩小偏移控件{ type: BMAP_NAVIGATION_CONTROL_SMALL }
        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT })); //右上角，默认地图控件
        map.setCurrentCity(data["center-point-city"]); //设置城市信息

    }

    function createMap(map, polluteData) {
        var beforeId = 0;
        var selfOverlay = []; //自定义覆盖物
        var _data = polluteData.pollution || [];
        var tempData = polluteData;
        selfOverlay = draw.drawOverlay(map, tempData); //绘出覆盖物
        //给覆盖物增加点击事件（网格事件）
        for (var count = 0; count < selfOverlay.length; count++) {

            (function(count) {
                selfOverlay[count].addEventListener('click', function(e) {
                    var overLays = map.getOverlays();
                    var tempMarkers = [];
                    if (overLays) {
                        for (var i = 0; i < overLays.length; i++) {
                            if(overLays[i].V){
                                if (overLays[i].V.localName !== "path") {
                                    tempMarkers.push(overLays[i]);
                                }
                            }
                        }
                    }
                    //默认每个网格的填充色都为黄色
                    for (var j = 0; j < selfOverlay.length; j++) {
                        selfOverlay[j].setFillColor('yellow');
                    }
                    //选中网格变为绿色
                    selfOverlay[count].setFillColor('green');

                    //清除地图中的事件小图标
                    for (var k = 0; k < tempMarkers.length; k++) {
                        var marker = tempMarkers[k];
                        map.removeOverlay(marker);
                    }

                    //加载基本信息
                    editBaseInfo(tempData, count);
                    //加载事件小图标
                    loadMarker(map, tempData, count);
                    if (beforeId !== count) {
                        beforeId = chart.createCharts(tempData, count);
                    }
                })
            })(count);
        }

        //默认触发一次
        selfOverlay[0].dispatchEvent('click');

        
    }





    function loadMarker(_map, renderDate, id) {
        var pollution = renderDate.pollution[id];
        var events = pollution.events;
        createMarker(_map, events);
    }

    //生成事件小图标，点击跳转至详情页
    function createMarker(_map, events) {
        for (var i = 0; i < events.length; i++) {
            var content = events[i].e_intro || {};
            var url = events[i].e_detailurl || "";
            var pointArr = events[i].e_point.split(',') || [];
            if (pointArr.length > 0) {
                var lat = parseFloat(pointArr[0]),
                    lng = parseFloat(pointArr[1]);
                var point = new BMap.Point(lat, lng);
            }

            // console.log(point)
            addMarker(_map, point, content, url)
        }
    }

    function addMarker(_map, point, cont, url) {
        var marker = new BMap.Marker(point);
        _map.addOverlay(marker);
        var sContent = "<div class='myclass'><strong>" + cont.e_title + "</strong><p style='width:200px;'>" + cont.e_cont + "<a href='" + url + "' target='_blank'>事件详情&gt;&gt;</a></p></div>";
        var infoWindow = new BMap.InfoWindow(sContent);
        marker.addEventListener("click", function() {
            this.openInfoWindow(infoWindow);
            // infoWindow.redraw(); 
        });
        //marker.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动
    }

    function editBaseInfo(renderDate, id) {
        var pollution = renderDate.pollution[id];
        var gridCode = pollution.baseInfo.gridCode;
        var userName = pollution.baseInfo.userName;
        var gridFullName = pollution.baseInfo.gridFullName;
        var gridType = pollution.baseInfo.gridType;
        var gridArea = pollution.baseInfo.gridArea+"m";
        //加载信息
        $('.grid-code').html(gridCode);
        $('.user-name').html(userName);
        $('.grid-full-name').html(gridFullName);
        $('.grid-type').html(gridType);
        $('.grid-area').html(gridArea);
    }








    //跳转至编辑页面
    var toEdit = document.getElementById("addnew");
    toEdit.onclick = function() {
        open('editGrid.html');
    }
});
