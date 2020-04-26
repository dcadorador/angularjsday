/**
 * compareTo Directive
 *
 * Validates an element to a certain value of a model.
 */
 daystageApp.directive("compareTo", function () {
     return {
         require: "ngModel",
         scope: {
             otherModelValue: "=compareTo"
         },
         link: function (scope, element, attributes, ngModel) {

             ngModel.$validators.compareTo = function (modelValue) {
                 return modelValue == scope.otherModelValue;
             };

             scope.$watch("otherModelValue", function () {
                 ngModel.$validate();
             });
         }
     };
 });
