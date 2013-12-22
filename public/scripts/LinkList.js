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
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + index,
			data: update,
			method: "POST",
			success: callback
		});
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
					list.sendInsert(list.selectedIndex, {label: label, url: url}, function(data) {
						$('<p class="link"><a class="link" href="' + url + '" target="_blank">' + label + '</a></p>').click(list, list.paragraphClickHandler).insertBefore(list.container.find("p")[list.selectedIndex]);
						list.selectedIndex++;
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

	this.container.find("button.add").click(function() {
		this.container.find("form#links").dialog("open");
	});
}

LinkList.prototype = Object.create(EditableList.prototype);
LinkList.prototype.constructor = LinkList;
