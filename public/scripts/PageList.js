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

	$("form#pages").dialog(this.addPageHandlerFactory(this));

	$("button.add").click(function() {
		$("form#pages").dialog("open");
	});
}

PageList.prototype = Object.create(EditableList.prototype);
PageList.prototype.constructor = PageList;
