define(['lib/tools'],function($$){   
    function drawOverlay(_map, data) {
        var selfOverlay = [];
        var pollution = data.pollution || [];
        //遍历数组
        for(var i=0; i<pollution.length; i++) {
            var markPoint = pollution[i].mark_area.mark_point || "";
            var id = pollution[i].identifier || "";
            var _polygon = createpolygon(markPoint, id);
            _map.addOverlay(_polygon); 
            selfOverlay.push(_polygon);
        }
        return selfOverlay;
    }
    function createpolygon(data) {
        var pointArr = [];
        var areaStyle = {};
        var _id = arguments[1];
        /*if(typeof arguments[2] == 'undefined') {
            if(typeof arguments[1] == 'object') {
                areaStyle = arguments[1];
            }else {
                _id = arguments[1];
            }
        }else {
            areaStyle = arguments[1];
            _id = arguments[2];
        }*/
        
        if(typeof data == 'string') {
            var newArr = data.split(';');
            for(var i = 0; i < newArr.length; i++) {
                var itemPoint = newArr[i].split(',');
                pointArr.push(new BMap.Point(parseFloat(itemPoint[0]),parseFloat(itemPoint[1])));
            }
        }else {
            pointArr = data;
        }
        _polygon = new BMap.Polygon(pointArr, {
                strokeColor: areaStyle.strokeColor || "#f00",
                strokeWeight: areaStyle.strokeWeight || 2,
                strokeOpacity: areaStyle.strokeOpacity || .6,
                fillColor: areaStyle.fillColor || "yellow",
                fillOpacity: areaStyle.fillOpacity || .4
            }
        );
        _polygon.id = _id;
        return _polygon;
    };
    return draw = {
        'drawOverlay': drawOverlay
    }
});