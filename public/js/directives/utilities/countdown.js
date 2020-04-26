daystageApp.directive('countdown', [
    '$state',
    function($state) {
        return {
            restrict: 'EA',
            scope: {
                endTime: '='
            },
            link: function(scope, element, attributes) {

                var _second = 1000;
                var timer;

                function setRemaining() {
                    var elem = document.getElementById('ds-countdown');
                    if (elem) {
                        setInterval(function() {
                            var now = moment.tz(moment().format("YYYY-MM-DD HH:mm:ss"), "America/New_York").format();
                            // console.log('now',now);
                            var endTime = scope.endTime;
                            // console.log('endTime',endTime);

                            var mins = moment.utc(moment(endTime, "YYYY-MM-DD HH:mm:ss").diff(moment(now, "YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");
                                // console.log('mins',mins);
                            elem.innerHTML = mins;
                        }, _second);
                    }
                }


                $( window ).resize(function() {
                    setRemaining()
                });


                setRemaining();
                // timer = setInterval(showRemaining, 1000);

            },
            template: '<div> <span id="ds-countdown"> </span> </div>'
        };
    }
]);
