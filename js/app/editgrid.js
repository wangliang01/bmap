define(['lib/tools','app/drawoverlays'], function($$,draw){
    // 百度地图API功能
    var map = new BMap.Map('map');
    var poi = new BMap.Point(114.060381,22.550367);
    map.centerAndZoom(poi, 18);//设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小
    map.addControl(new BMap.NavigationControl());
    map.setCurrentCity("深圳");

    /*$.getJSON('http://192.168.1.134:8080/jl_environmental/event_map/model', function(data){
        if(data) {
            console.log(data);
        }
    });*/


    $.getJSON('json/pollutedata.json', function(data){
        if(data) {
            var render = data.data;
            draw.drawOverlay(map, render);  //绘出覆盖物
        }
    });

    /**
     * 编辑 editGrid()
     * 添加 addGrid()
     */
    var style = $$.I('style','add'),
        allNum = $$.I('num', 0),
        polygonArr = [],
        polygonObj = {};
    var saveBtn = document.getElementById('save-change');
    var editLimit = true;

    if(style == 'edit') {
        editGrid();
    }else if(style == 'add') {
        addGrid();
    }


    function editGrid() {
        //给覆盖物增加点击事件（网格事件）
        map.addEventListener('click', function(e) {
            if(e.overlay && editLimit) {
                var self = e.overlay;
                var em = e;
                editGridAndSave(em, self);
            }
        });
    }



    function addGrid() {
        /**
         * drawing tool
         * @param {String} [polygonStr] [return the point about polygoncomplete]
         * @param {String} [markerStr] [return the point about markercomplete]
         * @param {Array} [polygonArr] [return the point array polygoncomplete]
         */
        var polygonStr = "",
            markerStr = "",
            overlayPath  = [];

        var styleOptions = {
            strokeColor:"red",
            fillColor:"yellow",
            strokeWeight: 3,
            strokeOpacity: 0.8, 
            fillOpacity: 0.6,
            strokeStyle: 'solid'
        }

        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingMode:  BMAP_DRAWING_POLYGON,
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                scale: 1,
                drawingModes:[
                    BMAP_DRAWING_POLYGON
                ]
            },
            polygonOptions: styleOptions //多边形的样式
        });




        drawingManager.addEventListener('polygoncomplete', function(e, overlay){
            var str = "";
            overlay.type = "add";
            allNum ++;
            overlay.id = allNum;
            var path = overlay.getPath();
            polygonObj[overlay.id] = path;
            // polygonArr.push(polygonStr);
        });

        map.addEventListener('click', function(e) {
                console.log(drawingManager._isOpen);
            if(drawingManager._isOpen) {
                return false;
            }

            //判断是否在覆盖物上，并判断覆盖物类型是不是添加的
            if(e.overlay && e.overlay.type == "add" && editLimit) {
                var self = e.overlay;
                var em = e;
                editGridAndSave(em, self);
            }
        });
    }

    //
    function editGridAndSave(e, self) {
        var id = self.id;
        self.enableEditing();
        self.state = 'editing';
        editLimit = false;
        saveBtn.style.display = 'block';

        $$.clickedFunc(saveBtn, function(){
            if(e.overlay.state == 'editing') {
                saveBtn.style.display = 'none';
                self.disableEditing();
                editLimit = true;
                var path = self.getPath();
                polygonObj[id] = path;
                // polygonArr.push(path);
                console.log(polygonObj);
            }
        });
    }
    //点击完成按钮
    function finishedGrid() {
        for(var i in polygonObj) {
            var str = "";
            var path = polygonObj[i];
            var len = path.length;
            var firPoint = "";
            for(var j = 0; j < len; j++){
                if(j == 0 && style == "add") {
                    firPoint = path[j].lng + "," + path[j].lat;
                }
                str += path[j].lng + "," + path[j].lat + ";";
            };
            str += firPoint;
            polygonObj[i] = str;
        }
        console.log(polygonObj);
        polygonObj = {};
    }

    document.getElementById('finished').onclick = function() {
        finishedGrid();
    }

    /*var len = path.length;
        var firPoint = "";
        for(var i = 0;i < len; i++){
            if(i == 0) {
                firPoint = path[i].lng + "," + path[i].lat;
            }
            str += path[i].lng + "," + path[i].lat + ";";
        };
        str += firPoint;
        polygonStr = str;*/
});