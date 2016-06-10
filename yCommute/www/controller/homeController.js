app.controller('homeCtrl', ['$scope', '$ionicPlatform', '$cordovaBarcodeScanner',
    function($scope, $ionicPlatform, $cordovaBarcodeScanner){
    
    $scope.msg = "";
    var test_id = "차양환";
        
    $scope.vm_scan = function(){
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner
            .scan()
            .then(function(result) {
                // Success! Barcode data is here
                $scope.msg = "We got a barcoden" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled;
            }, function(error) {
                // An error occurred
                $scope.msg = 'Error: ' + error;
            });
        });
    };
}]);