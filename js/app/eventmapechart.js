define(function(){
	function createCharts(renderDate){	
		var idNumber = arguments[1] || 0;
		//路径
		require.config({
			paths: {
				echarts: 'http://echarts.baidu.com/build/dist'
			}
		});
		//use 
		require(
			[
				'echarts',
				'echarts/chart/bar',
				'echarts/chart/line'
			],
			function(echart) {
				var poName = renderDate.pollute_name;
				var pollution = renderDate.pollution;
				var pollutionFir = pollution[idNumber];
				// console.log(pollutionFir);
				var baseTable = document.getElementById('data-charts');
				var secTable = document.getElementById('time-charts');
				var eventChart = echart.init(baseTable);
				var secChart = echart.init(secTable);
				var colorList = ['red','orange','yellow','blue','purple','black'];
				var option1 = {
		            tooltip: {
		                'show': true,
		                'position': function(p) {
		                	return [p[0], p[1] - 30];
		                }
		            },
		            grid: {
		                x: 30,
		                y: 10,
		                x2: 10,
		                y2: 70,
		                borderWidth: 0
		            },
		            xAxis : [
		                {
		                    type : 'category',
		                    data : function() {
		                    	var arr = [];
		                    	for(var i in poName) {
		                    		arr.push(poName[i]);
		                    	}
		                    	return arr;
		                    }(),
		                    axisLabel : {
		                        interval: 0,
		                        formatter: function(data) {
		                            return data.split('').join('\n');
		                        }
		                    },
		                    axisLine:{                                
		                    	lineStyle: {
		                            color: '#333',
		                            width: 1
		                        }
		                    },
		                    splitLine: {
		                    	show: false
		                    }
		                }
		            ],
		            yAxis : [
		                {
		                    type : 'value',
		                    axisLine: {
		                        lineStyle: {
		                            color: '#333',
		                            width: 1
		                        }
		                    },
		                    splitLine: {
		                    	show: false
		                    }
		                }
		            ],
		            series : [
		                {
		                    'name': '环境污染',
		                    'type': 'bar',
		                    'data': function() {
		                    	var arr = [];
		                    	var val = pollutionFir.pollute_val;
		                    	for(var i in val) {
		                    		arr.push(val[i]);
		                    	}
		                    	return arr;
		                    }(),
		                    'barMaxWidth': '15',
		                    'itemStyle': {
		                    	'normal': {
		                    		'color': function(data){
		                    			return colorList[data.dataIndex];
		                    		}
		                    	}
		                    }      
		                }
		            ]
		        };
		       
				var option2 = {
					tooltip: {
		                show: true,
		            },
					grid: {
						x: 30,
						y: 10,
						x2: 10,
						y2: 60,
						borderWidth: 0
					},
					calculable : true,
				    dataZoom : {
				        show : true,
				        realtime : true,
				        type: 'time',
				        height: 20,
				        start : 0,
				        end : 20,
				        handleSize: 4,
				    },
					xAxis: [
						{
							type:'category',
							// name: '时间',
							nameLocation: 'end',
							boundaryGap: false,
							axisLabel : {
								interval: 0
		                    },
		                    axisLine: {                           
		                    	lineStyle: {
		                            color: '#333',
		                            width: 1
		                        }
		                    },
		                    data: function() {
		                    	var list = [];
		                    	for(var i = 1; i <= 30; i ++) {
		                    		list.push(i);
		                    	}
		                    	return list;
		                    }(),
		                    splitLine: {
		                    	show: false
		                    }
						}
					],
					yAxis: [
						{
							type:'value',
							axisLine: {                                
								lineStyle: {
		                            color: '#333',
		                            width: 1
		                        }
		                    },
		                    splitNumber: 3,
		                    max: 300
						}
					],
					series: [
						{
							'name': '污染程度',
							'type': 'line',
							'data': function() {
								// console.log('the '+ times +' times');
								var arr = [];
								for(var i = 1; i <= 30; i ++) {
									var num = Math.round(Math.random()*300);
									arr.push(num);
								}
								return arr;
							}()
						}
					]
				};
				eventChart.setOption(option1);
				secChart.setOption(option2);

				/*secChart.on('datazoom', function(param) {
						console.log(param.dataZoom.start);
						console.log(option2.dataZoom.start);
						console.log(secChart.dataZoom.start);
				})*/
			}
		);
		return idNumber;
	}
	return chart = {
		'createCharts': createCharts
	}
})