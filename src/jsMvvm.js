(function (window, $) {
    "use strict";
    function endsWith(str, strEnding) {
        /// <summary>
        /// Checks if a string ends with a given ending
        /// </summary>
        /// <param name="str" type="String">The string to check</param>
        /// <param name="strEnding" type="String">The ending to verify</param>
        /// <returns type="Boolean">true if the strings ends with the given ending, false otherwise</returns>
        var ending = str.substr(str.length - strEnding.length, strEnding.length);
        return ending === strEnding;
    }

    window.jsMvvm = {
        /// <summary>
        /// An MVVM utility helper class for data binding and commanding support
        /// </summary>
        bindCommands: function (viewModel) {
            /// <summary>
            /// Binds a view model commands to the view
            /// </summary>
            /// <param name="viewModel" type="Object">A view model to bind</param>
            var key,
                jqElem = $(document);

            for (key in viewModel) {
                if (endsWith(key, "Command")) {
                    jqElem.selector = "[command='" + key + "']:not([cmdEvents])";
                    jqElem.live('click', viewModel, viewModel[key]);

                    jqElem.selector = "[command='" + key + "'][cmdEvents~=click]";
                    jqElem.live('click', viewModel, viewModel[key]);

                    jqElem.selector = "[command='" + key + "'][cmdEvents~=change]";
                    jqElem.live('change', viewModel, viewModel[key]);

                    jqElem.selector = "[command='" + key + "'][cmdEvents~=keyup]";
                    jqElem.live('keyup', viewModel, viewModel[key]);

                    jqElem.selector = "[command='" + key + "'][cmdEvents~=keydown]";
                    jqElem.live('keydown', viewModel, viewModel[key]);
                }
            }
        },
        bindDataLinks: function (view, viewModel) {
            /// <summary>
            /// Initiates the data links for whole view with the given view model
            /// </summary>
            /// <param name="view" type="jQueryObject">A view to data link</param>
            /// <param name="viewModel" type="Object">A view model to data link</param>
            this.unlink(view);
            this.link(view, viewModel);
        },
        unlink: function (jqElement, obj) {
            jqElement.unlink(obj);
        },
        link: function (jqElement, obj, refresh) {
            var mapping = this.getDataLinkMapping(jqElement),
                key;

            jqElement.link(obj, mapping);
            if (refresh) {
                for (key in mapping) {
                    if (mapping.hasOwnProperty(key)) {
                        $(obj).setField(key, obj[key]); // refresh the data
                    }
                }
            }
        },
        getDataLinkMapping: function (jqElement) {
            var mapping = {};
            // iterate over all elements with data link attributes and generate a mapping
            // between the element 'value' attribute to a specific JavaScript context property
            // usually the context will be view model object
            jqElement.find('[datalink]').each(function () {
                var memberName = $(this).attr('datalink'),
                    target = this.id,
                    setter = $(this).attr('dataLinkSetter') || "val";

                if (memberName && target) {
                    mapping[memberName] = {
                        name: target,
                        convertBack: function (value, source, target) {
                            if (setter === "text" || setter === "val" || setter === "html") {
                                $(target)[setter](value);
                            } else {
                                $(target).attr(setter, value);
                            }
                        }
                    };
                }
            });

            return mapping;
        }
    };
}(window, jQuery));