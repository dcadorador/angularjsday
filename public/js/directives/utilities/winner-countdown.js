daystageApp.directive('winnerCountdown', [
    '$rootScope','$state',
    function($rootScope,$state) {
        return {
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attributes) {
                scope.isMobile = false;

                scope.winnerAnnouncementEndTime = '';

                function generateTomorrowsDate() {
                    var endHourNYTime = 7;
                    // var tomorrowDate = moment.tz(moment().format("YYYY-MM-DD HH:mm").set('hours'), "America/New_York");
                    var now = moment.tz(moment().format("YYYY-MM-DD HH:mm"), "America/New_York");
                    var endDate = moment().set('hour', endHourNYTime).set('minute', 0).set('second',0).format();
                    // var tomorrowDate = moment().set('hour', 15).set('minute', 0).format("YYYY-MM-DD HH:mm");
                    if(now.hour() >= endHourNYTime)
                      endDate = moment().add(1, 'day').set('hour', endHourNYTime).set('minute', 0).set('second',0).format();


                    // .format('YYYY-MM-DD HH:mm');
                    // var zone = "America/New_York";

                    return endDate;
                }

                function setIsMobile() {
                    scope.isMobile = (function() {
                        var mobiles = {
                            Android: function() {
                                return navigator.userAgent.match(/Android/i);
                            },
                            BlackBerry: function() {
                                return navigator.userAgent.match(/BlackBerry/i);
                            },
                            iOS: function() {
                                return navigator.userAgent.match(/iPhone|iPod/i);
                                // return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                            },
                            Opera: function() {
                                return navigator.userAgent.match(/Opera Mini/i);
                            },
                            Windows: function() {
                                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                            },
                        };
                        return (mobiles.Android() || mobiles.BlackBerry() || mobiles.iOS() || mobiles.Opera() || mobiles.Windows());
                    })();
                }

                $(window).resize(function() {
                    setIsMobile();
                });

                function init() {
                    scope.winnerAnnouncementEndTime = $rootScope.generateTomorrowsDate();
                    setIsMobile();
                }
                init();
            },
            templateUrl: './views/partials/_winner-countdown.html',
        };
    }
]);
