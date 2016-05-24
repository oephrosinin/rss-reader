"use strict";

import Rss       from "./lib/modules/rssReader"; // Module for reading rss
import Chart     from "chart.js";                // Module for drawing diagrams
import Functions from "./lib/Functions";         // Helpful functions

$( document ).ready(() => {

    // variable for store the diagram
    let diagram   = false;
    let rssReader = new Rss();

	/**
	 * Validate form
     */
    $("#add-channel").validate();
    $("#edit-channel").validate();


    /**
     * Handle cLick on channel link
     */
    $(document).on('click', '.channels .item a', (e) => {
        let elem = $(e.target);
        let parentElem = $(e.target).parent('.item');

        // If element is already active
        if (parentElem.hasClass('active')) {
            return false;
        }

        // make new item active and clean old active classes
        $('.channels .item').removeClass('active');
        parentElem.addClass('active');

        // load the clicked channel
        rssReader.loadChannel(elem.data('id'), elem.data('url'));
    });


    /**
     * Handle click on icon edit
     */
    $(document).on('click', '.edit-channel', (e) => {
        let link        = $(e.target).closest('.edit-channel');
        let channelItem = link.parent('.edit-block').prev();

        let formEdit = $("#edit-channel");
        formEdit.data('id', link.data('id'));
        formEdit.find('#edit-name').val(channelItem.text());
        formEdit.find('#edit-link').val(channelItem.data("url"));

        return false;
    });


    /**
     * Handle click on icon remove
     */
    $(document).on('click', '.remove-channel', (e) => {
        let removeLink = $(e.target).closest('.remove-channel');
        let id = removeLink.data('id');

        if (!id) {
            return Functions.showMsg("Something wrong cannot remove channel")
        }

        Functions.sendRequest("/rss/remove/channel/"+id, "", {method: "get"})
            .then(({message}) => {
                removeLink.parents('.item').remove();
                Functions.showMsg(message);
            })
            .catch(Functions.showMsg);
        
        return false;
    });


    /**
     * Handle click on message link and open the message in details
     */
    $(document).on('click', '.read-msg', (e) => {
        e.preventDefault();

        // Get the msg content and title
        let msgBlock     = $(e.target).parent();
        let contentBlock = msgBlock.find('.body');
        let content      = contentBlock.html();
        let title        = msgBlock.find('.read-msg').text();

        // If do not have content, just
        if (!content) {
            return Functions.showMsg("Cannot read the message");
        }


        // Fill the msg content block
        let msgFolder = $('.block.message .info');
        msgFolder.html(`<h2>${title}</h2> ${content}`);
        msgFolder.scrollTop(0);



        // Fill the msg stat block
        content = contentBlock.text();
        let contentLetters = content.replace(/[^a-z]+/gi, '').toLowerCase();

        // Check the latin letters length
        let msgStatBlock = $('.txt-stat .content');
        if (!contentLetters) {
            return msgStatBlock.html(`Empty content`);
        }

        // Get string stats for diagram
        let {labels = [], data: _data = [], backgroundColor = [], hoverBackgroundColor = []} = Functions.getTextStat(contentLetters);

        // If diagram already exists, destroy it
        if (diagram && "destroy" in diagram) {
            diagram.destroy();
        }

        // Draw the circle diagram
        diagram = new Chart(document.getElementById("myChart"), {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: _data,
                    backgroundColor,
                    hoverBackgroundColor
                }]}});

        // Write the additional info
        msgStatBlock.html(`Text length: ${content.length}, latin letters amount: ${contentLetters.length}`);
    });


    /**
     * Handle submit on channel add form
     */
    $(document).on('submit', 'form#add-channel', (e) => {
        let form = $(e.target);
        let name = $.trim(form.find("input[name='name']").val());
        let link = $.trim(form.find("input[name='link']").val());

        Functions.sendRequest("/rss/create/channel", { name, link })
            .then(({channel, message}) => {

                // Alert success message
                Functions.showMsg(message);

                // Render created channel at the end of the list
                $('.channels .item').last().after(

                    `<div class="item">
                        <a href="#" data-id="${channel._id}" data-url="${channel.link}" onclick="return false">${channel.name}</a>
                        <div class="edit-block">
                           <a href="#" data-id="${channel._id}" data-toggle="modal" data-target="#modalEdit" onclick="return false" class="edit-channel"><span class="glyphicon glyphicon-pencil"></span></a>
                           <a href="#" data-id="${channel._id}" onclick="return false" class="remove-channel"><span class="glyphicon glyphicon-remove"></span></a>
                        </div>
                    </div>`);
            })
            .catch(Functions.showMsg);

        return false;
    });


	/**
	 * Handle click on icon edit
     */
    $(document).on('submit', 'form#edit-channel', (e) => {
        let form = $(e.target);
        let id   = form.data('id');
        let name = $.trim(form.find("input[name='name']").val());
        let link = $.trim(form.find("input[name='link']").val());

        Functions.sendRequest("/rss/edit/channel", { id, name, link })
            .then(({channel, message}) => {

                // Alert success massage and close the modal
                Functions.showMsg(message);
                $('.modal').modal('hide');

                // Set data to edited channel
                let editedItem = $(`.channels .item > [data-id=${id}]`);
                editedItem.data("url", link);
                editedItem.text(name);
            })
            .catch(Functions.showMsg);

        return false;
    })

});