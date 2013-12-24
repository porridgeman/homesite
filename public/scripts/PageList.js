function PageList() {

	this.linkUpdate = function(a) {
		return ({
			url: a.attr("href"),
			label: a.text()
		});
	};

	this.sendUpdates = function(indexList, updates, callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/pages/" + indexList,
			data: {updates: updates},
			method: "PUT",
			success: callback
		});
	};

	this.sendInsert = function(index, update, callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/pages/" + index,
			data: update,
			method: "POST",
			success: callback
		});
	};

	this.sendRemove = function(callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/pages/" + this.selectedIndex,
			method: "DELETE",
			success: callback
		});
	};

	this.addPageHandlerFactory = function(list) {
		return {
			autoOpen: false,
			height: 150,
			width: 420,
			modal: true,
			buttons: {
				"Add page": function() {
					var name = $("input#pageName").val();
					var title = $("input#pageTitle").val();
					var self = this;
					list.sendInsert(list.selectedIndex, {name: name, title: title}, function(data) {
						var http = '<p class="link"><a class="link" href="/pages/' + name + '" target="_blank">' + title + '</a></p>';
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

	this.container.find("form#pages").dialog(this.addPageHandlerFactory(this));

	this.container.find("button.add").click(this, function(event) {
		//event.data.container.find("form#pages").dialog("open"); // TODO: why doesn't this work?
		$("form#pages").dialog("open");
	});
}

PageList.prototype = Object.create(EditableList.prototype);
PageList.prototype.constructor = PageList;
