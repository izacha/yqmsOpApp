//연간추이 Ctrl (그래프 Data set)
app.controller('yearTrendsCtrl', ['$scope', '$http', '$state', '$rootScope', '$filter',
    function($scope, $http, $state, $rootScope, $filter){        
        var dbData = $state.params.obj,
            scom_cd = dbData.scom_cd,
            scom1_nm = dbData.scom1_nm;
        
        $rootScope.headTitle = scom1_nm+" 연간 실적 추이";
        $rootScope.backBtnHide = false;       
        $rootScope.backLocation = "/direct";

        var paramDate = $filter('date')($scope.selectDate, 'yyyy-MM'),
            paramYear = paramDate.split("-")[0],
            imp_rate_arr = [],
            ppm_arr = [],
            ppm_goal_arr = [];
        $scope.selectYear = paramYear;
        
        var httpPromise = $http.jsonp(url+"/yqms/getYearTrends.do?callback=JSON_CALLBACK",
                {params : 
                    {
                        year: paramYear,                        
                        scom_cd: scom_cd                                                
                    }
                }                                      
        );
        
        httpPromise.success(function(data){
            $scope.tableData = data;
            angular.forEach(data, function(value, key){
               //개선율
                var temp_imp_rate = null;                 
                if(typeof value.imp_cnt !== 'undefined' && typeof value.bad_cnt !== 'undefined'){
                    temp_imp_rate = (value.imp_cnt / value.bad_cnt) * 100;
                    temp_imp_rate = parseFloat(temp_imp_rate).toFixed(1)*1;
                }
                //ppm
                var temp_ppm = null;
                if(typeof value.bad_cnt !== 'undefined' && typeof value.comp_cnt !== 'undefined' && value.comp_cnt != 0){        
                    temp_ppm = (value.bad_cnt / value.comp_cnt * 1000000);
                    temp_ppm = parseFloat(temp_ppm).toFixed(1)*1;   
                }
                    
                    imp_rate_arr.push(temp_imp_rate);    //개선율(bar)
                    ppm_arr.push(temp_ppm);              //품질수치(line1)
                    ppm_goal_arr.push(value.ppm_goal*1);   //품질목표(line2)
            });
            
            
            drawChart(imp_rate_arr, ppm_arr, ppm_goal_arr);
        });
        
        var drawChart = function(imp_rate_arr, ppm_arr, ppm_goal_arr){
            console.log(imp_rate_arr)
            console.log(ppm_arr)
            console.log(ppm_goal_arr)
            
            $('#container').highcharts({
            chart: {
                zoomType: null
            },
            title: {text: null},             
            subtitle: {text: null},
            xAxis: [{
                categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {    
                        color: Highcharts.getOptions().colors[1]
                    }                    
                },
                title: {
                    text: null,
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                tickPixelInterval: 25,
                min:0,
//                alignTicks: false,
                gridLineWidth: 0
            }, { // Secondary yAxis
                title: {
                    text: null,
                    style: {
                        color: '#DB631F'
                    }
                },
                labels: {
                    format: '{value}%',
                    style: {
//                        color: Highcharts.getOptions().colors[1]
                        color: '#5EC75E'
                    }
                },
                opposite: true,
                tickPixelInterval: 25,
                min:0,
                max:100,
                alignTicks: false
            }],
            tooltip: {
                shared: true
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                floating: false,
                margin: 9,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [
                    {
                        name: '품질실적',
                        type: 'column',
                        yAxis: 0,
                        data: ppm_arr                        

                    },
                    {   
                        name: '품질목표',
                        type: 'line',
                        yAxis: 0,
                        data: ppm_goal_arr
                    },                
                    {
                        name: '개선율',            
                        type: 'line',
                        yAxis: 1,
                        data: imp_rate_arr,
                        tooltip: {valueSuffix: '%'},
                        color: '#5EC75E'
                    }
            ],
            credits: {enabled: false},
            plotOptions: {
                series:{
                    events: {
                        legendItemClick: function (e){
                            return false;
                        }
                    }
                }
            }
    });
        }         
}]);