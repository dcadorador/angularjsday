daystageApp.directive("vgFeaturedOverlay", [
    'VG_STATES',
    '$rootScope',
    function(VG_STATES, $rootScope) {
        return {
            restrict: 'E',
            require: '^videogular',
            scope: {
                stage: "=",
                header: '@'
            },
            template: '<div class="overlayPlayContainer">\
                           <winner-info info="stage" header="{{header}}" ng-if="overlayPlayIcon.playing != true" class="col-md-5 no-gutter hidden-xs"></winner-info>\
                           <div class="iconButton" ng-class="overlayPlayIcon" ng-click="onClickOverlayPlay()"></div>\
                       </div>',
            link: function(scope, element, attributes, API) {
                scope.isFirst = true;

                scope.onChangeState = function onChangeState(newState) {

                    $rootScope.$broadcast('events.videoOverlay.state.change', {
                        state: newState
                    });

                    //$rootScope.safeApply(function(){

                      switch (newState) {
                          case VG_STATES.PLAY:
                              scope.overlayPlayIcon = {
                                  paused: false,
                                  playing: true,
                                  pausedYoutubeButton: false

                              };
                              scope.isFirst = false;
                              break;
                          case VG_STATES.PAUSE:
                          case VG_STATES.STOP:
                              if ((scope.stage.stage.isYouTube && !scope.isFirst) || !scope.stage.stage.isYouTube)
                                  scope.overlayPlayIcon = {
                                      paused: true,
                                      playing: false,
                                      pausedYoutubeButton: false
                                  };
                              else {
                                  scope.isFirst = false;
                                  scope.overlayPlayIcon = {
                                      paused: false,
                                      playing: false,
                                      pausedYoutubeButton: true
                                  };
                              }
                              break;
                      }
                    //},scope);
                };

                scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                    API.playPause();
                };

                if (!scope.stage.isYouTube) {
                    scope.overlayPlayIcon = {
                        paused: true,
                        playing: false,
                        pausedYoutubeButton: false
                    };
                } else {
                    scope.overlayPlayIcon = {
                        paused: false,
                        playing: false,
                        pausedYoutubeButton: true
                    };
                }


                scope.$watch(
                    function() {
                        return API.currentState;
                    },
                    function(newVal, oldVal) {
                        scope.onChangeState(newVal);
                    }
                );
            }
        };
    }
]);
