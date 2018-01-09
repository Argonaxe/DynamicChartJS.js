/**
 * @file DynamicChartJS.js
 * @class DynamicChart the purpose of this class is to work along side chart.js,
 *        allowing the user to input some html element, and update the chart
 * @required @param {Multi Dimensional Array[Int]} mad  = multi dimensional array, an example has been provided below.
 * @required @param {Array[String]} labels = an array of labels
 * @param {String} chartType = the chart type that you want to maybe change to
 * @author Joseph Evans <joe.evs196@hotmail.co.uk>
 * @version 0.0.1
 * @file DynamicCharts.js
 * @requires {chart.js (RECOMMENDED:- version 2.7.1+)}
 * TODO: add the ability to change chart types
 * TODO: add the ability to change the defaults (options & data)
 * BUG: this fails when using chart.js version 1.0.2 (chart.bar is not a function)
 *      it appears that the options are seupt differently
 *      the bug just appears that the options don't seem to work, nor does the styling
 * @return {Object}
 * @copyright Joseph Evans
 * @license MIT License
 */
function DynamicChart (mda, lbls, chartType) {


    /**
     * @private addEventHandler
     * @required @param {HTML Object} elem = the html element that you wish to target
     * @required @param {String} eventType = the event that you want the action to occur on
     * @required @param {Function} handler = the callback function
     */
    var addEventHandler = function (elem, eventType, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(eventType, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + eventType, handler);
        }
    };


    /**
     *  @private NOTE: this is just an object which houses the @private functions
     * the data amd options below are default, I should implement a way to changed
     * these
     * @class PrivateObject
     */
    var PrivateObject = {
        /**
         * @private temp place to hold the data for the data attribtue below
         * BUG: the reason why this is here is due to the fact that it was a bit buggy with chart js
         */
        dataBlocks : mda,


        /**
         * @private this is the objects chart reference
         */
        ctx : '',


        /**
         * @private default setup for the data for chart.js
         */
        data : {
            labels: lbls,
            datasets: [{
                label: "Temps",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: mda[0]
            }]
        },


        /**
         * @private default setup for the options for chart.js
         */
        options : {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: false,
                    gridLines: {
                        display: true,
                        color: "rgba(255,99,132,0.2)"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        },


        /**
         * @private isDefined
         * @required @param {*} onj = the object/value that you want to test
         * @return {Boolean}
         */
        isDefined : function (obj) {
            if (obj != null && typeof obj != 'undefined' && obj != '') return true;
            else return false;
        },


        /**
         * @private isList
         * NOTE: the purpose of this function is to see if the object is a list of objects or not
         * @required @param {HTML Object}
         * @return {Boolean}
         */
        isList : function (obj) {
            if (obj instanceof HTMLCollection
                || (this.isDefined(obj.length)
                && obj.length > 1)
                && obj.tagName.toLowerCase() != 'select'
            ) return true;
            else return false;
        },


        /**
         * @private setHtmlElement
         * NOTE: the purpose of this function is to set this objects target html element
         * @required @param {HTML Object}
         * @return {Void}
         */
        setHtmlElement : function (html) {
            this.ctx = html;
        },

        /**
         * @private resetCanvas
         * NOTE: the purpose of this function is to just reset the canvas, it deletes the old html canvas
         *       and then creates a new one
         * @required @param {HTML Object} elm = the NAME of the html elemnt's ID that you wish to target
         * @return {HTML Object}
         */
        resetCanvas : function (elm) {
            var x = document.getElementById(elm);
            var parent = x.parentNode;
            var inner = "<canvas id='" + elm + "'></canvas>";
            parent.innerHTML = inner;
            return parent.firstChild;
        },


        /**
         * @private updateData
         * NOTE: the purpose of this function is to purely update the data, then reset the canvas
         * @required @param {Int} ind = the index of the multi dimensional array that you wish to target
         * @required @param {String} chartId = the id of the chart that you're trying to target
         * @return {Void}
         */
        updateData : function (ind, chartId) {
            this.data.datasets[0].data = this.dataBlocks[ind];
            this.setHtmlElement(this.resetCanvas(chartId));
            this.renderChart();
        },


        /**
         * @private getIndex
         * NOTE: the purpseo of this function is to try different techniques to get the index of the data array
         * @required @param {String} dataAttr = the data attribute of swithElm
         * @required @param {String} chartId =  the chart itself
         * @return {Int}
         */
        getIndex : function (swithElm, dataAttr) {
            var ind;

            if (this.isList(swithElm)) {
                swithElm = event.target;
            }

            if (this.isDefined(swithElm.getAttribute(dataAttr))) {
                ind = swithElm.getAttribute(dataAttr);
            } else if (this.isDefined(swithElm.dataAttr)) {
                ind = swithElm.dataAttr;
            } else if (dataAttr == "value") {
                ind = swithElm.value;
            } else if (this.isDefined(swithElm.options[swithElm.selectedIndex])) {
                ind = swithElm.options[swithElm.selectedIndex];
            } else if (this.isDefined(swithElm[dataAttr])) {
                ind = swithElm[dataAttr];
            } else if (typeof ind == 'undefined') {
                return 0;
            } else { // fallback to ensure that a number is always returned
                return 0;
            }

            return ind;
        },

        /**
         * @private runner
         * NOTE: basic function that updates the data
         * @required @param {HTML Object} swithElm = the html element that you want to get data from
         * @required @param {String} dataAttr = the data attribute of swithElm
         * @required @param {String} chartId =  the chart itself
         * @return {Void}
         */
        runner : function (swithElm, dataAttr, chartId) {
            var ind = this.getIndex(swithElm, dataAttr);
            this.updateData(ind, chartId)
        },


        /**
         * @private renderChart
         * NOTE: hte purpose of this function is to re-render the chart
         * @return {Void}
         */
        renderChart : function () {
            var data = this.data;
            var options = this.options;
            var ctx = this.ctx;


            // BUG: this is where the bug i mentioned above occurs, it's a partial fix at least, rather than
            //      have the code come to a stand still at least.
            try {
                Chart.Bar(ctx, { data, options });
            } catch (e) {
                new Chart(ctx).Bar( data, options );
            }
        },
    };

    /**
     * @public NOTE: this just contains all of the @public functions that you'd like to return
     * @class PublicObject
     */
    var PublicObject = {


        /**
         * @public showChart
         * NOTE: the purpose of this function is to just initiate the object
         * @required @param {String} chartId = the name of the id chart element
         * @required @param {String} eventType = the event that updates the chart
         * @required @param {HTML Object} swithElm = the switching elemnt
         * @required @param {String} dataAttr = the data attribute(s)
         * @param {Int} ind = the initial index that you wish to load
         * @param {Object} data = the data object to be passed into the private object
         * @param {Object} options = the options to be passed into the private object
         * @return {Void}
         */
        showChart : function (chartId, eventType, swithElm, dataAttr, ind, data, options) {
            if (PrivateObject.isDefined(ind) && !isNaN(ind) && ind > -1) {
                PrivateObject.data.datasets[0].data = PrivateObject.dataBlocks[ind];
            } if (PrivateObject.isDefined(data) && typeof data == 'object') {
                PrivateObject.data = data;
            } if (PrivateObject.isDefined(options) && typeof options == 'object') {
                PrivateObject.options = options;
            }


            var ctx = document.getElementById(chartId).getContext("2d");
            var data = PrivateObject.data;
            var options = PrivateObject.options;
            var tempFunction = function () { PrivateObject.runner(swithElm, dataAttr, chartId) };


            PrivateObject.setHtmlElement(document.getElementById(chartId));
            PrivateObject.renderChart();
            if (PrivateObject.isList(swithElm)) {
                for (var i = 0, s = swithElm.length; i < s;) {
                    var current = swithElm[i++];
                    addEventHandler(current, eventType, tempFunction);
                }
            } else {
                addEventHandler(swithElm, eventType, tempFunction);
            }
        },

        /**
         * @public getData
         * NOTE: The purpose of this function is to return the private objects data
         *       this way the user can change it as they like
         * @return {Object}
         */
        getData : function () {
            return PrivateObject.data;
        },


        /**
         * @public setData
         * NOTE: the purpose of this function is to allow the user to edit the data outside
         *      of the object
         * @required @param newData = the new data that will be assigned to this objects data
         * @return {Void}
         */
        setData : function (newData) {
            if (PrivateObject.isDefined(newData)) {
                PrivateObject.data = newData;
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.renderChart();
            }
        },


        /**
         * @public getOptions
         * NOTE: the purpose of this function is to allow users to retrieve the options
         *       and edit them as they like
         * @return {Object}
         */
        getOptions : function () {
            return PrivateObject.options;
        },


        /**
         * @public
         * NOTE: the purpose of this function is to allow the user to update the options as they like
         * @required @param newOptions = a new set of options for the chart js
         * @return {Void}
         */
        setOptions : function (newOptions) {
            if (PrivateObject.isDefined(newOptions)) {
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.options = newOptions;
                PrivateObject.renderChart();
            }
        }
    };


    return PublicObject;
};