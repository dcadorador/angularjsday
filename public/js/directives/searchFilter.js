daystageApp.directive('searchFilter', [
    'SearchService',
    '$timeout',
    function(SearchService, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {

                $timeout(function() {
                    element.bind(attributes.searchFilterOn, function() {

                        if (!attributes.searchValue) {
                            return;
                        }

                        var sortBy = {
                            people: ['followers', 'videos', 'applause'],
                            stage: ['recent', 'applause', 'views']
                        };

                        if(sortBy[attributes.searchValue] && sortBy[attributes.searchValue].indexOf(SearchService["sortBy"]) === -1){
                          SearchService.sortBy = sortBy[attributes.searchValue][0];
                        }
                        SearchService.clear();
                        SearchService[attributes.searchFilter] = attributes.searchValue;
                        SearchService.search();
                    });
                });

            }
        };
    }
]);
