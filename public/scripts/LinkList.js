function LinkList() {

	this.linkUpdate = function(a) {
		return ({
			url: a.attr("href"),
			label: a.text()
		});
	};

	this.sendUpdates = function(indexList, updates, callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + indexList,
			data: {updates: updates},
			method: "PUT",
			success: callback
		});
	};

	this.sendInsert = function(index, update, callback) {
		this.ajaxPost("/api/pages/" + this.pageName + "/links/" + index, update, callback)
	};

	this.sendRemove = function(callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + this.selectedIndex,
			method: "DELETE",
			success: callback
		});
	};

	this.addLinkHandlerFactory = function(list) {
		return {
			autoOpen: false,
			height: 150,
			width: 420,
			modal: true,
			buttons: {
				"Add link": function() {
					var label = $("input#linkLabel").val();
					var url = $("input#linkUrl").val();
					var self = this;
					list.sendInsert(list.selectedIndex || 0, {label: label, url: url}, function(data) {
						var http = '<p class="link"><a class="link" href="' + url + '" target="_blank">' + label + '</a></p>';
						if (list.selectedIndex) {
							$(http).click(list, list.paragraphClickHandler).insertBefore(list.container.find("p")[list.selectedIndex]);
							list.selectedIndex++;
						} 
						else {
							$(http).click(list, list.paragraphClickHandler).insertAfter(list.container.find("h3"));
						}
						$(self).dialog( "close" );
					});	
				},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			}
		};
	};

	EditableList.apply(this, arguments);

	this.container.find("form#links").dialog(this.addLinkHandlerFactory(this));

	this.container.find("button.add").click(this, function(event) {
		//event.data.container.find("form#links").dialog("open"); // TODO: why doesn't this work?
		$("form#links").dialog("open");
	});
}

LinkList.prototype = Object.create(EditableList.prototype);
LinkList.prototype.constructor = LinkList;
