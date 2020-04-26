daystageApp.factory('DateProvider', [

    function () {
        return {

            /**
             * Get months.
             *
             * @returns {Array}
             */
            months: function () {
                var months = [];
                for (var i = 1; i <= 12; i++) {
                    if (i < 10)
                        i = '0' + i;
                    months.push(i);
                }

                return months;
            },

            /**
             * Get Years.
             *
             * @returns {Array}
             */
            years: function () {
                var years = [];
                for (var i = new Date().getFullYear(); i >= 1930; i--) {
                    years.push(i);
                }

                return years;
            },

            /**
             * Get days base on the current month and year.
             *
             * @param model The Model
             * @param dayAttribute String. The day attribute in the model The value will be altered
             * if the value is greater than the calculated number of days.
             * @param currentMonthSelected The selected month.
             * @param currentYearSelected The selected Year
             * @returns {Array} Array of days.
             */
            days: function (model, dayAttribute, currentMonthSelected, currentYearSelected) {

                var limit = 31;
                var days = [];

                if (typeof currentMonthSelected != 'undefined' && typeof currentYearSelected != 'undefined') {
                    limit = new Date(currentYearSelected, currentMonthSelected, 0).getDate();
                } else {
                    limit = 31;
                }

                if (model[dayAttribute] > limit)
                    model[dayAttribute] = undefined;

                for (var i = 1; i <= limit; i++) {
                    if (i < 10)
                        i = '0' + i;

                    days.push(i);
                }

                return days;

            }

        };
    }
]);
