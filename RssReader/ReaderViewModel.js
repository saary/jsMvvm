(function (window, $, jsMvvm, google) {
    "use strict";

    window.ReaderViewModel = {
        rssUrl: "",
        loadFeedCommand: function (arg) {
            var self = arg.data,
                feed = new google.feeds.Feed(self.rssUrl),
                containerId = $(this).attr("cmdArg");

            // Calling load sends the request off.  It requires a callback function.
            feed.load(function (result) {
                var feedList = $('#' + containerId),
                    templateId = feedList.attr("template"),
                    template = $('#' + templateId);

                if (!result.error) {
                    feedList.empty();
                    template.tmpl(result.feed.entries).appendTo(feedList);
                }
            });
        },
        moreCommand: function () {
            var commandingElement = $(this),
                // an assumption that our parent is the templated item
                templatedElement = commandingElement.parent(), 
                feedEntry = templatedElement.tmplItem().data,
                contentSelector = commandingElement.attr("cmdArg"),
                contentElement = templatedElement.children(contentSelector).first();

            contentElement.html(feedEntry.content);
            commandingElement.hide();
        },
        bind: function () {
            jsMvvm.bindCommands(this);
            jsMvvm.bindDataLinks($(document), this);
        }
    };

    $(document).ready(function () {
        window.ReaderViewModel.bind();
    });
}(window, jQuery, jsMvvm, google));