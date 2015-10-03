/**
 * Created by Stefan Weghofer on 19.09.2015.
 */

angular.module("pixelate", []).directive('pixelate', function( $timeout, pixelateSizes ) {
    return {
        restrict: 'A',
        scope: true,
        controller: function( $scope ){
            $scope.extractPixels = function( canvas, pixelSize ){
                var columns = canvas.width / pixelSize;
                var rows = canvas.height / pixelSize;

                var pixelData = [];
                for(var x = 0; x < columns; x++){
                    pixelData[x] = [];
                    for(var y = 0; y < rows; y++){
                        var data = get( canvas, x*pixelSize, y*pixelSize );
                        var r = parseInt(data[0]),
                            g = parseInt(data[1]),
                            b = parseInt(data[2]),
                            a = parseInt(data[3]),
                            result = 'rgba('+ r + ',' + g + ',' + b + ',' + a + ')';
                        pixelData[x].push({ 'background-color': result, 'width': (pixelSize + "px") });
                    }
                }

                $scope.rowStyle = { height: (pixelSize + "px") };
                $scope.columns = range(columns);
                $scope.rows = range(rows);
                $scope.pixelData = pixelData;
            };

            function get(canvas, x, y){
                return canvas.getContext('2d').getImageData(x, y, 1, 1).data;
            }

            function range(n) {
                var result = [];
                for(var i = 0; i < n; i++){
                    result.push( i );
                }
                return result;
            }
        },
        link: function(scope, element, attrs) {
            var img = element[0].querySelector('img');
            var notLoaded = true;
            var pixelSize = 16;

            angular.element(img).bind('load', function () {
                notLoaded = false;
                scope.$apply(function() {
                    pixelate();
                });
            });

            $timeout(function(){
                if(notLoaded){
                    pixelate();
                }
            }, 500);

            function pixelate(){
                var canvas = createCanvas( img );
                scope.extractPixels( canvas, pixelSize );
            }

            function createCanvas( img ){
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                return canvas;
            }

        }
    }
});



angular.module("pixelate").service('pixelateSizes', function() {

    this.availableSizes = function(width, height){
        return commonDivisorsOf(width, height);
    };

    function divisorOf(a){
        var divisors = [];
        for(var i=1; i <= a; i++){
            if(a % i == 0){
                divisors.push( i );
            }
        }
        return divisors;
    }

    function commonDivisorsOf(a, b){
        var divisorsOfA = divisorOf(a);
        var divisorsOfB = divisorOf(b);
        var common = [];
        angular.forEach(divisorsOfA, function(divisor) {
            if(divisorsOfB.indexOf(divisor) !== -1){
                this.push(divisor);
            }
        }, common);
        return common;
    }

    return this;
});
