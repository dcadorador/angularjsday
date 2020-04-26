daystageApp.factory('DialogHelper', [
    '$mdMedia',
    '$mdDialog',
    function ($mdMedia, $mdDialog) {
        return {

            /**
             * Show a dialog using a with default template.
             *
             * @param scope Required. The scope will attached with some code to calculate the dialog width.
             * @param imageUrl Optional. Image URL.
             * @param title Optional. Title of the dialog.
             * @param content Optional. The content of the dialog.
             * @param controller Optional. Controller of the dialog.
             * @param options Optional. Overrides some dialog options.
             * @param templateOptions Overrides some template options.
             * @returns {promise}
             */
            showBasic: function (scope, imageUrl, title, content, controller, options, templateOptions) {

                var _this = this;

                scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scope.customFullscreen;

                scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    scope.customFullscreen = (wantsFullScreen === true);
                });

                var template =
                    '<md-dialog class="basic-dialog" flex="@width" aria-label="Edit Profile">' +
                    '<md-toolbar class="basic-dialog-toolbar">' +
                    '<div class="md-toolbar-tools">' +
                    '<h4 class="title">' +
                    (imageUrl ? '<img ng-src="' + imageUrl + '" alt="...">' : '') +
                    '<span>' + title + '</span>' +
                    '</h4>' +
                    '<span flex></span>' +
                    '<button ng-disabled="isLoading" class="btn btn-dialog-close" ng-click="cancel()">' +
                    '<img ng-src="images/times-red.png" alt="...">' +
                    '</button>' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-progress-linear ng-if="isLoading" md-mode="indeterminate"></md-progress-linear>' +
                    '<md-dialog-content>' +
                    '<div class="md-dialog-content" style="@contentStyle">' +
                    content +
                    '</div>' +
                    '</md-dialog-content>' +
                    '</md-dialog>';

                /* More options maybe */
                var _templateOptions = {
                    width: 80,
                    contentStyle: ''
                };

                if (typeof templateOptions != 'undefined') {
                    angular.extend(_templateOptions, templateOptions);
                }

                /* Todo: Improve. Use $compile to make more options */
                template = template.replace('@width', _templateOptions.width.toString());
                template = template.replace('@contentStyle', _templateOptions.contentStyle.toString());

                var _options = {
                    controller: controller || _this.defaultController(),
                    template: template,
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                };

                if (typeof options != 'undefined') {
                    angular.extend(_options, options);
                }

                return $mdDialog.show(_options);

            },

            /**
             * Show a custom dialog.
             *
             * @param scope Required.
             * @param controller Optional.
             * @param templateUrl Optional.
             * @param parent Optional
             * @returns {promise}
             */
            showAdvanced: function (scope, controller, templateUrl, parent) {

                var _this = this;

                scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scope.customFullscreen;

                scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    scope.customFullscreen = (wantsFullScreen === true);
                });

                return $mdDialog.show({
                    controller: controller || _this.defaultController(),
                    templateUrl: templateUrl || './views/partials/_basic-dialog.html',
                    parent: parent || angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });

            },

            /**
             * Show a confirm dialog.
             *
             * @param title
             * @param content
             * @returns {*}
             */
            confirm: function (title, content) {
                var confirm = $mdDialog.confirm()
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Confirm')
                    .ok('Yes')
                    .cancel('No');
                return $mdDialog.show(confirm);
            },

            /**
             * Show a basic alert dialog.
             *
             * @param title
             * @param content
             * @param parent
             */
            inform: function (title, content, parent) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(parent || document.body))
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ok('Ok')
                );
            },

            /**
             * The common controller with hide, cancel, answer.
             *
             * @returns {*[]}
             */
            defaultController: function () {
                return [
                    '$scope',
                    '$mdDialog',
                    function ($scope, $mdDialog) {

                        $scope.isLoading = false;

                        $scope.hide = function () {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.answer = function (answer) {
                            $mdDialog.hide(answer);
                        };

                        $scope.$on('EVENTS_DIALOG_LOADING', function () {
                            $scope.isLoading = true;
                        });

                        $scope.$on('EVENTS_DIALOG_NOT_LOADING', function () {
                            $scope.isLoading = false;
                        });

                    }
                ];
            },

            /**
             * Close the currently opened dialog.
             */
            close: function () {
                $mdDialog.hide();
            }


        };
    }
]);
