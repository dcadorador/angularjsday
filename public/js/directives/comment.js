daystageApp.directive("comment", [
    '$rootScope',
    'User',
    'Stage',
    function($rootScope, User, Stage) {
        return {
            restrict: 'E',
            scope: {
                comment: "="
            },
            templateUrl: "./views/partials/_comment.html",
            link: function(scope, element, attributes) {

                scope.tempComment = scope.comment.comment;

                scope.own = User.getUserId() == scope.comment.user.id;
                scope.edit = false;

                scope.updateComment = function() {
                    Stage.updateComment(scope.comment.stageId, scope.tempComment).then(function() {
                        scope.comment.comment = scope.tempComment;
                        scope.edit = false;
                    });
                };

                scope.deleteComment = function() {
                    Stage.deleteComment(scope.comment.stageId).then(function() {
                        var e = $(element).find('.comment-container');
                        e.fadeOut('slow', function() {
                            element.remove();
                            // console.log(scope.comment);
                            $rootScope.$broadcast('events.stage.remove.comment', scope.comment.stageId);
                        });
                    });
                };
            }
        };
    }
]);
