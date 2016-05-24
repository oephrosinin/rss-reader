export default class rss {


    /**
     * Run selected channel
     * @param id
     * @param link
     */
    loadChannel(id, link) {
        let block = $('.channel .content');

        // Clean html of channel
        block.html("<span class='info'>Waiting for channel data</span>");

        // Get rss data
        block.rss(link, {
            limit: 25,
            dateFormat: 'MMMM Do, YYYY',
            layoutTemplate: '<div class="items">{entries}</div>',
            entryTemplate: '<div class="item">' +
                                '<a href="{url}" class="read-msg">{title}</a>' +
                                '<div class="descr">{shortBodyPlain}</div>' +
                                '<div class="publish"><span class="author">{author}</span></div>' +
                                '<div class="hidden"><div class="body">{body}</div></div>' +
                            '</div>',
            error: (error) => {
                // Clean html of channel
                block.html("<span class='error'>Cannot load the data</span>");
                // Save error to some logger
            },
            success: () => {
                block.find('.info').remove();
            },
            onData: (data) => {
                // this.channel = data;
                let entries = data.entries || [];
                let authors = [];

                // Check the unique authors
                for (let i = 0; i < entries.length; i++) {
                    if (!authors.includes(entries[i].author)) {
                        authors.push(entries[i].author);
                    }
                }

                block.prepend(`<h2>${data.title}</h2><h5>Messages: ${entries.length}, Authors: ${authors.length}</h5>`);
            }
        }).show();
    };    
}